import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TechCategory } from '../entities/tech-stack.entity';

export class CreateTechStackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(TechCategory, { message: 'Category must be a valid tech category' })
  category: TechCategory;
}