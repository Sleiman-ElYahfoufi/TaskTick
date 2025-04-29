import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeTrackingsModule } from './time-trackings/time-trackings.module';
import { TechStacksModule } from './tech-stacks/tech-stacks.module';
import { UserTechStacksModule } from './user-tech-stacks/user-tech-stacks.module';
import { AiInsightsModule } from './ai-insights/ai-insights.module';

@Module({
  imports: [UsersModule, ProjectsModule, TasksModule, TimeTrackingsModule, TechStacksModule, UserTechStacksModule, AiInsightsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
