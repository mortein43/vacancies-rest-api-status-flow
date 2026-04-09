import { IsString, IsNumber, Min } from 'class-validator';

export class CreateVacancyDto {
  @IsString()
  title!: string;

  @IsString()
  department!: string;

  @IsString()
  location!: string;

  @IsNumber()
  @Min(0)
  salaryMin!: number;

  @IsNumber()
  @Min(0)
  salaryMax!: number;

  @IsString()
  description!: string;
}
