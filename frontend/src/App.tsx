import "./App.css";
import { useState, useEffect } from "react";
import { useVacancies } from "./hooks/useVacancies";
import { VacancyList } from "./components/VacancyList";
import { VacancyForm } from "./components/VacancyForm";
import { VacancyStatus } from "./types/vacancy";
import type { Vacancy } from "./types/vacancy";

export default function App() {
  const [statusFilter, setStatusFilter] = useState<VacancyStatus | undefined>(
    undefined,
  );
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [debouncedDepartment, setDebouncedDepartment] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDepartment(departmentFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [departmentFilter]);

  const {
    data: vacancies,
    isLoading,
    error,
    addVacancy,
    updateVacancy,
    deleteVacancy,
    clearError,
  } = useVacancies(statusFilter, debouncedDepartment || undefined);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);

  const handleAddClick = () => {
    setEditingVacancy(null);
    clearError();
    setIsFormOpen(true);
  };

  const handleEditClick = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    clearError();
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    clearError();
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      try {
        await deleteVacancy(id);
      } catch {
        // Error is handled in the hook
      }
    }
  };

  const handleFormSubmit = async (
    formData: Omit<Vacancy, "id" | "createdAt">,
  ) => {
    try {
      if (editingVacancy) {
        await updateVacancy(editingVacancy.id, formData);
      } else {
        await addVacancy(formData);
      }
      setIsFormOpen(false);
      clearError();
    } catch {
      // Error is already set in hook
    }
  };

  if (isLoading && vacancies.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading vacancies...</div>
        {error && <div className="error-banner">Error: {error.message}</div>}
      </div>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Vacancy Management</h1>
        {!isFormOpen && (
          <button className="btn-primary" onClick={handleAddClick}>
            Add New Vacancy
          </button>
        )}
      </header>

      {error && <div className="error-banner">Error: {error.message}</div>}

      <main>
        {isFormOpen ? (
          <div className="form-container">
            <VacancyForm
              initialData={editingVacancy || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <>
            <div className="filters">
              <div className="filter-group">
                <label>Status Filter:</label>
                <select
                  value={statusFilter || ""}
                  onChange={(e) =>
                    setStatusFilter(
                      (e.target.value as VacancyStatus) || undefined,
                    )
                  }
                >
                  <option value="">All Statuses</option>
                  {Object.values(VacancyStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Department Filter:</label>
                <input
                  type="text"
                  placeholder="Filter by department..."
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                />
              </div>
              {isLoading && (
                <span className="loading-spinner">Searching...</span>
              )}
            </div>
            <VacancyList
              vacancies={vacancies}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </>
        )}
      </main>
    </div>
  );
}
