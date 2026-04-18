import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { randomUUID } from 'crypto';
import { Vacancy } from '../vacancies/entities/vacancies.entity';
import { VacancyStatus } from './enums/vacancy-status.enum';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly repo: Repository<Vacancy>,
  ) {}

  async findAll(
    status?: string,
    department?: string,
  ): Promise<Vacancy[]> {
    console.log(`Fetching vacancies with filters: status=${status}, department=${department}`);
    const where: FindOptionsWhere<Vacancy> = {};

    if (status) {
      // Find matching enum value by case-insensitive comparison if needed
      const foundStatus = Object.values(VacancyStatus).find(
        (s) => s.toLowerCase() === status.toLowerCase(),
      );
      if (foundStatus) {
        where.status = foundStatus;
      }
    }
    
    if (department) {
      where.department = ILike(`%${department}%`);
    }

    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.repo.findOneBy({ id });
    if (!vacancy)
      throw new NotFoundException(`Vacancy with id ${id} not found`);
    return vacancy;
  }

  async create(createDto: CreateVacancyDto): Promise<Vacancy> {
    const vacancy = this.repo.create({
      ...createDto,
      id: randomUUID(),
      status: createDto.status || VacancyStatus.Draft,
      createdAt: new Date(),
    });

    return this.repo.save(vacancy);
  }

  async update(id: string, updateDto: UpdateVacancyDto): Promise<Vacancy> {
    const vacancy = await this.findOne(id);

    if (updateDto.status && updateDto.status !== vacancy.status) {
      this.isValidTransition(vacancy.status, updateDto.status);
    }

    Object.assign(vacancy, updateDto);

    return this.repo.save(vacancy);
  }

  async updateStatus(id: string, newStatus: VacancyStatus): Promise<Vacancy> {
    const vacancy = await this.findOne(id);

    this.isValidTransition(vacancy.status, newStatus);

    vacancy.status = newStatus;
    return this.repo.save(vacancy);
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.repo.findOneBy({ id });
    if (!vacancy)
      throw new NotFoundException(`Vacancy with id ${id} not found`);

    await this.repo.remove(vacancy);
  }

  private isValidTransition(from: VacancyStatus, to: VacancyStatus): void {
    const transition: Record<VacancyStatus, VacancyStatus[]> = {
      Draft: [VacancyStatus.Open],
      Open: [VacancyStatus.Paused, VacancyStatus.Closed],
      Paused: [VacancyStatus.Open, VacancyStatus.Closed],
      Closed: [],
    };

    if (!transition[from].includes(to)) {
      throw new BadRequestException(
        `Invalid status transition from ${from} to ${to}`,
      );
    }
  }
}
