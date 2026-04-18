import { useState } from "react";
import { VacancyStatus } from "../types/vacancy";
import type { Vacancy } from "../types/vacancy";

interface VacancyFormProps {
  initialData?: Partial<Vacancy>;
  onSubmit: (data: Omit<Vacancy, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

export function VacancyForm({
  initialData,
  onSubmit,
  onCancel,
}: VacancyFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    department: initialData?.department || "",
    location: initialData?.location || "",
    salaryMin: initialData?.salaryMin || 0,
    salaryMax: initialData?.salaryMax || 0,
    status: initialData?.status || VacancyStatus.Draft,
    description: initialData?.description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salaryMin" || name === "salaryMax" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData as Omit<Vacancy, "id" | "createdAt">);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="vacancy-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Vacancy" : "Add New Vacancy"}</h3>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salaryMin">Min Salary</label>
          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div className="form-group">
          <label htmlFor="salaryMax">Max Salary</label>
          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          {Object.values(VacancyStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Vacancy"}
        </button>
      </div>
    </form>
  );
}
