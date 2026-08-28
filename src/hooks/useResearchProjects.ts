import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface ResearchProject {
  id: string;
  title: string;
  description_en: string | null;
  description_es: string | null;
  image_url: string | null;
  period: string | null;
  tags: string[] | null;
  sort_order: number | null;
}

export function useResearchProjects() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from('research_projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (supaError) throw supaError;
      setProjects((data as ResearchProject[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load research projects';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}