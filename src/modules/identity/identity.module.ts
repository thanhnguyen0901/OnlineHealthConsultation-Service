import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminUserController } from './admin-user.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { NotificationModule } from '../notification/notification.module';
import { getRequiredEnv } from '../../common/config/env.util';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getRequiredEnv('JWT_SECRET'),
        signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRE || '15m') as any },
      }),
    }),
    NotificationModule,
  ],
  controllers: [AuthController, AdminUserController],
  providers: [UsersService, AuthService, JwtStrategy, RolesGuard, OwnershipGuard],
  exports: [UsersService, AuthService],
})
export class IdentityModule {}
