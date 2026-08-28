import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { Field, TextAreaField } from './fields';

export default function ProfileEditor() {
  const { t } = useTranslation();
  const { profile, loading, refetch } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [institution, setInstitution] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioEs, setBioEs] = useState('');
  const [interests, setInterests] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPosition(profile.position || '');
      setInstitution(profile.institution || '');
      setLocation(profile.location || '');
      setEmail(profile.email || '');
      setBioEn(profile.bio_en || '');
      setBioEs(profile.bio_es || '');
      setInterests((profile.research_interests || []).join('\n'));
      setSocialLinks(profile.social_links || {});
    }
  }, [profile]);

  const updateSocialLink = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const interestsArray = interests
        .split('\n')
        .map((i) => i.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from('profile')
        .update({
          full_name: fullName,
          position,
          institution,
          location,
          email,
          bio_en: bioEn,
          bio_es: bioEs,
          research_interests: interestsArray,
          social_links: socialLinks,
        })
        .eq('id', profile?.id);

      if (error) throw error;
      setMessage(t('admin.profile_saved'));
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('common.error');
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    setMessage(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profile')
        .update({ photo_url: publicUrl.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      refetch();
      setMessage(t('admin.profile_saved'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('common.error');
      setMessage(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile) return;
    setUploading(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('profile')
        .update({ photo_url: null })
        .eq('id', profile.id);
      if (error) throw error;
      refetch();
      setMessage(t('admin.profile_saved'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('common.error');
      setMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-background-200 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-background-100 rounded-lg border border-background-200 p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
          {t('admin.tab_profile')}
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt={fullName}
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-2xl font-heading text-white">
                {fullName
                  ? fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'DA'}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {profile?.photo_url ? t('admin.photo_change') : t('admin.photo_upload')}
            </button>
            {profile?.photo_url && (
              <button
                onClick={handleRemovePhoto}
                disabled={uploading}
                className="px-4 py-2 bg-background-200 text-foreground-700 rounded-md hover:bg-background-300 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                {t('admin.photo_remove')}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          {uploading && (
            <span className="text-sm text-foreground-500">{t('common.loading')}</span>
          )}
        </div>
      </div>

      <div className="bg-background-100 rounded-lg border border-background-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('admin.full_name')} id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Field label={t('admin.position')} id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
          <Field label={t('admin.institution')} id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} />
          <Field label={t('admin.location')} id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Field label={t('admin.email')} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <TextAreaField label={t('admin.bio_en')} id="bio_en" value={bioEn} onChange={(e) => setBioEn(e.target.value)} />
        <TextAreaField label={t('admin.bio_es')} id="bio_es" value={bioEs} onChange={(e) => setBioEs(e.target.value)} />
        <TextAreaField label={t('admin.research_interests')} id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} rows={5} />
      </div>

      <div className="bg-background-100 rounded-lg border border-background-200 p-6 space-y-4">
        <h3 className="font-heading text-lg font-semibold text-foreground-950">
          {t('admin.social_links')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Google Scholar" id="google_scholar" value={socialLinks.google_scholar || ''} onChange={(e) => updateSocialLink('google_scholar', e.target.value)} />
          <Field label="ORCID" id="orcid" value={socialLinks.orcid || ''} onChange={(e) => updateSocialLink('orcid', e.target.value)} />
          <Field label="LinkedIn" id="linkedin" value={socialLinks.linkedin || ''} onChange={(e) => updateSocialLink('linkedin', e.target.value)} />
          <Field label="GitHub" id="github" value={socialLinks.github || ''} onChange={(e) => updateSocialLink('github', e.target.value)} />
          <Field label="Twitter / X" id="twitter" value={socialLinks.twitter || ''} onChange={(e) => updateSocialLink('twitter', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
        >
          {saving ? t('common.saving') : t('common.save')}
        </button>
        {message && <span className="text-sm text-foreground-600">{message}</span>}
      </div>
    </div>
  );
}