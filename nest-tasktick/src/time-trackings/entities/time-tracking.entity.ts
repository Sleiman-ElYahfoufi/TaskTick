import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
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

  @Column('timestamp', { nullable: true })
  start_time: Date;

  @Column('timestamp', { nullable: true })
  end_time: Date;

  @Column('float', { nullable: true })
  duration_hours: number;

  @Column('date')
  date: Date;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('boolean', { default: false })
  is_paused: boolean;

  @Column('timestamp', { nullable: true })
  pause_time: Date | null;

  @Column('float', { default: 0 })
  paused_duration_hours: number;

  @Column('timestamp', { nullable: true })
  last_heartbeat: Date;

  @Column('boolean', { default: false })
  auto_paused: boolean;



  @ManyToOne(() => User, user => user.timeTrackings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Task, task => task.timeTrackings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
