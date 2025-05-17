import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private projectsService: ProjectsService,
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await this.projectsService.findOne(createTaskDto.project_id);

    const task = this.tasksRepository.create(createTaskDto);

    if (task.progress !== undefined) {
      this.updateStatusBasedOnProgress(task);
    }

    const savedTask = await this.tasksRepository.save(task);

    await this.projectsService.updateProjectStatus(task.project_id);

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findAllByProjectId(projectId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { project_id: projectId },
      relations: ['timeTrackings']
    });
  }

  async findAllByStatus(status: TaskStatus): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { status }
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const projectId = task.project_id;

    if (updateTaskDto.project_id) {
      await this.projectsService.findOne(updateTaskDto.project_id);
    }

    const updatedTask = this.tasksRepository.merge(task, updateTaskDto);

    if (updateTaskDto.progress !== undefined) {
      this.updateStatusBasedOnProgress(updatedTask);
    }

    const savedTask = await this.tasksRepository.save(updatedTask);


    await this.projectsService.updateProjectStatus(updateTaskDto.project_id || projectId);

    return savedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    const projectId = task.project_id;

    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }


    await this.projectsService.updateProjectStatus(projectId);
  }

  private updateStatusBasedOnProgress(task: Task): void {
    if (task.progress === 0) {
      task.status = TaskStatus.TODO;
    } else if (task.progress === 100) {
      task.status = TaskStatus.COMPLETED;
    } else {
      task.status = TaskStatus.IN_PROGRESS;
    }
  }
}