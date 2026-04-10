import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VacancyModule } from './vacancies/vacancies.module';

@Module({
  imports: [VacancyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
