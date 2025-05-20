import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { DetailDepth, PriorityLevel } from '../../projects/entities/project.entity';
import { IsPromptSafe } from '../validators/prompt-injection.validator';

export class ProjectDetailsDto {
  @IsNotEmpty()
  @IsString()
  @IsPromptSafe({ message: 'Project name contains potentially harmful content' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsPromptSafe({ message: 'Project description contains potentially harmful content' })
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