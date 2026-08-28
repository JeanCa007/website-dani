import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Publication {
  id: string;
  title: string;
  authors: string | null;
  venue: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
}

interface RecentPublicationsProps {
  publications: Publication[] | null;
  loading: boolean;
  error: string | null;
}

export default function RecentPublications({ publications, loading, error }: RecentPublicationsProps) {
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

  if (!publications || publications.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-background-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl font-semibold text-foreground-950 mb-8">
          {t('home.recent_publications')}
        </h2>
        <div className="space-y-6">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="p-6 bg-background-100 rounded-lg border border-background-200 hover:border-primary-300 transition-colors"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground-950 mb-2">
                {pub.title}
              </h3>
              {pub.authors && (
                <p className="text-sm text-foreground-600 mb-1">
                  {pub.authors}
                </p>
              )}
              <p className="text-sm text-secondary-700 mb-3">
                {pub.venue}
                {pub.venue && pub.year && ' · '}
                {pub.year}
              </p>
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
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/publications"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {t('home.view_all')} →
          </Link>
        </div>
      </div>
    </section>
  );
}