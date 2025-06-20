// src/auth/dto/register.dto.ts

import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { $Enums } from '../../../generated/prisma';
import UserRole = $Enums.UserRole;

export class RegisterUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsOptional() // Role is optional, defaults to CUSTOMER
  @IsEnum(UserRole, { message: 'Role must be either ADMIN or CUSTOMER' })
  role?: UserRole;
}
