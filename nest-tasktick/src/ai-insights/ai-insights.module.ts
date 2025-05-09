import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiInsightsService } from './ai-insights.service';
import { AiInsightsController } from './ai-insights.controller';
import { AiInsight } from './entities/ai-insight.entity';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { ProjectsModule } from '../projects/projects.module';
import { TimeTrackingsModule } from '../time-trackings/time-trackings.module';
import { ConfigModule } from '@nestjs/config';
import { AiInsightGeneratorService } from './ai-insight-generator/ai-insight-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiInsight]),
    UsersModule,
    TasksModule,
    ProjectsModule,
    TimeTrackingsModule,
    ConfigModule
  ],
  controllers: [AiInsightsController],
  providers: [AiInsightsService, AiInsightGeneratorService],
  exports: [AiInsightsService, AiInsightGeneratorService]
})
export class AiInsightsModule {}