import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '@/components/feature/PageShell';
import { useNotesResources } from '@/hooks/useNotesResources';

export default function NotesResourcesPage() {
  const { t } = useTranslation();
  const { notes, loading, error } = useNotesResources(1000);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q === '') return notes;
    return notes.filter((n) => {
      const haystack = [n.title, n.course, n.content]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [notes, search]);

  return (
    <PageShell pageTitle={t('notes.title')}>
      <div className="max-w-4xl">
        <div className="relative mb-6">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('notes.search')}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
          />
        </div>

        <p className="text-sm text-foreground-500 mb-6">
          {t('notes.count', { count: filtered.length })}
        </p>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 bg-background-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-foreground-500 text-sm">{t('notes.empty')}</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((note) => {
              const resources = note.resources || [];
              const files = note.files || [];
              return (
                <article
                  key={note.id}
                  className="bg-background-100 rounded-lg border border-background-200 p-6 hover:border-primary-300 transition-colors"
                >
                  {note.course && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full mb-3">
                      <i className="ri-book-2-line" />
                      {note.course}
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-2">
                    {note.title}
                  </h3>
                  {note.content && (
                    <p className="text-sm text-foreground-600 leading-relaxed whitespace-pre-line mb-4">
                      {note.content}
                    </p>
                  )}

                  {(resources.length > 0 || files.length > 0) && (
                    <div className="border-t border-background-200 pt-4 space-y-3">
                      {resources.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-foreground-500 uppercase tracking-wide mb-2">
                            {t('notes.resources')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {resources.map((res, i) => (
                              <a
                                key={i}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 bg-background-50 border border-background-200 px-3 py-1.5 rounded-full transition-colors"
                              >
                                <i className="ri-link" />
                                {res.label || res.url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {files.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-foreground-500 uppercase tracking-wide mb-2">
                            {t('notes.files')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {files.map((f, i) => (
                              <a
                                key={i}
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-foreground-700 bg-background-50 border border-background-200 px-3 py-1.5 rounded-full hover:border-primary-300 transition-colors"
                              >
                                <i className="ri-file-download-line text-secondary-700" />
                                {f.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}