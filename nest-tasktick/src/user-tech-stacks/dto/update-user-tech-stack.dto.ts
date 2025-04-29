import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTechStackDto } from './create-user-tech-stack.dto';

export class UpdateUserTechStackDto extends PartialType(CreateUserTechStackDto) {}
