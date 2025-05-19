import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
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
import { sanitizeObject, sanitizePromptInput } from './utils/prompt-sanitizer.util';
import { buildProjectDecompositionPrompt } from './utils/ai-prompts';
import { createTaskOutputParser } from './utils/ai-schema';
import { ParsedTask } from './utils/types';
import { normalizeProjectPriority, normalizeDetailDepth, mapToTaskPriority } from './utils/priority-normalizer';

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
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }

    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'o4-mini-2025-04-16',
      temperature: 1,
    });

    this.outputParser = createTaskOutputParser();

    this.logger.log('ProjectDecompositionService initialized');
  }

  async generateTasks(generateTasksDto: GenerateTasksDto): Promise<DecompositionResult> {
    const { projectDetails, userId, maxTasks = 15 } = generateTasksDto;
    this.logger.log(`Generating tasks for project: ${projectDetails.name}`);

    const userIdNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    if (isNaN(userIdNumber)) {
      throw new Error('Invalid userId provided');
    }

    const sanitizedProjectDetails = sanitizeObject(projectDetails);

    const currentDate = new Date();
    const todayStr = currentDate.toISOString().split('T')[0];

    const priority = normalizeProjectPriority(sanitizedProjectDetails.priority);
    const detailDepth = normalizeDetailDepth(sanitizedProjectDetails.detail_depth);

    const user = await this.usersService.findOne(userIdNumber);
    if (!user) {
      throw new Error(`User with ID ${userIdNumber} not found`);
    }

    const userTechStacks = await this.userTechStacksService.findByUserId(userIdNumber);
    const userProjects = await this.projectsService.findAllByUserId(userIdNumber);
    const timeTrackingData = await this.timeTrackingsService.getUserProductivity(userIdNumber, 30);

    const completedTasks: any[] = [];
    for (const project of userProjects) {
      const projectTasks = await this.tasksService.findAllByProjectId(project.id);
      completedTasks.push(...projectTasks.filter(task => task.status === 'completed'));
    }

    const userContext = this.buildUserContext(user, userTechStacks, completedTasks, timeTrackingData);
    const sanitizedUserContext = sanitizePromptInput(userContext);

    const messages = buildProjectDecompositionPrompt(
      sanitizedProjectDetails,
      priority,
      detailDepth,
      maxTasks,
      todayStr,
      sanitizedUserContext,
      this.outputParser
    );

    this.logger.log('Sending request to AI model...');

    const response = await this.model.invoke(messages);
    const responseContent = response.content as string;

    this.logger.log('Parsing response with LangChain parser...');

    if (typeof responseContent === 'string' &&
      (responseContent.includes("I'm sorry") ||
        responseContent.includes("can't help") ||
        responseContent.includes("cannot help") ||
        responseContent.includes("I cannot") ||
        responseContent.includes("I apologize"))) {

      this.logger.warn(`AI refused to process request: "${responseContent.substring(0, 100)}..."`);
      throw new BadRequestException("Your request contains content that cannot be processed. Please revise your project description.");
    }

    const parsedTasks = await this.outputParser.parse(responseContent) as ParsedTask[];
    this.logger.log(`Successfully parsed ${parsedTasks.length} tasks from AI response`);

    const tasks: GeneratedTaskDto[] = parsedTasks.slice(0, maxTasks).map(task => {
      let dueDate: Date | undefined;

      if (task.dueDate) {
        const parsedDate = new Date(task.dueDate);

        if (parsedDate < currentDate) {
          const daysDiff = Math.ceil((currentDate.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
          dueDate = new Date(currentDate.getTime() + (daysDiff * 24 * 60 * 60 * 1000));
        } else {
          dueDate = parsedDate;
        }
      }

      return {
        name: task.name,
        description: task.description || '',
        estimated_time: typeof task.estimated_time === 'number' ?
          task.estimated_time : parseFloat(String(task.estimated_time)) || 1,
        priority: mapToTaskPriority(task.priority),
        dueDate,
        progress: task.progress || 0
      };
    });

    return {
      projectDetails: {
        ...projectDetails,
        priority,
        detail_depth: detailDepth
      },
      tasks,
      saved: false,
      userId: userIdNumber
    };
  }

  async saveTasks(decompositionResult: DecompositionResult): Promise<DecompositionResult> {
    const { tasks, projectId, projectDetails, userId } = decompositionResult as any;

    if (!tasks?.length) {
      throw new NotFoundException('No tasks to save');
    }

    let project: Project;

    if (projectId) {
      this.logger.log(`Adding ${tasks.length} tasks to existing project ID: ${projectId}`);
      project = await this.projectsService.findOne(projectId);

      for (const task of tasks) {
        await this.tasksService.create({ ...task, project_id: project.id });
      }
    } else if (projectDetails) {
      this.logger.log(`Creating new project "${projectDetails.name}" with ${tasks.length} tasks`);

      project = await this.projectsService.create({
        name: projectDetails.name,
        description: projectDetails.description,
        priority: projectDetails.priority,
        detail_depth: projectDetails.detail_depth,
        deadline: projectDetails.deadline,
        estimated_time: tasks.reduce((sum, task) => sum + task.estimated_time, 0),
        user_id: userId || 1
      });

      for (const task of tasks) {
        await this.tasksService.create({ ...task, project_id: project.id });
      }
    } else {
      throw new NotFoundException('No project details provided');
    }

    return {
      projectDetails,
      tasks,
      projectId: project.id,
      saved: true
    };
  }

  private buildUserContext(user, userTechStacks, completedTasks, timeTrackingData): string {
    const experienceYears = {
      [ExperienceLevel.BEGINNER]: '0-2',
      [ExperienceLevel.INTERMEDIATE]: '3-5',
      [ExperienceLevel.EXPERT]: '6+'
    };

    const techStacks = userTechStacks.map(uts =>
      `${uts.techStack.name} (Proficiency: ${uts.proficiency_level}/5)`
    ).join(', ');

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
}