import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dtos/register.dto';
import {
  LoginResponse,
  RegisterResponse,
} from '../users/interfaces/auth.interface';
import { LoginUserDto } from '../users/dtos/auth.dto';
import { UserResponse } from '../users/interfaces/user.interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<RegisterResponse> {
    return await this.authService.register(registerDto);
  }

  /**
   * Login user
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): {
    message: string;
    user: UserResponse;
  } {
    return {
      message: 'Profile retrieved successfully',
      user: req.user,
    };
  }

  /**
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Request() req): Promise<{
    message: string;
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const access_token = await this.authService.refreshToken(req.user);

    return {
      message: 'Token refreshed successfully',
      access_token,
      token_type: 'Bearer',
      expires_in: 24 * 60 * 60, // 24 hours
    };
  }

  /**
   * Logout user (client-side token invalidation)
   * POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(): Promise<{
    message: string;
  }> {
    return {
      message:
        'Logout successful. Please remove the token from client storage.',
    };
  }
}
