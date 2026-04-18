import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { randomUUID } from 'crypto';
import { Vacancy } from '../vacancies/entities/vacancies.entity';
import { VacancyStatus } from './enums/vacancy-status.enum';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  private vacancies: Vacancy[] = [];

  findAll(status?: VacancyStatus, department?: string): Vacancy[] {
    return this.vacancies.filter((v) => {
      if (status && v.status !== status) return false;
      if (department && v.department !== department) return false;
      return true;
    });
  }

  findOne(id: string): Vacancy {
    const vacancy = this.vacancies.find((v) => v.id === id);
    if (!vacancy)
      throw new NotFoundException(`Vacancy with id ${id} not found`);
    return vacancy;
  }

  create(createDto: CreateVacancyDto): Vacancy {
    const vacancy = new Vacancy({
      ...createDto,
      id: randomUUID(),
      status: VacancyStatus.Draft,
      createdAt: new Date(),
    });

    this.vacancies.push(vacancy);
    return vacancy;
  }

  update(id: string, updateDto: UpdateVacancyDto): Vacancy {
    const vacancy = this.findOne(id);
    Object.assign(vacancy, updateDto);
    return vacancy;
  }

  updateStatus(id: string, newStatus: VacancyStatus): Vacancy {
    const vacancy = this.findOne(id);

    if (!this.isValidTransition(vacancy.status, newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${vacancy.status} to ${newStatus}`,
      );
    }

    vacancy.status = newStatus;
    return vacancy;
  }

  remove(id: string) {
    const index = this.vacancies.findIndex((v) => v.id === id);
    if (index === -1)
      throw new NotFoundException(`Vacancy with id ${id} not found`);
    if (this.vacancies[index].status !== VacancyStatus.Draft) {
      throw new ConflictException(
        'Only vacancies with Draft status can be deleted',
      );
    }

    this.vacancies.splice(index, 1);
  }

  private isValidTransition(from: VacancyStatus, to: VacancyStatus): boolean {
    const transition: Record<VacancyStatus, VacancyStatus[]> = {
      Draft: [VacancyStatus.Open],
      Open: [VacancyStatus.Paused, VacancyStatus.Closed],
      Paused: [VacancyStatus.Open, VacancyStatus.Closed],
      Closed: [],
    };
    return transition[from].includes(to);
  }
}
