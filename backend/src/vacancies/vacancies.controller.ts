import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from './entities/vacancies.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyStatus } from './enums/vacancy-status.enum';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  findAll(
    @Query('status') status?: VacancyStatus,
    @Query('department') department?: string,
  ): Vacancy[] {
    return this.vacanciesService.findAll(status, department);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Vacancy {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateVacancyDto): Vacancy {
    return this.vacanciesService.create(createDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateVacancyDto,
  ): Vacancy {
    return this.vacanciesService.update(id, updateDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: VacancyStatus,
  ): Vacancy {
    return this.vacanciesService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.vacanciesService.remove(id);
  }
}
