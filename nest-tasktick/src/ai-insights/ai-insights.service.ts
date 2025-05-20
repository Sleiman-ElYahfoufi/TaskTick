import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import { AiInsight, InsightType } from './entities/ai-insight.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AiInsightsService {
  constructor(
    @InjectRepository(AiInsight)
    private aiInsightsRepository: Repository<AiInsight>,
    private usersService: UsersService,
  ) { }

  async create(createAiInsightDto: CreateAiInsightDto): Promise<AiInsight> {
    await this.usersService.findOne(createAiInsightDto.user_id);

    const insight = this.aiInsightsRepository.create(createAiInsightDto);
    return this.aiInsightsRepository.save(insight);
  }

  async findAll(): Promise<AiInsight[]> {
    return this.aiInsightsRepository.find();
  }

  async findByUserId(userId: number): Promise<AiInsight[]> {
    return this.aiInsightsRepository.find({
      where: { user_id: userId }
    });
  }

  async shouldRegenerateInsights(userId: number): Promise<boolean> {
    const insights = await this.aiInsightsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 1
    });

    if (!insights || insights.length === 0) {
      return true;
    }

    const latestInsight = insights[0];
    const currentDate = new Date();
    const latestInsightDate = new Date(latestInsight.created_at);

    const diffTime = currentDate.getTime() - latestInsightDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 7;
  }

  async findByType(type: InsightType): Promise<AiInsight[]> {
    return this.aiInsightsRepository.find({
      where: { type }
    });
  }

  async findOne(id: number): Promise<AiInsight> {
    const insight = await this.aiInsightsRepository.findOne({ where: { id } });
    if (!insight) {
      throw new NotFoundException(`AI Insight with ID ${id} not found`);
    }
    return insight;
  }

  async update(id: number, updateAiInsightDto: UpdateAiInsightDto): Promise<AiInsight> {
    const insight = await this.findOne(id);

    if (updateAiInsightDto.user_id) {
      await this.usersService.findOne(updateAiInsightDto.user_id);
    }

    const updatedInsight = this.aiInsightsRepository.merge(insight, updateAiInsightDto);
    return this.aiInsightsRepository.save(updatedInsight);
  }

  async remove(id: number): Promise<void> {
    const result = await this.aiInsightsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`AI Insight with ID ${id} not found`);
    }
  }
}