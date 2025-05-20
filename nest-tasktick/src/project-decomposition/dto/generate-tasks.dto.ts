import { IsNumber, IsNotEmpty, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectDetailsDto } from './project-details.dto';

export class GenerateTasksDto {
  @ValidateNested()
  @Type(() => ProjectDetailsDto)
  projectDetails: ProjectDetailsDto;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  maxTasks?: number = 20;
}