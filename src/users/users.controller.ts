// src/user/user.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './dtos';
import { UserResponse } from './interfaces/user.interfaces';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    message: string;
    user: UserResponse;
  }> {
    const user = await this.userService.create(createUserDto);

    return {
      message: 'User created successfully',
      user,
    };
  }

  /**
   * Get all users (Admin only)
   * GET /users
   */
  @Get()
  // @UseGuards(AuthGuard, AdminGuard) // Uncomment when you implement guards
  async findAll(): Promise<{
    message: string;
    users: UserResponse[];
    count: number;
  }> {
    const users = await this.userService.findAll();
    return {
      message: 'Users retrieved successfully',
      users,
      count: users.length,
    };
  }

  /**
   * Get user profile (own profile or admin can view any)
   * GET /users/:id
   */
  @Get(':id')
  // @UseGuards(AuthGuard) // Uncomment when you implement guards
  async findOne(@Param('id') id: string): Promise<{
    message: string;
    user: UserResponse;
  }> {
    const user = await this.userService.findOne(id);

    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  /**
   * Update user information
   * PATCH /users/:id
   */
  @Patch(':id')
  // @UseGuards(AuthGuard) // Uncomment when you implement guards
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{
    message: string;
    user: UserResponse;
  }> {
    const user = await this.userService.update(id, updateUserDto);

    return {
      message: 'User updated successfully',
      user,
    };
  }

  /**
   * Delete user account
   * DELETE /users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(AuthGuard) // Uncomment when you implement guards
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  /**
   * Request password reset
   * POST /users/reset-password
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{
    message: string;
  }> {
    await this.userService.resetPassword(resetPasswordDto.email);

    return {
      message: 'Password reset instructions sent to your email',
    };
  }

  /**
   * Change user password
   * POST /users/:id/change-password
   */
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard) // Uncomment when you implement guards
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{
    message: string;
  }> {
    await this.userService.changePassword(id, changePasswordDto);

    return {
      message: 'Password changed successfully',
    };
  }
}
