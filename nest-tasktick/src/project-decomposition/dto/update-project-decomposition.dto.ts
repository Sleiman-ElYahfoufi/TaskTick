import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDecompositionDto } from './create-project-decomposition.dto';

export class UpdateProjectDecompositionDto extends PartialType(CreateProjectDecompositionDto) {}
