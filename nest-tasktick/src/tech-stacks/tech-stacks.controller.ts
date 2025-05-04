import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { TechStacksService } from './tech-stacks.service';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TechCategory } from './entities/tech-stack.entity';

@Controller('tech-stacks')
@UseGuards(AuthGuard)
export class TechStacksController {
  constructor(private readonly techStacksService: TechStacksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTechStackDto: CreateTechStackDto) {
    return this.techStacksService.create(createTechStackDto);
  }

  @Get()
  findAll(@Query('name') name?: string, @Query('category') category?: TechCategory) {
    if (name) {
      return this.techStacksService.findByName(name);
    }
    
    if (category) {
      return this.techStacksService.findByCategory(category);
    }
    
    return this.techStacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techStacksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechStackDto: UpdateTechStackDto) {
    return this.techStacksService.update(+id, updateTechStackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.techStacksService.remove(+id);
  }
}