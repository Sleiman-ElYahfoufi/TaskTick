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

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private timeTrackingsService: TimeTrackingsService,
    private projectsService: ProjectsService,
    @InjectRepository(AiInsight)
    private aiInsightsRepository: Repository<AiInsight>
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
    });
  }

  async generateInsightsForUser(userId: number): Promise<AiInsight[]> {
    try {
      const user = await this.usersService.findOne(userId);
      const productivity = await this.timeTrackingsService.getUserProductivity(userId, 14);
      const projects = await this.projectsService.findAllByUserId(userId);
      
     
    } catch (error) {
      this.logger.error(`Error generating insights: ${error.message}`);
      throw error;
    }
  }
  
  
}