import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiInsight, InsightType } from '../entities/ai-insight.entity';
import { UsersService } from '../../users/users.service';
import { TimeTrackingsService } from '../../time-trackings/time-trackings.service';
import { ProjectsService } from '../../projects/projects.service';

@Injectable()
export class AiInsightGeneratorService {
  private readonly logger = new Logger(AiInsightGeneratorService.name);
  private model: ChatOpenAI;

  
}