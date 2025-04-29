import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UserTechStack } from '../../user-tech-stacks/entities/user-tech-stack.entity';

export enum TechCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  MOBILE = 'mobile'
}

@Entity('tech_stacks')
export class TechStack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'enum',
    enum: TechCategory
  })
  category: TechCategory;

  @OneToMany(() => UserTechStack, userTechStack => userTechStack.techStack)
  userTechStacks: UserTechStack[];
}