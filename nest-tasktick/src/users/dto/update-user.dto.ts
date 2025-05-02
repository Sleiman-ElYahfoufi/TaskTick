import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // No need to redeclare properties - they're all inherited from CreateUserDto
  // but made optional automatically by PartialType
  
  // You could add custom validation here if needed for specific update scenarios
  // But it's not necessary for basic functionality
}