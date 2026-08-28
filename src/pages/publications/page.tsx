import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '@/components/feature/PageShell';
import { usePublications } from '@/hooks/usePublications';

export default function PublicationsPage() {
  const { t } = useTranslation();
  const { publications, loading, error } = usePublications(1000);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const years = useMemo(() => {
    const set = new Set<number>();
    publications.forEach((p) => {
      if (p.year) set.add(p.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [publications]);

  const filtered = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        search.trim() === '' ||
        (pub.title && pub.title.toLowerCase().includes(search.toLowerCase())) ||
        (pub.authors && pub.authors.toLowerCase().includes(search.toLowerCase())) ||
        (pub.venue && pub.venue.toLowerCase().includes(search.toLowerCase()));
      const matchesYear = yearFilter === 'all' || String(pub.year) === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [publications, search, yearFilter]);

  return (
    <PageShell pageTitle={t('publications.title')}>
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('publications.search')}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
            />
          </div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 cursor-pointer"
          >
            <option value="all">{t('publications.all_years')}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-foreground-500 mb-6">
          {t('publications.count', { count: filtered.length })}
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
          <p className="text-foreground-500 text-sm">{t('publications.empty')}</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((pub) => (
              <article
                key={pub.id}
                className="bg-background-100 rounded-lg border border-background-200 p-6 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 font-heading text-2xl font-semibold text-primary-500 leading-none pt-1">
                    {pub.year}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1">
                      {pub.title}
                    </h3>
                    {pub.authors && (
                      <p className="text-sm text-foreground-600 mb-1">{pub.authors}</p>
                    )}
                    <p className="text-sm text-secondary-700 mb-3">
                      {pub.venue}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          DOI: {pub.doi}
                        </a>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          Link ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}