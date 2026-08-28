import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface TeachingCourse {
  id: string;
  name: string;
  code: string | null;
  semester: string | null;
  level: string | null;
  description_en: string | null;
  description_es: string | null;
  sort_order: number | null;
}

export function useTeachingCourses() {
  const [courses, setCourses] = useState<TeachingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from('teaching_courses')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (supaError) throw supaError;
      setCourses((data as TeachingCourse[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load teaching courses';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}