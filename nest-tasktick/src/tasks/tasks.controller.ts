import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TaskStatus } from './entities/task.entity';
import { TaskOwnerGuard } from './guards/task-owner.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProjectsService } from '../projects/projects.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser('sub') userId: number) {
    // Verify that the project belongs to the authenticated user
    const project = await this.projectsService.findOne(createTaskDto.project_id);
    if (project.user_id !== userId) {
      throw new BadRequestException('You can only create tasks for your own projects');
    }

    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @GetUser('sub') userId: number,
    @Query('projectId') projectId?: string,
    @Query('status') status?: TaskStatus
  ) {
    if (projectId) {
      const project = await this.projectsService.findOne(+projectId);
      if (project.user_id !== userId) {
        throw new BadRequestException('You can only access tasks for your own projects');
      }
      return this.tasksService.findAllByProjectId(+projectId);
    }

    if (status) {
      const userProjects = await this.projectsService.findAllByUserId(userId);
      const projectIds = userProjects.map(project => project.id);

      const allTasksWithStatus = await this.tasksService.findAllByStatus(status);
      return allTasksWithStatus.filter(task => projectIds.includes(task.project_id));
    }

    const userProjects = await this.projectsService.findAllByUserId(userId);
    const projectIds = userProjects.map(project => project.id);

    const allTasks = await this.tasksService.findAll();
    return allTasks.filter(task => projectIds.includes(task.project_id));
  }

  @Get(':id')
  @UseGuards(TaskOwnerGuard)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(TaskOwnerGuard)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TaskOwnerGuard)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}