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
    name: z.string().min(1).default('Untitled Task'),
    description: z.string().optional().default(''),
    estimated_time: z.union([
      z.number(),
      z.string().transform(val => parseFloat(val) || 1)
    ]).default(1),
    priority: z.string().transform(val => this.validatePriority(val)).default('medium'),
    dueDate: z.string().optional().transform(val => {
      if (!val) return undefined;
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    }),
    progress: z.number().optional().default(0)
  });

  private readonly tasksArraySchema = z.array(this.taskSchema);
 constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private userTechStacksService: UserTechStacksService,
    private timeTrackingsService: TimeTrackingsService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY not found in environment variables');
    }

    // Initialize the OpenAI model
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'o4-mini-2025-04-16',
      temperature: 1,
    });

    this.logger.log('ProjectDecompositionService initialized');
  }

  // Helper method for priority string validation
  private validatePriority(priority: string): string {
    const validPriorities = ['low', 'medium', 'high'];
    const normalized = (priority || '').toLowerCase();

    return validPriorities.includes(normalized) ? normalized : 'medium';
  }
 // Convert string priority to ProjectPriorityLevel enum
  private mapStringToProjectPriority(priority: string): ProjectPriorityLevel {
    const normalized = (priority || '').toLowerCase();

    switch (normalized) {
      case 'high':
        return ProjectPriorityLevel.HIGH;
      case 'low':
        return ProjectPriorityLevel.LOW;
      case 'medium':
      default:
        return ProjectPriorityLevel.MEDIUM;
    }
  }
  // Convert string detail depth to DetailDepth enum
  private mapStringToDetailDepth(detailDepth: string): DetailDepth {
    const normalized = (detailDepth || '').toLowerCase();

    switch (normalized) {
      case 'detailed':
        return DetailDepth.DETAILED;
      case 'minimal':
        return DetailDepth.MINIMAL;
      case 'normal':
      default:
        return DetailDepth.NORMAL;
    }
  }
    // Convert string priority to TaskPriorityLevel enum
    private mapStringToTaskPriority(priority: string): TaskPriorityLevel {
      const normalized = (priority || '').toLowerCase();
  
      switch (normalized) {
        case 'high':
          return TaskPriorityLevel.HIGH;
        case 'low':
          return TaskPriorityLevel.LOW;
        case 'medium':
        default:
          return TaskPriorityLevel.MEDIUM;
      }
    }
  private calculateRatio(priorityStats): string {
    return priorityStats.estHours > 0 ?
      (priorityStats.actualHours / priorityStats.estHours).toFixed(2) : 'unknown';
  }
}