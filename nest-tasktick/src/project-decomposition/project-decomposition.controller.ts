import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectDecompositionService } from './project-decomposition.service';
import { CreateProjectDecompositionDto } from './dto/create-project-decomposition.dto';
import { UpdateProjectDecompositionDto } from './dto/update-project-decomposition.dto';

@Controller('project-decomposition')
export class ProjectDecompositionController {
  constructor(private readonly projectDecompositionService: ProjectDecompositionService) {}

  @Post()
  create(@Body() createProjectDecompositionDto: CreateProjectDecompositionDto) {
    return this.projectDecompositionService.create(createProjectDecompositionDto);
  }

  @Get()
  findAll() {
    return this.projectDecompositionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDecompositionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDecompositionDto: UpdateProjectDecompositionDto) {
    return this.projectDecompositionService.update(+id, updateProjectDecompositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDecompositionService.remove(+id);
  }
}
