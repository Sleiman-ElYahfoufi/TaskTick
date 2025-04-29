import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { TechStack } from '../../tech-stacks/entities/tech-stack.entity';

@Entity('user_tech_stacks')
export class UserTechStack {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  tech_id: number;

  @Column('int', { default: 1 })
  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency_level: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.userTechStacks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TechStack, techStack => techStack.userTechStacks)
  @JoinColumn({ name: 'tech_id' })
  techStack: TechStack;
}