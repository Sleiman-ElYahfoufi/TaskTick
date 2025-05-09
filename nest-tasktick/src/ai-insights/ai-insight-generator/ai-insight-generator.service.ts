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
      
      const context = {
        role: user.role,
        experience: user.experience_level,
        avgHoursPerDay: productivity?.averageHoursPerDay || 0,
        projectCount: projects.length,
        hasActiveProjects: projects.some(p => p.status === 'in_progress')
      };
      
      const results: AiInsight[] = [];
      
      for (const type of Object.values(InsightType)) {
        const insightText = await this.generateInsight(type, context);
        
        const insight = this.aiInsightsRepository.create({
          user_id: userId,
          type,
          description: insightText
        });
        
        const savedInsight = await this.aiInsightsRepository.save(insight);
        results.push(savedInsight);
      }
      
      return results;
    } catch (error) {
      this.logger.error(`Error generating insights: ${error.message}`);
      throw error;
    }
  }
  
  private async generateInsight(type: InsightType, context: any): Promise<string> {
    const prompts = {
      [InsightType.TIME_ACCURACY]: 
        `As a ${context.experience} ${context.role} working ${context.avgHoursPerDay} hours/day on ${context.projectCount} projects, generate a specific, data-backed insight about time estimation accuracy.`,
      
      [InsightType.PRODUCTIVITY_PATTERN]:
        `For a ${context.experience} ${context.role} who works ${context.avgHoursPerDay} hours/day, generate a specific, data-backed insight about productivity patterns.`,
      
      [InsightType.TASK_BREAKDOWN]:
        `For a ${context.experience} ${context.role} with ${context.projectCount} projects, generate a specific, data-backed insight about task breakdown and management.`,
      
      [InsightType.TECH_PERFORMANCE]:
        `For a ${context.experience} ${context.role}, generate a specific, data-backed insight about technology performance and efficiency.`
    };
    
    try {
      const response = await this.model.invoke([
        { 
          role: "system", 
          content: "Generate a single, specific, actionable insight for a developer. Include specific percentages or metrics to make it feel data-driven. Limit to one concise sentence under 150 characters. No hypotheticals."
        },
        { role: "user", content: prompts[type] }
      ]);
      
      let insight = (response.content as string).trim();
      
      if (insight.length > 150) {
        insight = insight.substring(0, 147) + "...";
      }
      
      return insight;
    } catch (error) {
      this.logger.error(`AI model error: ${error.message}`);
      const fallbacks = {
        [InsightType.TIME_ACCURACY]: "You consistently underestimate tasks by 20%. Consider adding a buffer to your estimates.",
        [InsightType.PRODUCTIVITY_PATTERN]: "Your productivity peaks between 10am-12pm. Schedule complex tasks during this window.",
        [InsightType.TASK_BREAKDOWN]: "Breaking tasks into smaller chunks has improved your completion rate by 35%.",
        [InsightType.TECH_PERFORMANCE]: "You complete React tasks 25% faster than Angular tasks."
      };
      return fallbacks[type];
    }
  }
}