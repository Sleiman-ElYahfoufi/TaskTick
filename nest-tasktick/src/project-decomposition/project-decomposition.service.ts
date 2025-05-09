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



  private getSystemPrompt(): string {
    return `You are an expert software development project manager with years of experience breaking down projects into tasks. 
Your job is to analyze a project description and create a detailed list of development tasks.
For each task, you must include:
1. Name (concise but descriptive)
2. Description (what needs to be done, any technical details)
3. Estimated time (in hours, be realistic)
4. Priority (LOW, MEDIUM, or HIGH)
5. DueDate (optional, provide a realistic date in ISO format YYYY-MM-DD if appropriate)

Consider both technical and non-technical tasks, such as:
- Setup and configuration
- Front-end and back-end development
- Database design and implementation
- Testing and quality assurance
- Documentation

Base your estimates on industry standards, but adjust for user experience and past performance when possible.
Ensure tasks are properly sized - not too large (max 8 hours) and not too granular.
When assigning due dates, consider dependencies between tasks and space them out realistically.

IMPORTANT: Your response MUST be ONLY a valid JSON array of tasks. Do not include any explanation, introduction, or conclusion text.
Example of the expected response format:
[
  {{
    "name": "Project Setup",
    "description": "Initialize repository and setup development environment",
    "estimated_time": 2,
    "priority": "high",
    "dueDate": "2025-05-15"
  }},
  {{
    "name": "Database Schema Design",
    "description": "Create entity relationship diagrams and database schema",
    "estimated_time": 4,
    "priority": "high"
  }}
]`;
  }


private buildUserContext(user, userTechStacks, completedTasks, timeTrackingData): string {
    // Map experience level to years
    const experienceYears = {
      [ExperienceLevel.BEGINNER]: '0-2',
      [ExperienceLevel.INTERMEDIATE]: '3-5',
      [ExperienceLevel.EXPERT]: '6+'
    };

    // Format tech stacks
    const techStacksFormatted = userTechStacks.map(uts =>
      `${uts.techStack.name} (Proficiency: ${uts.proficiency_level}/5)`
    ).join(', ');

    // Analyze all completed tasks for patterns
    let totalEstimatedHours = 0;
    let totalActualHours = 0;
    let tasksByPriority = {
      'high': { count: 0, estHours: 0, actualHours: 0 },
      'medium': { count: 0, estHours: 0, actualHours: 0 },
      'low': { count: 0, estHours: 0, actualHours: 0 }
    };

    // Process all completed tasks
    completedTasks.forEach(task => {
      const actualHours = task.timeTrackings?.reduce((sum, tt) => sum + (tt.duration_hours || 0), 0) || 0;
      const estimatedHours = task.estimated_time || 0;

      // Add to total stats
      totalEstimatedHours += estimatedHours;
      totalActualHours += actualHours;

      // Group by priority
      const priority = task.priority?.toLowerCase();
      if (priority && tasksByPriority[priority]) {
        tasksByPriority[priority].count++;
        tasksByPriority[priority].estHours += estimatedHours;
        tasksByPriority[priority].actualHours += actualHours;
      }
    });

    
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