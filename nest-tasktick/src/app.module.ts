import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeTrackingsModule } from './time-trackings/time-trackings.module';
import { TechStacksModule } from './tech-stacks/tech-stacks.module';
import { UserTechStacksModule } from './user-tech-stacks/user-tech-stacks.module';
import { AiInsightsModule } from './ai-insights/ai-insights.module';
import { dataSourceOptions } from '../database/data-source';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule, 
    ProjectsModule, 
    TasksModule, 
    TimeTrackingsModule, 
    TechStacksModule, 
    UserTechStacksModule, 
    AiInsightsModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}