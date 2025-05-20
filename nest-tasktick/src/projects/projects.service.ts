import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatus } from './entities/project.entity';
import { UsersService } from '../users/users.service';
import { Task, TaskStatus } from '../tasks/entities/task.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private usersService: UsersService,
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    await this.usersService.findOne(createProjectDto.user_id);

    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.projectsRepository.find();
    return this.addTaskAggregationData(projects);
  }

  async findAllByUserId(userId: number): Promise<Project[]> {
    const projects = await this.projectsRepository.find({
      where: { user_id: userId }
    });

    return this.addTaskAggregationData(projects);
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['tasks']
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByName(name: string): Promise<Project[]> {
    const projects = await this.projectsRepository.find({
      where: { name: Like(`%${name}%`) }
    });

    return this.addTaskAggregationData(projects);
  }

  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const projects = await this.projectsRepository.find({
      where: { status }
    });

    return this.addTaskAggregationData(projects);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    if (updateProjectDto.user_id) {
      await this.usersService.findOne(updateProjectDto.user_id);
    }

    const updatedProject = this.projectsRepository.merge(project, updateProjectDto);
    await this.projectsRepository.save(updatedProject);

    if (!updateProjectDto.status) {
      await this.updateProjectStatus(id);
      return this.findOne(id);
    }

    return updatedProject;
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async updateProjectStatus(projectId: number): Promise<void> {
    const tasks = await this.tasksRepository.find({
      where: { project_id: projectId }
    });

    const project = await this.projectsRepository.findOne({
      where: { id: projectId }
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (tasks.length === 0) {
      project.status = ProjectStatus.PLANNING;
    } else {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
      const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;

      if (completedTasks === totalTasks) {
        project.status = ProjectStatus.COMPLETED;
      } else if (inProgressTasks > 0) {
        project.status = ProjectStatus.IN_PROGRESS;
      } else if (completedTasks === 0) {
        project.status = ProjectStatus.PLANNING;
      } else {
        project.status = ProjectStatus.IN_PROGRESS;
      }
    }

    await this.projectsRepository.save(project);
  }

  private async addTaskAggregationData(projects: Project[]): Promise<Project[]> {
    if (projects.length === 0) {
      return projects;
    }

    const projectIds = projects.map(project => project.id);

    const projectStats = await this.tasksRepository
      .createQueryBuilder('task')
      .select('task.project_id', 'projectId')
      .addSelect('COUNT(*)', 'totalTasks')
      .addSelect('SUM(CASE WHEN task.status = :completed THEN 1 ELSE 0 END)', 'completedTasks')
      .addSelect('SUM(task.estimated_time)', 'totalEstimatedTime')
      .where('task.project_id IN (:...projectIds)', { projectIds })
      .setParameter('completed', TaskStatus.COMPLETED)
      .groupBy('task.project_id')
      .getRawMany();

    const statsMap = new Map(
      projectStats.map(stat => [
        stat.projectId,
        {
          totalTasks: parseInt(stat.totalTasks, 10),
          completedTasks: parseInt(stat.completedTasks, 10),
          totalEstimatedTime: parseFloat(stat.totalEstimatedTime) || 0
        }
      ])
    );

    return projects.map(project => {
      const stats = statsMap.get(project.id) || { totalTasks: 0, completedTasks: 0, totalEstimatedTime: 0 };

      project.estimated_time = stats.totalEstimatedTime;
      (project as any).totalTasks = stats.totalTasks;
      (project as any).completedTasks = stats.completedTasks;

      return project;
    });
  }
}