import { PartialType } from '@nestjs/mapped-types';
import { CreateTechStackDto } from './create-tech-stack.dto';

export class UpdateTechStackDto extends PartialType(CreateTechStackDto) {}
