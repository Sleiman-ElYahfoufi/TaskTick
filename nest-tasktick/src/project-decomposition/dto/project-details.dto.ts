import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { DetailDepth, PriorityLevel } from '../../projects/entities/project.entity';

export class ProjectDetailsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(PriorityLevel, { message: 'Priority must be LOW, MEDIUM, or HIGH' })
  priority?: PriorityLevel = PriorityLevel.MEDIUM;

  @IsOptional()
  @IsEnum(DetailDepth, { message: 'Detail depth must be MINIMAL, NORMAL, or DETAILED' })
  detail_depth?: DetailDepth = DetailDepth.NORMAL;

  @IsOptional()
  @IsDateString()
  deadline?: Date;
}