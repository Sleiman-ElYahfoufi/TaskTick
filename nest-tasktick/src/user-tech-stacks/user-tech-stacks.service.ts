import { Injectable } from '@nestjs/common';
import { CreateUserTechStackDto } from './dto/create-user-tech-stack.dto';
import { UpdateUserTechStackDto } from './dto/update-user-tech-stack.dto';

@Injectable()
export class UserTechStacksService {
  create(createUserTechStackDto: CreateUserTechStackDto) {
    return 'This action adds a new userTechStack';
  }

  findAll() {
    return `This action returns all userTechStacks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userTechStack`;
  }

  update(id: number, updateUserTechStackDto: UpdateUserTechStackDto) {
    return `This action updates a #${id} userTechStack`;
  }

  remove(id: number) {
    return `This action removes a #${id} userTechStack`;
  }
}
