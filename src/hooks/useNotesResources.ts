import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface NoteResourceLink {
  label: string;
  url: string;
}

export interface NoteResourceFile {
  name: string;
  url: string;
}

export interface NoteResource {
  id: string;
  course: string | null;
  title: string;
  content: string | null;
  resources: NoteResourceLink[] | null;
  files: NoteResourceFile[] | null;
  sort_order: number | null;
  created_at: string;
}

export function useNotesResources(limit: number = 100) {
  const [notes, setNotes] = useState<NoteResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from('notes_resources')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(limit);
      if (supaError) throw supaError;
      setNotes((data as NoteResource[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load notes';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, error, refetch: fetchNotes };
}