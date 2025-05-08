import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, IsDateString } from 'class-validator';
import { PriorityLevel } from '../../tasks/entities/task.entity';

export class GeneratedTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  estimated_time: number;

  
}