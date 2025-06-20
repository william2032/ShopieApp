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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserResponseDto,
  ErrorResponseDto,
  PasswordResetResponseDto,
} from './interfaces';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Register a new user account with email and password',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserResponseDto,
    example: {
      message: 'User created successfully',
      user: {
        id: '12345',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: ['email must be a valid email address'],
      error: 'Bad Request',
    },
  })
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
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users. Admin access required.',
  })
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
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve a specific user by their ID. Users can view their own profile, admins can view any profile.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '12345',
  })
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
  @ApiOperation({
    summary: 'Update user information',
    description:
      'Update user profile information. Users can update their own profile, admins can update any profile.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '12345',
  })
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
  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Delete a user account. Users can delete their own account, admins can delete any account.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '12345',
  })
  @ApiNoContentResponse({
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  /**
   * Request password reset
   * POST /users/reset-password
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset instructions to user email address.',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Email address for password reset',
  })
  @ApiOkResponse({
    description: 'Password reset instructions sent',
    type: PasswordResetResponseDto,
    example: {
      message: 'Password reset instructions sent to your email',
    },
  })
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
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change user password with current password verification.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '12345',
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Current and new password data',
  })
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
