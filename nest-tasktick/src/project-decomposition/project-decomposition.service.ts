import { Injectable } from '@nestjs/common';
import { CreateProjectDecompositionDto } from './dto/create-project-decomposition.dto';
import { UpdateProjectDecompositionDto } from './dto/update-project-decomposition.dto';

@Injectable()
export class ProjectDecompositionService {
  create(createProjectDecompositionDto: CreateProjectDecompositionDto) {
    return 'This action adds a new projectDecomposition';
  }

  findAll() {
    return `This action returns all projectDecomposition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectDecomposition`;
  }

  update(id: number, updateProjectDecompositionDto: UpdateProjectDecompositionDto) {
    return `This action updates a #${id} projectDecomposition`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectDecomposition`;
  }
}
