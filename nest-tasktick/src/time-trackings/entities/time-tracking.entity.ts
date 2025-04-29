import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('time_trackings')
export class TimeTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  task_id: number;

  @Column('timestamp')
  start_time: Date;

  @Column('timestamp', { nullable: true })
  end_time: Date;

  @Column('float', { nullable: true })
  @IsNumber()
  session_duration: number;

  @Column('date')
  @IsDateString()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.timeTrackings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Task, task => task.timeTrackings)
  @JoinColumn({ name: 'task_id' })
  task: Task;
}