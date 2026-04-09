import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
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
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return {
      message: 'Login successful',
      ...result,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current logged in user details' })
  async getMe(@CurrentUser() user: any) {
    const userDetails = await this.usersService.findById(user.sub);
    const { passwordHash, ...safeUser } = userDetails as any;
    return safeUser;
  }
}
