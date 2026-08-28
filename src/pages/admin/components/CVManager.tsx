import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useCVEntries } from '@/hooks/useCVEntries';
import { Field, TextAreaField, FormCard } from './fields';

interface CVForm {
  type: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  sort_order: string;
}

const emptyForm: CVForm = {
  type: 'education',
  title: '',
  organization: '',
  period: '',
  description: '',
  sort_order: '0',
};

export default function CVManager() {
  const { t } = useTranslation();
  const { entries, loading, error, refetch } = useCVEntries();
  const [editing, setEditing] = useState<CVForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const typeLabel = (type: string) => {
    if (type === 'education') return t('admin.type_education');
    if (type === 'experience') return t('admin.type_experience');
    return t('admin.type_award');
  };

  const startAdd = () => {
    setEditing({ ...emptyForm });
    setEditingId(null);
  };

  const startEdit = (entry: CVForm & { id: string }) => {
    setEditing({
      type: entry.type || 'education',
      title: entry.title || '',
      organization: entry.organization || '',
      period: entry.period || '',
      description: entry.description || '',
      sort_order: entry.sort_order ? String(entry.sort_order) : '0',
    });
    setEditingId(entry.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        type: editing.type,
        title: editing.title,
        organization: editing.organization || null,
        period: editing.period || null,
        description: editing.description || null,
        sort_order: editing.sort_order ? parseInt(editing.sort_order, 10) : 0,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('cv_entries')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('cv_entries').insert(payload);
        if (insertError) throw insertError;
      }

      setEditing(null);
      setEditingId(null);
      setMessage(t('common.saved'));
      refetch();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('common.confirm_delete'))) return;
    try {
      const { error: deleteError } = await supabase.from('cv_entries').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setMessage(t('common.saved'));
      refetch();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground-950">
          {t('admin.tab_cv')}
        </h3>
        <button
          onClick={startAdd}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
        >
          {t('common.add')}
        </button>
      </div>

      {editing && (
        <FormCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cv-type" className="block text-sm font-medium text-foreground-700 mb-1.5">
                {t('admin.field_type')}
              </label>
              <select
                id="cv-type"
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 cursor-pointer"
              >
                <option value="education">{t('admin.type_education')}</option>
                <option value="experience">{t('admin.type_experience')}</option>
                <option value="award">{t('admin.type_award')}</option>
              </select>
            </div>
            <Field label={t('admin.field_title')} id="cv-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <Field label={t('admin.field_organization')} id="cv-org" value={editing.organization} onChange={(e) => setEditing({ ...editing, organization: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('admin.field_period')} id="cv-period" value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} placeholder="2020 – 2024" />
              <Field label={t('admin.field_sort_order')} id="cv-order" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
            </div>
            <TextAreaField label={t('admin.field_description')} id="cv-desc" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                {saving ? t('common.saving') : t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-5 py-2 bg-background-200 text-foreground-700 rounded-md hover:bg-background-300 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </FormCard>
      )}

      {message && <p className="text-sm text-foreground-600">{message}</p>}

      {loading && <div className="h-40 bg-background-200 rounded-lg animate-pulse" />}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 bg-background-100 rounded-lg border border-background-200 p-4"
            >
              <div className="min-w-0">
                <span className="text-xs font-medium text-secondary-700 bg-secondary-100 px-2 py-0.5 rounded-full">
                  {typeLabel(entry.type)}
                </span>
                <p className="font-medium text-foreground-900 text-sm mt-2">{entry.title}</p>
                <p className="text-xs text-foreground-500 mt-1">
                  {entry.organization}
                  {entry.organization && entry.period ? ' · ' : ''}
                  {entry.period}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(entry as CVForm & { id: string })}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer"
                  aria-label={t('common.edit')}
                >
                  <i className="ri-pencil-line" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-background-200 text-foreground-700 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                  aria-label={t('common.delete')}
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}