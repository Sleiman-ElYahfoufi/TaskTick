import { GeneratedTaskDto } from '../dto/generated-task.dto';
import { ProjectDetailsDto } from '../dto/project-details.dto';

export interface DecompositionResult {
  projectDetails?: ProjectDetailsDto;
  tasks: GeneratedTaskDto[];
  projectId?: number;
  saved: boolean;
  userId?: number; 
}