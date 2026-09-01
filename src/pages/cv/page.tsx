import { useTranslation } from 'react-i18next';
import PageShell from '@/components/feature/PageShell';
import { useCVEntries } from '@/hooks/useCVEntries';
import { useProfile } from '@/hooks/useProfile';
import type { CVEntry } from '@/hooks/useCVEntries';

function TimelineSection({
  title,
  items,
  loading,
  error,
}: {
  title: string;
  items: CVEntry[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-semibold text-foreground-950 mb-6">{title}</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-background-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-semibold text-foreground-950 mb-6">{title}</h2>
        <p className="text-red-500 text-sm">{error}</p>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14">
      <h2 className="font-heading text-2xl font-semibold text-foreground-950 mb-6 flex items-center gap-3">
        <span className="w-1 h-7 bg-primary-500 rounded-full" />
        {title}
      </h2>
      <div className="relative border-l-2 border-background-200 pl-8 space-y-8">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-[41px] top-1.5 w-3 h-3 rounded-full bg-accent-500 ring-4 ring-background-50" />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground-900">
                  {item.title}
                </h3>
                {item.organization && (
                  <p className="text-sm font-medium text-primary-600 mt-0.5">
                    {item.organization}
                  </p>
                )}
              </div>
              {item.period && (
                <span className="text-xs font-medium text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full whitespace-nowrap w-fit">
                  {item.period}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-foreground-600 mt-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CVPage() {
  const { t } = useTranslation();
  const { entries, loading, error } = useCVEntries();
  const { profile } = useProfile();

  const education = entries.filter((e) => e.type === 'education');
  const experience = entries.filter((e) => e.type === 'experience');
  const awards = entries.filter((e) => e.type === 'award');

  return (
    <PageShell pageTitle={t('nav.cv')}>
      <div className="max-w-3xl">
        {profile?.cv_pdf_url && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-foreground-600">
                {t('cv.pdf_available')}
              </p>
              <a
                href={profile.cv_pdf_url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer w-fit"
              >
                <i className="ri-download-2-line" />
                {t('cv.download')}
              </a>
            </div>
            <div className="rounded-lg border border-background-200 overflow-hidden">
              <iframe
                src={profile.cv_pdf_url}
                title={t('cv.download')}
                className="w-full h-[600px]"
              />
            </div>
          </div>
        )}
        <TimelineSection title={t('cv.education')} items={education} loading={loading} error={error} />
        <TimelineSection title={t('cv.experience')} items={experience} loading={loading} error={error} />
        <TimelineSection title={t('cv.awards')} items={awards} loading={loading} error={error} />
      </div>
    </PageShell>
  );
}