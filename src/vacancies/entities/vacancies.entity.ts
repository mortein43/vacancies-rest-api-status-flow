import { VacancyStatus } from '../enums/vacancy-status.enum';

export class Vacancy {
  id!: string;
  title!: string;
  department!: string;
  location!: string;
  salaryMin!: number;
  salaryMax!: number;
  status!: VacancyStatus;
  description!: string;
  createdAt!: Date;

  constructor(partial: Partial<Vacancy>) {
    Object.assign(this, partial);
  }
}
