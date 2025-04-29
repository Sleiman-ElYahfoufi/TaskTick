import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, Max, IsDateString } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';
import { TimeTracking } from '../../time-trackings/entities/time-tracking.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('float')
  @IsNumber()
  estimated_time: number;

  @Column({ nullable: true })
  @IsDateString()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: PriorityLevel,
    default: PriorityLevel.MEDIUM
  })
  priority: PriorityLevel;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @Column('int', { default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  project_id: number;

  @ManyToOne(() => Project, project => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => TimeTracking, timeTracking => timeTracking.task)
  timeTrackings: TimeTracking[];
}