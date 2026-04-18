import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersService } from './users.service';

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Admin lists users with filters and pagination' })
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.usersService.listUsers(query);
  }

  @Post()
  @ApiOperation({ summary: 'Admin creates a new patient/doctor user account' })
  createUser(@CurrentUser() user: { sub: string }, @Body() dto: AdminCreateUserDto) {
    return this.usersService.createUserByAdmin(user.sub, dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Admin gets full user detail' })
  getUserDetail(@Param('userId') userId: string) {
    return this.usersService.getUserDetailForAdmin(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Admin updates user account basic fields' })
  updateUser(
    @CurrentUser() user: { sub: string },
    @Param('userId') userId: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.updateUserByAdmin(user.sub, userId, dto);
  }

  @Patch(':userId/status')
  @ApiOperation({ summary: 'Admin activates/deactivates a user account' })
  updateUserStatus(
    @CurrentUser() user: { sub: string },
    @Param('userId') userId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateUserStatus(user.sub, userId, dto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Admin soft-deletes a user account' })
  deleteUser(@CurrentUser() user: { sub: string }, @Param('userId') userId: string) {
    return this.usersService.deleteUserByAdmin(user.sub, userId);
  }
}
