import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DetailDepth, PriorityLevel } from '../../projects/entities/project.entity';

export class ProjectDetailsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel = PriorityLevel.MEDIUM;

}