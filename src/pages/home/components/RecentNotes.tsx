import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { NoteResource } from '@/hooks/useNotesResources';

interface RecentNotesProps {
  notes: NoteResource[] | null;
  loading: boolean;
  error: string | null;
}

export default function RecentNotes({ notes, loading, error }: RecentNotesProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-8 bg-background-200 rounded w-1/3 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-background-200 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (!notes || notes.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-background-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl font-semibold text-foreground-950 mb-8">
          {t('home.recent_notes')}
        </h2>
        <div className="space-y-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 bg-background-100 rounded-lg border border-background-200 hover:border-primary-300 transition-colors"
            >
              {note.course && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full mb-2">
                  <i className="ri-book-2-line" />
                  {note.course}
                </span>
              )}
              <h3 className="font-heading text-xl font-semibold text-foreground-950 mb-2">
                {note.title}
              </h3>
              {note.content && (
                <p className="text-sm text-foreground-600 leading-relaxed line-clamp-3">
                  {note.content}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/notes-resources"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {t('home.view_all_notes')} →
          </Link>
        </div>
      </div>
    </section>
  );
}