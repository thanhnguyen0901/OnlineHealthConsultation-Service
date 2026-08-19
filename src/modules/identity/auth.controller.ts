import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DeactivateUserDto } from './dto/deactivate-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Ownership } from '../../common/decorators/ownership.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

type AuthCookieResult = Awaited<ReturnType<AuthService['login']>>;
type RequestWithCookies = Request & { cookies?: Record<string, string | undefined> };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    return {
      message: 'Registration successful',
      user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and set HttpOnly refresh cookie' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, req.headers['user-agent'], req.ip);
    this.setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
    return {
      message: 'Login successful',
      ...this.withoutRefreshToken(result),
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('ohc_refresh_token')
  @ApiOperation({ summary: 'Refresh access token using the HttpOnly refresh cookie' })
  async refresh(@Req() req: RequestWithCookies, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.refresh(
      req.cookies?.[this.refreshCookieName],
      req.headers['user-agent'],
      req.ip,
    );
    this.setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
    return {
      message: 'Token refreshed',
      ...this.withoutRefreshToken(result),
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate password reset token' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current user, revoke active sessions, and clear refresh cookie' })
  async logout(@CurrentUser() user: { sub: string }, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.logout(user.sub);
    this.clearRefreshCookie(res);
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
  @Ownership({ source: 'params', field: 'userId', allowAdmin: true })
  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user by id with ownership/admin policy' })
  async getUserById(@Param('userId') userId: string) {
    const userDetails = await this.usersService.findById(userId);
    const { passwordHash, ...safeUser } = userDetails as any;
    return safeUser;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('users/:userId/deactivate')
  @ApiOperation({ summary: 'Admin deactivates a user account' })
  async deactivateUser(
    @Param('userId') userId: string,
    @Body() dto: DeactivateUserDto,
    @CurrentUser() user: { sub: string },
  ) {
    const updated = await this.usersService.deactivateUser(user.sub, userId, dto.reason);
    return {
      message: 'User deactivated',
      user: updated,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current logged in user details' })
  async getMe(@CurrentUser() user: { sub: string }) {
    const userDetails = await this.usersService.findById(user.sub);
    const { passwordHash, ...safeUser } = userDetails as any;
    return safeUser;
  }

  private get refreshCookieName() {
    return process.env.AUTH_REFRESH_COOKIE_NAME ?? 'ohc_refresh_token';
  }

  private get refreshCookiePath() {
    return process.env.AUTH_REFRESH_COOKIE_PATH ?? '/api/auth';
  }

  private get refreshCookieSameSite(): CookieOptions['sameSite'] {
    const value = process.env.AUTH_REFRESH_COOKIE_SAME_SITE ?? 'lax';
    return value === 'strict' || value === 'none' ? value : 'lax';
  }

  private get refreshCookieSecure() {
    if (process.env.AUTH_REFRESH_COOKIE_SECURE !== undefined) {
      return process.env.AUTH_REFRESH_COOKIE_SECURE === 'true';
    }
    return process.env.NODE_ENV === 'production';
  }

  private refreshCookieOptions(expires?: Date): CookieOptions {
    const sameSite = this.refreshCookieSameSite;
    return {
      httpOnly: true,
      secure: sameSite === 'none' ? true : this.refreshCookieSecure,
      sameSite,
      path: this.refreshCookiePath,
      ...(expires ? { expires } : {}),
    };
  }

  private setRefreshCookie(res: Response, refreshToken: string, expiresAt: Date) {
    res.cookie(this.refreshCookieName, refreshToken, this.refreshCookieOptions(expiresAt));
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(this.refreshCookieName, this.refreshCookieOptions());
  }

  private withoutRefreshToken({ accessToken, user }: AuthCookieResult) {
    return { accessToken, user };
  }
}
