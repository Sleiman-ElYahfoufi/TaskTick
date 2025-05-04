import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTechStacksService } from './user-tech-stacks.service';
import { UserTechStacksController } from './user-tech-stacks.controller';
import { UserTechStack } from './entities/user-tech-stack.entity';
import { UsersModule } from '../users/users.module';
import { TechStacksModule } from '../tech-stacks/tech-stacks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTechStack]),
    UsersModule,
    TechStacksModule
  ],
  controllers: [UserTechStacksController],
  providers: [UserTechStacksService],
  exports: [UserTechStacksService]
})
export class UserTechStacksModule {}