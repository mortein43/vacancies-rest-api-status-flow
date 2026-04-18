import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { VacancyStatus } from '../enums/vacancy-status.enum';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  department!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  salaryMin!: number;

  @Column({ nullable: true })
  salaryMax!: number;

  @Column({
    type: 'enum',
    enum: VacancyStatus,
    default: VacancyStatus.Draft,
  })
  status!: VacancyStatus;

  @Column({ nullable: true })
  description!: string;

  @Column()
  createdAt!: Date;
}
