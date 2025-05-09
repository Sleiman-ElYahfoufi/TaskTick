import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
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

// Define the shape of task data from AI
interface ParsedTask {
  name: string;
  description?: string;
  estimated_time: number | string;
  priority: string;
  dueDate?: string;
  progress?: number;
}

@Injectable()
export class ProjectDecompositionService {
  private readonly logger = new Logger(ProjectDecompositionService.name);
  private model: ChatOpenAI;
  private outputParser;

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

    // Initialize the parser with our task schema
    this.outputParser = StructuredOutputParser.fromZodSchema(
      z.array(z.object({
        name: z.string().min(1),
        description: z.string().optional().default(''),
        estimated_time: z.number().positive().or(z.string().transform(val => parseFloat(val) || 1)),
        priority: z.enum(['low', 'medium', 'high']).default('medium'),
        dueDate: z.string().optional(),
        progress: z.number().min(0).max(100).optional().default(0)
      }))
    );

    this.logger.log('ProjectDecompositionService initialized');
  }

  async generateTasks(generateTasksDto: GenerateTasksDto): Promise<DecompositionResult> {
    try {
      const { projectDetails, userId, maxTasks = 15 } = generateTasksDto;
      this.logger.log(`Generating tasks for project: ${projectDetails.name}`);

      // Normalize enum values
      const priority = this.normalizeProjectPriority(projectDetails.priority);
      const detailDepth = this.normalizeDetailDepth(projectDetails.detail_depth);

      // Get user data and context
      const user = await this.usersService.findOne(userId);
      const userTechStacks = await this.userTechStacksService.findByUserId(userId);
      const userProjects = await this.projectsService.findAllByUserId(userId);
      const timeTrackingData = await this.timeTrackingsService.getUserProductivity(userId, 30);
      
      
    } catch (error) {
      this.logger.error(`Error generating tasks: ${error.message}`);
      throw error;
    }
  }

 

  private buildUserContext(user, userTechStacks, completedTasks, timeTrackingData): string {
    // Map experience level to years
    const experienceYears = {
      [ExperienceLevel.BEGINNER]: '0-2',
      [ExperienceLevel.INTERMEDIATE]: '3-5',
      [ExperienceLevel.EXPERT]: '6+'
    };

    // Format tech stacks
    const techStacks = userTechStacks.map(uts => 
      `${uts.techStack.name} (Proficiency: ${uts.proficiency_level}/5)`
    ).join(', ');

    // Calculate estimation accuracy
    let totalEstimated = 0, totalActual = 0;
    const tasksByPriority = { high: [], medium: [], low: [] };
    
    completedTasks.forEach(task => {
      const actual = task.timeTrackings?.reduce((sum, tt) => sum + (tt.duration_hours || 0), 0) || 0;
      const estimated = task.estimated_time || 0;
      
      totalEstimated += estimated;
      totalActual += actual;
      
      if (task.priority) {
        const priority = task.priority.toLowerCase();
        if (tasksByPriority[priority]) {
          tasksByPriority[priority].push({
            ...task,
            actualTime: actual,
            ratio: estimated ? actual / estimated : 0
          });
        }
      }
    });

    // Get recent task examples with accuracy info
    const taskExamples = completedTasks
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map(task => {
        const actual = task.timeTrackings?.reduce((sum, tt) => sum + (tt.duration_hours || 0), 0) || 0;
        const ratioNum = task.estimated_time ? actual / task.estimated_time : 0;
        const ratio = ratioNum.toFixed(2);
        let accuracy = 'ACCURATE';
        
        if (ratioNum > 1.1) accuracy = 'UNDERESTIMATED';
        else if (ratioNum < 0.9) accuracy = 'OVERESTIMATED';
        
        return `- "${task.name}": Estimated ${task.estimated_time}h, Actual ${actual}h (${accuracy})`;
      })
      .join('\n');

    return `
Developer: ${user.role} with ${experienceYears[user.experience_level]} years experience
Tech Skills: ${techStacks || 'No specific technologies listed'}
Estimation Accuracy: ${totalEstimated ? (totalActual / totalEstimated).toFixed(2) : 'Unknown'} 
  (>1 means underestimation, <1 means overestimation)
Daily Productivity: ${timeTrackingData.averageHoursPerDay}h per day average

Recent Task Examples:
${taskExamples || 'No completed tasks found'}`;
  }

  // Helper methods for normalization and mapping
  private normalizeProjectPriority(priority?: string): ProjectPriorityLevel {
    if (!priority) return ProjectPriorityLevel.MEDIUM;
    
    return priority.toLowerCase() === 'high' ? ProjectPriorityLevel.HIGH :
           priority.toLowerCase() === 'low' ? ProjectPriorityLevel.LOW :
           ProjectPriorityLevel.MEDIUM;
  }

  private normalizeDetailDepth(detailDepth?: string): DetailDepth {
    if (!detailDepth) return DetailDepth.NORMAL;
    
    return detailDepth.toLowerCase() === 'detailed' ? DetailDepth.DETAILED :
           detailDepth.toLowerCase() === 'minimal' ? DetailDepth.MINIMAL :
           DetailDepth.NORMAL;
  }

  private mapToTaskPriority(priority: string): TaskPriorityLevel {
    return priority.toLowerCase() === 'high' ? TaskPriorityLevel.HIGH :
           priority.toLowerCase() === 'low' ? TaskPriorityLevel.LOW :
           TaskPriorityLevel.MEDIUM;
  }
}