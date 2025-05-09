import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { ProjectsService } from '../projects/projects.service';
import { UserTechStacksService } from '../user-tech-stacks/user-tech-stacks.service';
import { TimeTrackingsService } from '../time-trackings/time-trackings.service';
import { GenerateTasksDto } from './dto/generate-tasks.dto';
import { GeneratedTaskDto } from './dto/generated-task.dto';
import { DecompositionResult } from './interfaces/decomposition-result.interface';
import { Project, PriorityLevel as ProjectPriorityLevel, DetailDepth } from '../projects/entities/project.entity';
import { ExperienceLevel } from '../users/entities/user.entity';
import { PriorityLevel as TaskPriorityLevel } from '../tasks/entities/task.entity';

@Injectable()
export class ProjectDecompositionService {
    private readonly logger = new Logger(ProjectDecompositionService.name);
    private model: ChatOpenAI;

    private readonly taskSchema = z.object({
   
    });
  
 // Helper method for priority string validation
  private validatePriority(priority: string): string {
    const validPriorities = ['low', 'medium', 'high'];
    const normalized = (priority || '').toLowerCase();

    return validPriorities.includes(normalized) ? normalized : 'medium';
  }
}