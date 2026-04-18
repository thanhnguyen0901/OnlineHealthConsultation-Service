import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role, User } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';

import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { maskIp, sanitizeAuditMetadata } from '../../common/privacy/privacy.util';

type JwtPayload = {
  sub: string;
  role?: Role;
  sid?: string;
  type?: 'refresh';
  exp?: number;
};

@Injectable()
export class AuthService {
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-dev';
  private readonly refreshExpire = process.env.JWT_REFRESH_EXPIRE ?? '7d';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Account is disabled');
    }

    const tokens = await this.issueSessionTokens(user, userAgent, ipAddress);
    await this.createAuditLog(user.id, 'LOGIN_SUCCESS', 'AUTH', user.id, {
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
    return tokens;
  }

  async refresh(dto: RefreshTokenDto, userAgent?: string, ipAddress?: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.sid || payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const refreshTokenHash = this.hashToken(dto.refreshToken);
    const session = await this.prisma.userSession.findFirst({
      where: {
        id: payload.sid,
        userId: payload.sub,
        refreshTokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Refresh token has been revoked or expired');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Account is disabled');
    }

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date(), rotatedAt: new Date() },
    });

    const tokens = await this.issueSessionTokens(user, userAgent, ipAddress);
    await this.createAuditLog(user.id, 'TOKEN_REFRESHED', 'AUTH', user.id, {
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await this.createAuditLog(userId, 'LOGOUT', 'AUTH', userId);

    return { message: 'Logout successful' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isActive || user.deletedAt) {
      return {
        message: 'If the email exists, reset instructions have been generated',
      };
    }

    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(plainToken);

    await this.prisma.passwordResetToken.create({
      data: {
        id: uuidv7(),
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await this.createAuditLog(user.id, 'PASSWORD_RESET_REQUESTED', 'AUTH', user.id);

    return {
      message: 'If the email exists, reset instructions have been generated',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);
    const newPasswordHash = await bcrypt.hash(dto.newPassword, bcryptRounds);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash: newPasswordHash },
      });

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });

      await tx.userSession.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    });

    await this.createAuditLog(resetToken.userId, 'PASSWORD_RESET_COMPLETED', 'AUTH', resetToken.userId);

    return { message: 'Password reset successful' };
  }

  private async issueSessionTokens(user: User, userAgent?: string, ipAddress?: string) {
    const sessionId = uuidv7();

    const accessPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      sid: sessionId,
      type: 'refresh',
    };

    const accessToken = await this.jwtService.signAsync(accessPayload);
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpire as any,
    });

    const decodedRefresh = this.jwtService.decode(refreshToken) as JwtPayload;
    const expiresAt = decodedRefresh?.exp
      ? new Date(decodedRefresh.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.userSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async createAuditLog(
    actorUserId: string,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId,
        action,
        resource,
        resourceId,
        ipAddress: maskIp((metadata as any)?.ipAddress ?? null) ?? undefined,
        metadata: sanitizeAuditMetadata(metadata),
      },
    });
  }
}
