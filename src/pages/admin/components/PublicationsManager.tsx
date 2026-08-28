import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { usePublications } from '@/hooks/usePublications';
import { Field, TextAreaField, FormCard } from './fields';

interface PublicationForm {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi: string;
  url: string;
  sort_order: string;
}

const emptyForm: PublicationForm = {
  title: '',
  authors: '',
  venue: '',
  year: '',
  doi: '',
  url: '',
  sort_order: '0',
};

export default function PublicationsManager() {
  const { t } = useTranslation();
  const { publications, loading, error, refetch } = usePublications(1000);
  const [editing, setEditing] = useState<PublicationForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startAdd = () => {
    setEditing({ ...emptyForm });
    setEditingId(null);
  };

  const startEdit = (pub: PublicationForm & { id: string }) => {
    setEditing({
      title: pub.title || '',
      authors: pub.authors || '',
      venue: pub.venue || '',
      year: pub.year ? String(pub.year) : '',
      doi: pub.doi || '',
      url: pub.url || '',
      sort_order: pub.sort_order ? String(pub.sort_order) : '0',
    });
    setEditingId(pub.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        title: editing.title,
        authors: editing.authors || null,
        venue: editing.venue || null,
        year: editing.year ? parseInt(editing.year, 10) : null,
        doi: editing.doi || null,
        url: editing.url || null,
        sort_order: editing.sort_order ? parseInt(editing.sort_order, 10) : 0,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('publications')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('publications').insert(payload);
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
      const { error: deleteError } = await supabase.from('publications').delete().eq('id', id);
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
          {t('admin.tab_publications')}
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
            <Field label={t('admin.field_title')} id="pub-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <Field label={t('admin.field_authors')} id="pub-authors" value={editing.authors} onChange={(e) => setEditing({ ...editing, authors: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={t('admin.field_venue')} id="pub-venue" value={editing.venue} onChange={(e) => setEditing({ ...editing, venue: e.target.value })} />
              <Field label={t('admin.field_year')} id="pub-year" type="number" value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              <Field label={t('admin.field_sort_order')} id="pub-order" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
            </div>
            <Field label={t('admin.field_doi')} id="pub-doi" value={editing.doi} onChange={(e) => setEditing({ ...editing, doi: e.target.value })} placeholder="10.xxxx/xxxx" />
            <Field label={t('admin.field_url')} id="pub-url" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
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
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="flex items-start justify-between gap-4 bg-background-100 rounded-lg border border-background-200 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground-900 text-sm">{pub.title}</p>
                <p className="text-xs text-foreground-500 mt-1">
                  {pub.venue}
                  {pub.venue && pub.year ? ' · ' : ''}
                  {pub.year}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(pub as PublicationForm & { id: string })}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer"
                  aria-label={t('common.edit')}
                >
                  <i className="ri-pencil-line" />
                </button>
                <button
                  onClick={() => handleDelete(pub.id)}
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