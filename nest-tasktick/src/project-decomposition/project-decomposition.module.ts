import { Module } from '@nestjs/common';
import { ProjectDecompositionService } from './project-decomposition.service';
import { ProjectDecompositionController } from './project-decomposition.controller';

@Module({
  controllers: [ProjectDecompositionController],
  providers: [ProjectDecompositionService],
})
export class ProjectDecompositionModule {}
