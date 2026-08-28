import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useTeachingCourses } from '@/hooks/useTeachingCourses';
import { Field, TextAreaField, FormCard } from './fields';

interface TeachingForm {
  name: string;
  code: string;
  semester: string;
  level: string;
  description_en: string;
  description_es: string;
  sort_order: string;
}

const emptyForm: TeachingForm = {
  name: '',
  code: '',
  semester: '',
  level: '',
  description_en: '',
  description_es: '',
  sort_order: '0',
};

export default function TeachingManager() {
  const { t } = useTranslation();
  const { courses, loading, error, refetch } = useTeachingCourses();
  const [editing, setEditing] = useState<TeachingForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startAdd = () => {
    setEditing({ ...emptyForm });
    setEditingId(null);
  };

  const startEdit = (course: TeachingForm & { id: string }) => {
    setEditing({
      name: course.name || '',
      code: course.code || '',
      semester: course.semester || '',
      level: course.level || '',
      description_en: course.description_en || '',
      description_es: course.description_es || '',
      sort_order: course.sort_order ? String(course.sort_order) : '0',
    });
    setEditingId(course.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        name: editing.name,
        code: editing.code || null,
        semester: editing.semester || null,
        level: editing.level || null,
        description_en: editing.description_en || null,
        description_es: editing.description_es || null,
        sort_order: editing.sort_order ? parseInt(editing.sort_order, 10) : 0,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('teaching_courses')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('teaching_courses').insert(payload);
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
      const { error: deleteError } = await supabase.from('teaching_courses').delete().eq('id', id);
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
          {t('admin.tab_teaching')}
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
            <Field label={t('admin.field_name')} id="tc-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={t('admin.field_code')} id="tc-code" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
              <Field label={t('admin.field_semester')} id="tc-semester" value={editing.semester} onChange={(e) => setEditing({ ...editing, semester: e.target.value })} />
              <Field label={t('admin.field_level')} id="tc-level" value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })} />
            </div>
            <TextAreaField label={t('admin.bio_en')} id="tc-desc-en" value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
            <TextAreaField label={t('admin.bio_es')} id="tc-desc-es" value={editing.description_es} onChange={(e) => setEditing({ ...editing, description_es: e.target.value })} />
            <Field label={t('admin.field_sort_order')} id="tc-order" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
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
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-start justify-between gap-4 bg-background-100 rounded-lg border border-background-200 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground-900 text-sm">{course.name}</p>
                <p className="text-xs text-foreground-500 mt-1">
                  {course.code}
                  {course.code && course.semester ? ' · ' : ''}
                  {course.semester}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(course as TeachingForm & { id: string })}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer"
                  aria-label={t('common.edit')}
                >
                  <i className="ri-pencil-line" />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
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