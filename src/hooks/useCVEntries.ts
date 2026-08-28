import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface CVEntry {
  id: string;
  type: string;
  title: string;
  organization: string | null;
  period: string | null;
  description: string | null;
  sort_order: number | null;
}

export function useCVEntries() {
  const [entries, setEntries] = useState<CVEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from('cv_entries')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (supaError) throw supaError;
      setEntries((data as CVEntry[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load CV entries';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, error, refetch: fetchEntries };
}