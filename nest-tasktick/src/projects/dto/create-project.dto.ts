import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { DetailDepth, PriorityLevel, ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel = PriorityLevel.MEDIUM;

  @IsOptional()
  @IsEnum(DetailDepth)
  detail_depth?: DetailDepth = DetailDepth.NORMAL;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus = ProjectStatus.PLANNING;

  @IsNotEmpty()
  @IsNumber()
  estimated_time: number;

  @IsOptional()
  @IsNumber()
  accuracy_rating?: number = 0;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}