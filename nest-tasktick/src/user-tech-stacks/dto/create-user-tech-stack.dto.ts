import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateUserTechStackDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  tech_id: number;

  @IsNumber()
  @Min(1, { message: 'Proficiency level must be at least 1' })
  @Max(5, { message: 'Proficiency level cannot exceed 5' })
  proficiency_level: number = 1;
}