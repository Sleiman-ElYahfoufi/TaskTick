import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, Max, IsDateString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  DELAYED = 'delayed',
  COMPLETED = 'completed'
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum DetailDepth {
  MINIMAL = 'minimal',
  NORMAL = 'normal',
  DETAILED = 'detailed',
  COMPREHENSIVE = 'comprehensive'
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  @IsDateString()
  deadline: Date;

  @Column({
    type: 'enum',
    enum: PriorityLevel,
    default: PriorityLevel.MEDIUM
  })
  priority: PriorityLevel;

  @Column({
    type: 'enum',
    enum: DetailDepth,
    default: DetailDepth.NORMAL
  })
  detail_depth: DetailDepth;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING
  })
  status: ProjectStatus;

  @Column('float')
  @IsNumber()
  estimated_time: number;

  @Column('float', { default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy_rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  user_id: number;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}