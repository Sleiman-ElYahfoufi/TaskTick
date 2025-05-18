import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { UsersModule } from '../users/users.module';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
    UsersModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectOwnerGuard],
  exports: [ProjectsService]
})
export class ProjectsModule { }