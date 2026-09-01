import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useNotesResources, NoteResourceLink, NoteResourceFile } from '@/hooks/useNotesResources';
import { Field, TextAreaField, FormCard } from './fields';

interface NoteForm {
  course: string;
  title: string;
  content: string;
  resources: NoteResourceLink[];
  sort_order: string;
}

const emptyForm: NoteForm = {
  course: '',
  title: '',
  content: '',
  resources: [],
  sort_order: '0',
};

export default function NotesResourcesManager() {
  const { t } = useTranslation();
  const { notes, loading, error, refetch } = useNotesResources(1000);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<NoteForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [files, setFiles] = useState<NoteResourceFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startAdd = () => {
    setEditing({ ...emptyForm, resources: [] });
    setEditingId(null);
    setFiles([]);
    setMessage(null);
  };

  const startEdit = (note: NoteForm & { id: string; files: NoteResourceFile[] | null }) => {
    setEditing({
      course: note.course || '',
      title: note.title || '',
      content: note.content || '',
      resources: note.resources || [],
      sort_order: note.sort_order ? String(note.sort_order) : '0',
    });
    setEditingId(note.id);
    setFiles(note.files || []);
    setMessage(null);
  };

  const addResource = () => {
    if (!editing) return;
    setEditing({ ...editing, resources: [...editing.resources, { label: '', url: '' }] });
  };

  const updateResource = (index: number, key: 'label' | 'url', value: string) => {
    if (!editing) return;
    const resources = editing.resources.map((r, i) => (i === index ? { ...r, [key]: value } : r));
    setEditing({ ...editing, resources });
  };

  const removeResource = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, resources: editing.resources.filter((_, i) => i !== index) });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    setUploading(true);
    setMessage(null);
    try {
      const newFiles: NoteResourceFile[] = [];
      for (const file of Array.from(list)) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'file';
        const safeBase = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .toLowerCase()
          .slice(0, 40);
        const fileName = `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBase}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('notes-files').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('notes-files').getPublicUrl(fileName);
        newFiles.push({ name: file.name, url: data.publicUrl });
      }
      setFiles((prev) => [...prev, ...newFiles]);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const cleanResources = editing.resources.filter((r) => r.url.trim() !== '');
      const payload = {
        course: editing.course || null,
        title: editing.title,
        content: editing.content || null,
        resources: cleanResources,
        files,
        sort_order: editing.sort_order ? parseInt(editing.sort_order, 10) : 0,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('notes_resources')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('notes_resources').insert(payload);
        if (insertError) throw insertError;
      }

      setEditing(null);
      setEditingId(null);
      setFiles([]);
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
      const { error: deleteError } = await supabase.from('notes_resources').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setMessage(t('common.saved'));
      refetch();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const moveNote = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= notes.length) return;
    const reordered = [...notes];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    try {
      await Promise.all(
        reordered.map((n, i) =>
          supabase.from('notes_resources').update({ sort_order: i }).eq('id', n.id)
        )
      );
      refetch();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground-950">
          {t('admin.tab_notes')}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t('admin.field_title')}
                id="note-title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                required
              />
              <Field
                label={t('admin.field_course')}
                id="note-course"
                value={editing.course}
                onChange={(e) => setEditing({ ...editing, course: e.target.value })}
              />
            </div>

            <TextAreaField
              label={t('admin.field_content')}
              id="note-content"
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              rows={6}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground-700">
                  {t('admin.field_resources')}
                </span>
                <button
                  type="button"
                  onClick={addResource}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + {t('admin.add_resource')}
                </button>
              </div>
              {editing.resources.length === 0 && (
                <p className="text-xs text-foreground-500 mb-2">{t('notes.resources')}</p>
              )}
              <div className="space-y-2">
                {editing.resources.map((res, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={res.label}
                      onChange={(e) => updateResource(index, 'label', e.target.value)}
                      placeholder={t('admin.resource_label')}
                      className="flex-1 px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                    />
                    <input
                      type="text"
                      value={res.url}
                      onChange={(e) => updateResource(index, 'url', e.target.value)}
                      placeholder={t('admin.field_url')}
                      className="flex-1 px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeResource(index)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center rounded-md bg-background-200 text-foreground-700 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                      aria-label={t('admin.remove')}
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground-700">
                  {t('admin.field_files')}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  + {t('admin.add_file')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {uploading && <p className="text-xs text-foreground-500 mb-2">{t('common.loading')}</p>}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 bg-background-50 border border-background-200 rounded-md px-3 py-2"
                    >
                      <span className="text-sm text-foreground-700 truncate">
                        <i className="ri-file-line mr-2 text-secondary-700" />
                        {f.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-md text-foreground-500 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                        aria-label={t('admin.remove')}
                      >
                        <i className="ri-close-line" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Field
              label={t('admin.field_sort_order')}
              id="note-order"
              type="number"
              value={editing.sort_order}
              onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })}
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
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
          {notes.map((note, index) => (
            <div
              key={note.id}
              className="flex items-start justify-between gap-4 bg-background-100 rounded-lg border border-background-200 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground-900 text-sm">{note.title}</p>
                {note.course && (
                  <p className="text-xs text-secondary-700 mt-1">
                    <i className="ri-book-2-line mr-1" />
                    {note.course}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveNote(index, -1)}
                  disabled={index === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer disabled:opacity-40"
                  aria-label={t('admin.move_up')}
                >
                  <i className="ri-arrow-up-line" />
                </button>
                <button
                  onClick={() => moveNote(index, 1)}
                  disabled={index === notes.length - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer disabled:opacity-40"
                  aria-label={t('admin.move_down')}
                >
                  <i className="ri-arrow-down-line" />
                </button>
                <button
                  onClick={() => startEdit(note as NoteForm & { id: string; files: NoteResourceFile[] | null })}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer"
                  aria-label={t('common.edit')}
                >
                  <i className="ri-pencil-line" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
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