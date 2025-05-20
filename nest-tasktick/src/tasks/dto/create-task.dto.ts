import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min, Max } from 'class-validator';
import { PriorityLevel, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  estimated_time: number;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel = PriorityLevel.MEDIUM;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.TODO;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number = 0;

  @IsNotEmpty()
  @IsNumber()
  project_id: number;
}