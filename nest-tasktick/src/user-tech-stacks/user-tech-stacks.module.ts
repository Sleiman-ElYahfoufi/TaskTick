import { Module } from '@nestjs/common';
import { UserTechStacksService } from './user-tech-stacks.service';
import { UserTechStacksController } from './user-tech-stacks.controller';

@Module({
  controllers: [UserTechStacksController],
  providers: [UserTechStacksService],
})
export class UserTechStacksModule {}
