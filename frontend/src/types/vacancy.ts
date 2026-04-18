export const VacancyStatus = {
  Draft: 'Draft',
  Open: 'Open',
  Paused: 'Paused',
  Closed: 'Closed',
} as const;

export type VacancyStatus = typeof VacancyStatus[keyof typeof VacancyStatus];

export type Vacancy = {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  status: VacancyStatus;
  description: string;
  createdAt: string;
};
