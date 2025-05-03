import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTimeTrackingDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  task_id: number;

  @IsNotEmpty()
  @IsDateString()
  start_time: Date;

  @IsOptional()
  @IsDateString()
  end_time?: Date;

  @IsOptional()
  @IsNumber()
  session_duration?: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}