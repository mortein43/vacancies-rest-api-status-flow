import { useState, useEffect, useCallback } from "react";
import { getVacancies, createVacancy as apiCreateVacancy, updateVacancy as apiUpdateVacancy, deleteVacancy as apiDeleteVacancy } from "../services/vacancies.service";
import { VacancyStatus } from "../types/vacancy";
import type { Vacancy } from "../types/vacancy";

export function useVacancies(status?: VacancyStatus, department?: string) {
  const [data, setData] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVacancies = useCallback(async () => {
    setIsLoading(true);
    try {
      const vacancies = await getVacancies(status, department);
      setData(vacancies);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [status, department]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const addVacancy = async (vacancy: Omit<Vacancy, "id" | "createdAt">) => {
    try {
      const newVacancy = await apiCreateVacancy(vacancy);
      // We don't necessarily want to just append if filters are active, 
      // but for simplicity in CRUD we can refresh or append.
      // If we append, it might violate current filters.
      // Let's refresh to be safe with filters.
      await fetchVacancies();
      return newVacancy;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create vacancy"));
      throw err;
    }
  };

  const updateVacancy = async (id: string, vacancy: Partial<Vacancy>) => {
    try {
      const updated = await apiUpdateVacancy(id, vacancy);
      // Refresh to ensure filters are still respected (e.g. if status changed)
      await fetchVacancies();
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update vacancy"));
      throw err;
    }
  };

  const deleteVacancy = async (id: string) => {
    try {
      await apiDeleteVacancy(id);
      setData((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete vacancy"));
      throw err;
    }
  };

  const clearError = () => setError(null);

  return { data, isLoading, error, addVacancy, updateVacancy, deleteVacancy, refresh: fetchVacancies, clearError };
}
