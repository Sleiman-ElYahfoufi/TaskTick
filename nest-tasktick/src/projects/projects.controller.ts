import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectStatus } from './entities/project.entity';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjectDto: CreateProjectDto, @GetUser('sub') userId: number) {

    createProjectDto.user_id = userId;
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(
    @GetUser('sub') userId: number,
    @Query('name') name?: string,
    @Query('status') status?: ProjectStatus
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (name) {
      return this.projectsService.findByName(name);
    }

    if (status) {
      return this.projectsService.findByStatus(status);
    }

    return this.projectsService.findAllByUserId(userId);
  }

  @Get(':id')
  @UseGuards(ProjectOwnerGuard)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(ProjectOwnerGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ProjectOwnerGuard)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}