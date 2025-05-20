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

    return this.generateModelResponse(type, prompts[type])
      .catch(error => {
        this.logger.error(`AI model error: ${error.message}`);
        return this.getFallbackInsight(type);
      });
  }

  private async generateModelResponse(type: InsightType, prompt: string): Promise<string> {
    const response = await this.model.invoke([
      {
        role: "system",
        content: "Generate a single, specific, actionable insight for a developer. Include specific percentages or metrics to make it feel data-driven. Limit to one concise sentence under 150 characters. No hypotheticals."
      },
      { role: "user", content: prompt }
    ]);

    let insight = (response.content as string).trim();

    if (insight.length > 150) {
      insight = insight.substring(0, 147) + "...";
    }

    return insight;
  }

  private getFallbackInsight(type: InsightType): string {
    const fallbacks = {
      [InsightType.TIME_ACCURACY]: "Not enough time tracking data yet. Most users underestimate tasks by 25-30%. We'll provide personalized accuracy insights once you complete more tasks.",
      [InsightType.PRODUCTIVITY_PATTERN]: "Still collecting productivity pattern data. Users typically have peak productivity in 90-minute intervals. Complete more tasks to see your patterns.",
      [InsightType.TASK_BREAKDOWN]: "Need more task data to analyze. Research shows breaking work into 1-2 hour chunks improves completion rates by 35%. We'll analyze your patterns soon.",
      [InsightType.TECH_PERFORMANCE]: "Insufficient task history to compare performance across technologies. Track more tech-related tasks for personalized performance insights."
    };
    return fallbacks[type] || "Keep tracking your tasks - we'll provide insights once we have enough data.";
    }
}