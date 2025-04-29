import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserTechStacksService } from './user-tech-stacks.service';
import { CreateUserTechStackDto } from './dto/create-user-tech-stack.dto';
import { UpdateUserTechStackDto } from './dto/update-user-tech-stack.dto';

@Controller('user-tech-stacks')
export class UserTechStacksController {
  constructor(private readonly userTechStacksService: UserTechStacksService) {}

  @Post()
  create(@Body() createUserTechStackDto: CreateUserTechStackDto) {
    return this.userTechStacksService.create(createUserTechStackDto);
  }

  @Get()
  findAll() {
    return this.userTechStacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTechStacksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserTechStackDto: UpdateUserTechStackDto) {
    return this.userTechStacksService.update(+id, updateUserTechStackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTechStacksService.remove(+id);
  }
}
