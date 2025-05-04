import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';
import { TimeTracking } from '../../time-trackings/entities/time-tracking.entity';
import { UserTechStack } from '../../user-tech-stacks/entities/user-tech-stack.entity';
import { AiInsight } from '../../ai-insights/entities/ai-insight.entity';

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERT = 'expert'
}

export enum UserRole {
  WEB_DEVELOPER = 'Web Developer',
  MOBILE_DEVELOPER = 'Mobile Developer',
  BACKEND_DEVELOPER = 'Backend Developer',
  FULLSTACK_DEVELOPER = 'Fullstack Developer',
  SOFTWARE_ENGINEER = 'Software Engineer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SOFTWARE_ENGINEER
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.INTERMEDIATE
  })
  experience_level: ExperienceLevel;



  @OneToMany(() => Project, project => project.user)
  projects: Project[];

  @OneToMany(() => TimeTracking, timeTracking => timeTracking.user)
  timeTrackings: TimeTracking[];

  @OneToMany(() => UserTechStack, userTechStack => userTechStack.user)
  userTechStacks: UserTechStack[];

  @OneToMany(() => AiInsight, aiInsight => aiInsight.user)
  aiInsights: AiInsight[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
