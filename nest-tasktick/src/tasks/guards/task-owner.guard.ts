import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { ProjectsService } from '../../projects/projects.service';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(
    private tasksService: TasksService,
    private projectsService: ProjectsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const taskId = +request.params.id;

    if (!user || !taskId) {
      return false;
    }

    try {
      const task = await this.tasksService.findOne(taskId);
      
      const project = await this.projectsService.findOne(task.project_id);
      
      if (project.user_id !== user.sub) {
        throw new ForbiddenException('You do not have permission to access this task');
      }
      
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      return false;
    }
  }
} 