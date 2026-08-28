import { useTranslation } from 'react-i18next';
import PageShell from '@/components/feature/PageShell';
import { useTeachingCourses } from '@/hooks/useTeachingCourses';

export default function TeachingPage() {
  const { t, i18n } = useTranslation();
  const { courses, loading, error } = useTeachingCourses();
  const isEs = i18n.language.startsWith('es');

  return (
    <PageShell pageTitle={t('teaching.title')}>
      <div className="max-w-4xl">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-background-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {courses.map((course) => (
              <article
                key={course.id}
                className="bg-background-100 rounded-lg border border-background-200 p-6 hover:border-primary-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground-950">
                      {course.name}
                    </h3>
                    {course.code && (
                      <p className="text-sm font-medium text-primary-600 mt-0.5">{course.code}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.level && (
                      <span className="text-xs font-medium text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    )}
                    {course.semester && (
                      <span className="text-xs font-medium text-accent-900 bg-accent-100 px-3 py-1 rounded-full">
                        {course.semester}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-foreground-600 leading-relaxed">
                  {isEs
                    ? course.description_es || course.description_en
                    : course.description_en || course.description_es}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}