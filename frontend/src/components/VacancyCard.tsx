import type { Vacancy } from "../types/vacancy";

interface VacancyCardProps {
  vacancy: Vacancy;
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (id: string) => void;
}

export function VacancyCard({ vacancy, onEdit, onDelete }: VacancyCardProps) {
  const { id, title, department, location, salaryMin, salaryMax, status, description, createdAt } = vacancy;

  return (
    <div className="vacancy-card">
      <div className="vacancy-card-header">
        <h2>{title}</h2>
        <div className="vacancy-card-actions">
          <button onClick={() => onEdit(vacancy)} className="btn-edit">Edit</button>
          <button onClick={() => onDelete(id)} className="btn-delete">Delete</button>
        </div>
      </div>
      <div className="vacancy-info">
        <span><strong>Department:</strong> {department}</span>
        <span><strong>Location:</strong> {location}</span>
        <span><strong>Salary:</strong> ${salaryMin} - ${salaryMax}</span>
        <span><strong>Status:</strong> <span className={`status-${status.toLowerCase()}`}>{status}</span></span>
      </div>
      <p className="vacancy-description">{description}</p>
      <p className="vacancy-date">Posted on: {new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
}
