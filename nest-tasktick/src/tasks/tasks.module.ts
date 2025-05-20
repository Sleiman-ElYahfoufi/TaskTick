import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { ProjectsModule } from '../projects/projects.module';
import { TaskOwnerGuard } from './guards/task-owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ProjectsModule
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskOwnerGuard],
  exports: [TasksService]
})
export class TasksModule {}