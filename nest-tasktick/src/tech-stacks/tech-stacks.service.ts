import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { TechStack, TechCategory } from './entities/tech-stack.entity';

@Injectable()
export class TechStacksService {
  constructor(
    @InjectRepository(TechStack)
    private techStacksRepository: Repository<TechStack>,
  ) {}

  async create(createTechStackDto: CreateTechStackDto): Promise<TechStack> {
    const existingTechStack = await this.techStacksRepository.findOne({
      where: { name: createTechStackDto.name }
    });
    
    if (existingTechStack) {
      throw new ConflictException(`Tech stack with name "${createTechStackDto.name}" already exists`);
    }
    
    const techStack = this.techStacksRepository.create(createTechStackDto);
    return this.techStacksRepository.save(techStack);
  }

  async findAll(): Promise<TechStack[]> {
    return this.techStacksRepository.find();
  }

  async findByCategory(category: TechCategory): Promise<TechStack[]> {
    return this.techStacksRepository.find({
      where: { category }
    });
  }

  async findByName(name: string): Promise<TechStack[]> {
    return this.techStacksRepository.find({
      where: { name: Like(`%${name}%`) }
    });
  }

  async findOne(id: number): Promise<TechStack> {
    const techStack = await this.techStacksRepository.findOne({ where: { id } });
    if (!techStack) {
      throw new NotFoundException(`Tech stack with ID ${id} not found`);
    }
    return techStack;
  }

  async update(id: number, updateTechStackDto: UpdateTechStackDto): Promise<TechStack> {
    const techStack = await this.findOne(id);
    
    // Check if updating to a name that already exists
    if (updateTechStackDto.name && updateTechStackDto.name !== techStack.name) {
      const existingTechStack = await this.techStacksRepository.findOne({
        where: { name: updateTechStackDto.name }
      });
      
      if (existingTechStack) {
        throw new ConflictException(`Tech stack with name "${updateTechStackDto.name}" already exists`);
      }
    }
    
    const updatedTechStack = this.techStacksRepository.merge(techStack, updateTechStackDto);
    return this.techStacksRepository.save(updatedTechStack);
  }

  async remove(id: number): Promise<void> {
    const result = await this.techStacksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tech stack with ID ${id} not found`);
    }
  }
}