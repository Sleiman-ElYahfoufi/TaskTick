import { PartialType } from '@nestjs/mapped-types';
import { CreateAiInsightDto } from './create-ai-insight.dto';

export class UpdateAiInsightDto extends PartialType(CreateAiInsightDto) {}
