import { Injectable } from '@nestjs/common';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';

@Injectable()
export class AiInsightsService {
  create(createAiInsightDto: CreateAiInsightDto) {
    return 'This action adds a new aiInsight';
  }

  findAll() {
    return `This action returns all aiInsights`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiInsight`;
  }

  update(id: number, updateAiInsightDto: UpdateAiInsightDto) {
    return `This action updates a #${id} aiInsight`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiInsight`;
  }
}
