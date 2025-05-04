import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UserTechStacksService } from './user-tech-stacks.service';
import { CreateUserTechStackDto } from './dto/create-user-tech-stack.dto';
import { UpdateUserTechStackDto } from './dto/update-user-tech-stack.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user-tech-stacks')
@UseGuards(AuthGuard)
export class UserTechStacksController {
  constructor(private readonly userTechStacksService: UserTechStacksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserTechStackDto: CreateUserTechStackDto) {
    return this.userTechStacksService.create(createUserTechStackDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('techId') techId?: string) {
    if (userId) {
      return this.userTechStacksService.findByUserId(+userId);
    }
    
    if (techId) {
      return this.userTechStacksService.findByTechId(+techId);
    }
    
    return this.userTechStacksService.findAll();
  }

  @Get(':userId/:techId')
  findOne(@Param('userId') userId: string, @Param('techId') techId: string) {
    return this.userTechStacksService.findOne(+userId, +techId);
  }

  @Patch(':userId/:techId')
  update(
    @Param('userId') userId: string, 
    @Param('techId') techId: string, 
    @Body() updateUserTechStackDto: UpdateUserTechStackDto
  ) {
    return this.userTechStacksService.update(+userId, +techId, updateUserTechStackDto);
  }

  @Delete(':userId/:techId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('userId') userId: string, @Param('techId') techId: string) {
    return this.userTechStacksService.remove(+userId, +techId);
  }
}