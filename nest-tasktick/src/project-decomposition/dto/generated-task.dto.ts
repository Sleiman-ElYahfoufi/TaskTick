import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, IsDateString } from 'class-validator';
import { PriorityLevel } from '../../tasks/entities/task.entity';
import { IsPromptSafe } from '../validators/prompt-injection.validator';

export class GeneratedTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsPromptSafe({ message: 'Task name contains potentially harmful content' })
  name: string;

  @IsOptional()
  @IsString()
  @IsPromptSafe({ message: 'Task description contains potentially harmful content' })
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  estimated_time: number;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel = PriorityLevel.MEDIUM;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number = 0;
}