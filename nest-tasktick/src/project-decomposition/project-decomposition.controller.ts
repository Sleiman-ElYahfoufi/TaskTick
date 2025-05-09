import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectDecompositionService } from './project-decomposition.service';
import { GenerateTasksDto } from './dto/generate-tasks.dto';
import { DecompositionResult } from './interfaces/decomposition-result.interface';

@Controller('project-decomposition')
@UseGuards(AuthGuard)
export class ProjectDecompositionController {
  constructor(private readonly projectDecompositionService: ProjectDecompositionService) {}


}