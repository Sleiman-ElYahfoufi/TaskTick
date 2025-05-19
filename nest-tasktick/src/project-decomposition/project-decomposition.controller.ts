import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectDecompositionService } from './project-decomposition.service';
import { GenerateTasksDto } from './dto/generate-tasks.dto';
import { DecompositionResult } from './interfaces/decomposition-result.interface';

@Controller('project-decomposition')
@UseGuards(AuthGuard)
export class ProjectDecompositionController {
  private readonly logger = new Logger(ProjectDecompositionController.name);

  constructor(private readonly projectDecompositionService: ProjectDecompositionService) { }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateTasks(@Body() generateTasksDto: GenerateTasksDto): Promise<DecompositionResult> {
    try {
      this.logger.log(`Generating tasks for project: ${generateTasksDto.projectDetails.name}`);
      return await this.projectDecompositionService.generateTasks(generateTasksDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request in generateTasks: ${error.message}`);
        throw error;
      }

      if (error.message && (
        error.message.includes("Failed to parse") ||
        error.message.includes("I'm sorry") ||
        error.message.includes("can't help")
      )) {
        this.logger.warn(`AI refusal detected in controller: ${error.message}`);
        throw new BadRequestException("Your request contains content that cannot be processed. Please revise your project description.");
      }

      this.logger.error(`Error in generateTasks: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to generate tasks: ${error.message}`);
    }
  }

  @Post('save')
  @HttpCode(HttpStatus.CREATED)
  async saveTasks(@Body() decompositionResult: DecompositionResult): Promise<DecompositionResult> {
    try {
      return await this.projectDecompositionService.saveTasks(decompositionResult);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request in saveTasks: ${error.message}`);
        throw error;
      }

      this.logger.error(`Error in saveTasks: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to save tasks: ${error.message}`);
    }
  }
}