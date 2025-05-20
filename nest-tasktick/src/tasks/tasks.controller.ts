import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Task, TaskStatus } from './entities/task.entity';
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
    return this.tasksService.createTaskWithOwnerCheck(createTaskDto, userId);
  }

  @Get()
  async findAll(
    @GetUser('sub') userId: number,
    @Query('projectId') projectId?: string,
    @Query('status') status?: TaskStatus
  ) {
    return this.tasksService.findTasksForUser(userId, {
      projectId: projectId ? +projectId : undefined,
      status
    });
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