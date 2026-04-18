import { api } from "../api/axios";
import type { Vacancy } from "../types/vacancy";

export const getVacancies = async (
  status?: string,
  department?: string,
): Promise<Vacancy[]> => {
  try {
    const res = await api.get<Vacancy[]>("/vacancies", {
      params: { status, department },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    throw error;
  }
};

export const createVacancy = async (
  vacancy: Omit<Vacancy, "id" | "createdAt">,
): Promise<Vacancy> => {
  try {
    const res = await api.post<Vacancy>("/vacancies", vacancy);
    return res.data;
  } catch (error) {
    console.error("Error creating vacancy:", error);
    throw error;
  }
};

export const updateVacancy = async (
  id: string,
  vacancy: Partial<Vacancy>,
): Promise<Vacancy> => {
  try {
    const res = await api.patch<Vacancy>(`/vacancies/${id}`, vacancy);
    return res.data;
  } catch (error) {
    console.error("Error updating vacancy:", error);
    throw error;
  }
};

export const deleteVacancy = async (id: string): Promise<void> => {
  try {
    await api.delete(`/vacancies/${id}`);
  } catch (error) {
    console.error("Error deleting vacancy:", error);
    throw error;
  }
};
