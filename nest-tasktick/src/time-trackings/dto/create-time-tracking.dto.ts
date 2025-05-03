import { IsDateString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

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
  duration_hours?: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}