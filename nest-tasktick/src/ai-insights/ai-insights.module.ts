import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiInsightsService } from './ai-insights.service';
import { AiInsightsController } from './ai-insights.controller';
import { AiInsight } from './entities/ai-insight.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiInsight]),
    UsersModule
  ],
  controllers: [AiInsightsController],
  providers: [AiInsightsService],
  exports: [AiInsightsService]
})
export class AiInsightsModule {}