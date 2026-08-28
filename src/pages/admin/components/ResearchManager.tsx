import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useResearchProjects } from '@/hooks/useResearchProjects';
import { Field, TextAreaField, FormCard } from './fields';

interface ResearchForm {
  title: string;
  description_en: string;
  description_es: string;
  image_url: string;
  period: string;
  tags: string;
  sort_order: string;
}

const emptyForm: ResearchForm = {
  title: '',
  description_en: '',
  description_es: '',
  image_url: '',
  period: '',
  tags: '',
  sort_order: '0',
};

export default function ResearchManager() {
  const { t } = useTranslation();
  const { projects, loading, error, refetch } = useResearchProjects();
  const [editing, setEditing] = useState<ResearchForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startAdd = () => {
    setEditing({ ...emptyForm });
    setEditingId(null);
  };

  const startEdit = (project: ResearchForm & { id: string }) => {
    setEditing({
      title: project.title || '',
      description_en: project.description_en || '',
      description_es: project.description_es || '',
      image_url: project.image_url || '',
      period: project.period || '',
      tags: (project.tags || []).join(', '),
      sort_order: project.sort_order ? String(project.sort_order) : '0',
    });
    setEditingId(project.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const tagsArray = editing.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        title: editing.title,
        description_en: editing.description_en || null,
        description_es: editing.description_es || null,
        image_url: editing.image_url || null,
        period: editing.period || null,
        tags: tagsArray,
        sort_order: editing.sort_order ? parseInt(editing.sort_order, 10) : 0,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('research_projects')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('research_projects').insert(payload);
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
      const { error: deleteError } = await supabase.from('research_projects').delete().eq('id', id);
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
          {t('admin.tab_research')}
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
            <Field label={t('admin.field_title')} id="rp-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <TextAreaField label={t('admin.bio_en')} id="rp-desc-en" value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
            <TextAreaField label={t('admin.bio_es')} id="rp-desc-es" value={editing.description_es} onChange={(e) => setEditing({ ...editing, description_es: e.target.value })} />
            <Field label={t('admin.field_image_url')} id="rp-image" value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={t('admin.field_period_label')} id="rp-period" value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} />
              <Field label={t('admin.field_tags')} id="rp-tags" value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
              <Field label={t('admin.field_sort_order')} id="rp-order" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
            </div>
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
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-start justify-between gap-4 bg-background-100 rounded-lg border border-background-200 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground-900 text-sm">{project.title}</p>
                <p className="text-xs text-foreground-500 mt-1">{project.period}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(project as ResearchForm & { id: string })}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer"
                  aria-label={t('common.edit')}
                >
                  <i className="ri-pencil-line" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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