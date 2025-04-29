import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiInsightsService } from './ai-insights.service';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';

@Controller('ai-insights')
export class AiInsightsController {
  constructor(private readonly aiInsightsService: AiInsightsService) {}

  @Post()
  create(@Body() createAiInsightDto: CreateAiInsightDto) {
    return this.aiInsightsService.create(createAiInsightDto);
  }

  @Get()
  findAll() {
    return this.aiInsightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiInsightsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiInsightDto: UpdateAiInsightDto) {
    return this.aiInsightsService.update(+id, updateAiInsightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiInsightsService.remove(+id);
  }
}
