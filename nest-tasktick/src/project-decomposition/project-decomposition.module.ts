import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectDecompositionService } from './project-decomposition.service';
import { ProjectDecompositionController } from './project-decomposition.controller';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { ProjectsModule } from '../projects/projects.module';
import { UserTechStacksModule } from '../user-tech-stacks/user-tech-stacks.module';
import { TimeTrackingsModule } from '../time-trackings/time-trackings.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TasksModule,
    ProjectsModule,
    UserTechStacksModule,
    TimeTrackingsModule
  ],
  controllers: [ProjectDecompositionController],
  providers: [ProjectDecompositionService],
  exports: [ProjectDecompositionService]
})
export class ProjectDecompositionModule {}