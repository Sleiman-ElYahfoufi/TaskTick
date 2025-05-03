import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectStatus } from './entities/project.entity';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query('name') name?: string, @Query('status') status?: ProjectStatus, @Query('userId') userId?: string) {
    if (name) {
      return this.projectsService.findByName(name);
    }
    
    if (status) {
      return this.projectsService.findByStatus(status);
    }
    
    if (userId) {
      return this.projectsService.findAllByUserId(+userId);
    }
    
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}