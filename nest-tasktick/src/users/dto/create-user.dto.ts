import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength,IsOptional } from 'class-validator';
import { ExperienceLevel, UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;
  
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  role?: UserRole;

  @IsOptional()
  @IsEnum(ExperienceLevel, { message: 'Experience level must be valid' })
  experience_level?: ExperienceLevel = ExperienceLevel.INTERMEDIATE;
}