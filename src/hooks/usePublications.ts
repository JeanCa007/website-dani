import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Publication {
  id: string;
  title: string;
  authors: string | null;
  venue: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
  sort_order: number | null;
  created_at: string;
}

export function usePublications(limit: number = 10) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false })
        .order('sort_order', { ascending: true })
        .limit(limit);
      if (supaError) throw supaError;
      setPublications((data as Publication[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load publications';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return { publications, loading, error, refetch: fetchPublications };
}