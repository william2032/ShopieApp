// Interface for JWT payload
import { UserResponse } from './user.interfaces';
import { RegisterUserDto } from '../dtos/register.dto';
import { LoginUserDto } from '../dtos/auth.dto';
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Interface for login response
export interface LoginResponse {
  message: string;
  user: UserResponse;
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Interface for registration response
export interface RegisterResponse {
  message: string;
  user: UserResponse;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IAuthService {
  register(registerDto: RegisterUserDto): Promise<RegisterResponse>;

  login(loginDto: LoginUserDto): Promise<LoginResponse>;

  validateUser(email: string, password: string): Promise<UserResponse | null>;

  generateJwtToken(user: UserResponse): Promise<string>;

  verifyToken(token: string): Promise<JwtPayload>;
}
