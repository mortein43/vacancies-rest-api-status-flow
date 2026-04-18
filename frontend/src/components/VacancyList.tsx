import type { Vacancy } from "../types/vacancy";
import { VacancyCard } from "./VacancyCard";

interface VacancyListProps {
  vacancies: Vacancy[];
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (id: string) => void;
}

export function VacancyList({ vacancies, onEdit, onDelete }: VacancyListProps) {
  if (vacancies.length === 0) {
    return <p className="no-vacancies">No vacancies found.</p>;
  }

  return (
    <div className="vacancy-list">
      {vacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
