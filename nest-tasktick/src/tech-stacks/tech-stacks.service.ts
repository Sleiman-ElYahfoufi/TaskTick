import { Injectable } from '@nestjs/common';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';

@Injectable()
export class TechStacksService {
  create(createTechStackDto: CreateTechStackDto) {
    return 'This action adds a new techStack';
  }

  findAll() {
    return `This action returns all techStacks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} techStack`;
  }

  update(id: number, updateTechStackDto: UpdateTechStackDto) {
    return `This action updates a #${id} techStack`;
  }

  remove(id: number) {
    return `This action removes a #${id} techStack`;
  }
}
