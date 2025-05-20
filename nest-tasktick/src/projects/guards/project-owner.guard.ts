import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
    constructor(private projectsService: ProjectsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = +request.params.id;

        if (!user || !projectId) {
            return false;
        }

        try {
            const project = await this.projectsService.findOne(projectId);

            if (project.user_id !== user.sub) {
                throw new ForbiddenException('You do not have permission to access this project');
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