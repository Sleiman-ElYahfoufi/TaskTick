import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export enum InsightType {
  TIME_ACCURACY = 'time_accuracy',
  PRODUCTIVITY_PATTERN = 'productivity_pattern',
  TASK_BREAKDOWN = 'task_breakdown',
  TECH_PERFORMANCE = 'tech_performance'
}

@Entity('ai_insights')
export class AiInsight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: InsightType
  })
  @IsEnum(InsightType)
  type: InsightType;

  @Column('text')
  @IsNotEmpty()
  description: string;



  @ManyToOne(() => User, user => user.aiInsights, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}