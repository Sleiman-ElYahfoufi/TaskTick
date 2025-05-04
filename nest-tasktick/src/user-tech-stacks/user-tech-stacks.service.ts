import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserTechStackDto } from './dto/create-user-tech-stack.dto';
import { UpdateUserTechStackDto } from './dto/update-user-tech-stack.dto';
import { UserTechStack } from './entities/user-tech-stack.entity';
import { UsersService } from '../users/users.service';
import { TechStacksService } from '../tech-stacks/tech-stacks.service';

@Injectable()
export class UserTechStacksService {
  constructor(
    @InjectRepository(UserTechStack)
    private userTechStacksRepository: Repository<UserTechStack>,
    private usersService: UsersService,
    private techStacksService: TechStacksService
  ) {}

  async create(createUserTechStackDto: CreateUserTechStackDto): Promise<UserTechStack> {
    await this.usersService.findOne(createUserTechStackDto.user_id);
    
    await this.techStacksService.findOne(createUserTechStackDto.tech_id);
    
    const existingEntry = await this.userTechStacksRepository.findOne({
      where: {
        user_id: createUserTechStackDto.user_id,
        tech_id: createUserTechStackDto.tech_id
      }
    });
    
    if (existingEntry) {
      throw new ConflictException('This user already has this tech stack associated');
    }
    
    const userTechStack = this.userTechStacksRepository.create(createUserTechStackDto);
    return this.userTechStacksRepository.save(userTechStack);
  }

  async findAll(): Promise<UserTechStack[]> {
    return this.userTechStacksRepository.find({
      relations: ['user', 'techStack']
    });
  }

  async findByUserId(userId: number): Promise<UserTechStack[]> {
    await this.usersService.findOne(userId);
    
    return this.userTechStacksRepository.find({
      where: { user_id: userId },
      relations: ['techStack']
    });
  }

  async findByTechId(techId: number): Promise<UserTechStack[]> {
    await this.techStacksService.findOne(techId);
    
    return this.userTechStacksRepository.find({
      where: { tech_id: techId },
      relations: ['user']
    });
  }

  async findOne(userId: number, techId: number): Promise<UserTechStack> {
    const userTechStack = await this.userTechStacksRepository.findOne({
      where: {
        user_id: userId,
        tech_id: techId
      },
      relations: ['user', 'techStack']
    });
    
    if (!userTechStack) {
      throw new NotFoundException(`User tech stack with user ID ${userId} and tech ID ${techId} not found`);
    }
    
    return userTechStack;
  }

  async update(userId: number, techId: number, updateUserTechStackDto: UpdateUserTechStackDto): Promise<UserTechStack> {
    const userTechStack = await this.findOne(userId, techId);
    
    if (updateUserTechStackDto.user_id || updateUserTechStackDto.tech_id) {
      const newUserId = updateUserTechStackDto.user_id || userId;
      const newTechId = updateUserTechStackDto.tech_id || techId;
      
      if (newUserId !== userId || newTechId !== techId) {
        const existingEntry = await this.userTechStacksRepository.findOne({
          where: {
            user_id: newUserId,
            tech_id: newTechId
          }
        });
        
        if (existingEntry) {
          throw new ConflictException('This user already has this tech stack associated');
        }
        
        if (newUserId !== userId) {
          await this.usersService.findOne(newUserId);
        }
        
        if (newTechId !== techId) {
          await this.techStacksService.findOne(newTechId);
        }
      }
    }
    
    const updatedUserTechStack = this.userTechStacksRepository.merge(userTechStack, updateUserTechStackDto);
    return this.userTechStacksRepository.save(updatedUserTechStack);
  }

  async remove(userId: number, techId: number): Promise<void> {
    const result = await this.userTechStacksRepository.delete({
      user_id: userId,
      tech_id: techId
    });
    
    if (result.affected === 0) {
      throw new NotFoundException(`User tech stack with user ID ${userId} and tech ID ${techId} not found`);
    }
  }
}