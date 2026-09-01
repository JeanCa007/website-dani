import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  photo_url: string | null;
  cv_pdf_url: string | null;
  email: string | null;
  institution: string | null;
  position: string | null;
  location: string | null;
  social_links: Record<string, string> | null;
  bio_en: string | null;
  bio_es: string | null;
  research_interests: string[] | null;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from('profile')
        .select('*')
        .maybeSingle();
      if (supaError) throw supaError;
      setProfile(data as Profile | null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}