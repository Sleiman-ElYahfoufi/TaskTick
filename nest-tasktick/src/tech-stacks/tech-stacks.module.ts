import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStacksService } from './tech-stacks.service';
import { TechStacksController } from './tech-stacks.controller';
import { TechStack } from './entities/tech-stack.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechStack])
  ],
  controllers: [TechStacksController],
  providers: [TechStacksService],
  exports: [TechStacksService]
})
export class TechStacksModule {}