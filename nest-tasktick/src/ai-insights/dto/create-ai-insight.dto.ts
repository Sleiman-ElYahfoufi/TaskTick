import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InsightType } from '../entities/ai-insight.entity';

export class CreateAiInsightDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsEnum(InsightType, { message: 'Type must be a valid insight type' })
  type: InsightType;

  @IsNotEmpty()
  @IsString()
  description: string;
}