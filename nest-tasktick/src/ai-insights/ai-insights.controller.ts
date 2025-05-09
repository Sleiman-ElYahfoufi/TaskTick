import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AiInsightsService } from './ai-insights.service';
import { AiInsightGeneratorService } from './ai-insight-generator/ai-insight-generator.service';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import { AuthGuard } from '../auth/auth.guard';
import { InsightType } from './entities/ai-insight.entity';

@Controller('ai-insights')
@UseGuards(AuthGuard)
export class AiInsightsController {
  constructor(
    private readonly aiInsightsService: AiInsightsService,
    private readonly aiInsightGeneratorService: AiInsightGeneratorService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAiInsightDto: CreateAiInsightDto) {
    return this.aiInsightsService.create(createAiInsightDto);
  }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generateInsights(@Body('userId') userId: number) {
    return this.aiInsightGeneratorService.generateInsightsForUser(userId);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('type') type?: InsightType) {
    if (userId) {
      return this.aiInsightsService.findByUserId(+userId);
    }
    
    if (type) {
      return this.aiInsightsService.findByType(type);
    }
    
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.aiInsightsService.remove(+id);
  }
}