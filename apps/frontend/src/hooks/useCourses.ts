import { useState, useMemo, useCallback } from "react";
import { getAllCourses } from "../services/course.service";
import { useDebounce } from "./useDebounce";
import type { Course, CourseFiltersState } from "../types/course.types";

interface UseCoursesReturn {
  courses: Course[];
  filters: CourseFiltersState;
  setFilters: (partial: Partial<CourseFiltersState>) => void;
}

export function useCourses(): UseCoursesReturn {
  const [filters, setFiltersState] = useState<CourseFiltersState>({
    level: "",
    category: "",
    search: "",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const courses = useMemo(() => {
    let result = getAllCourses();
    if (filters.level) {
      result = result.filter((c) => c.level === filters.level);
    }
    if (filters.category) {
      result = result.filter((c) => c.category === filters.category);
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.description.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [filters.level, filters.category, debouncedSearch]);

  const setFilters = useCallback((partial: Partial<CourseFiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  return { courses, filters, setFilters };
}
