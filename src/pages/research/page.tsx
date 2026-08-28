import { useTranslation } from 'react-i18next';
import PageShell from '@/components/feature/PageShell';
import { useResearchProjects } from '@/hooks/useResearchProjects';
import { useProfile } from '@/hooks/useProfile';

export default function ResearchPage() {
  const { t, i18n } = useTranslation();
  const { projects, loading, error } = useResearchProjects();
  const { profile } = useProfile();
  const isEs = i18n.language.startsWith('es');

  return (
    <PageShell pageTitle={t('research.title')}>
      <div className="max-w-6xl">
        {profile?.research_interests && profile.research_interests.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-semibold text-foreground-950 mb-6 flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-500 rounded-full" />
              {t('research.interests_title')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.research_interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-secondary-100 text-secondary-900 rounded-full text-sm font-medium border border-secondary-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-heading text-2xl font-semibold text-foreground-950 mb-6 flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-500 rounded-full" />
            {t('research.projects')}
          </h2>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-background-200 rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group bg-background-100 rounded-lg border border-background-200 overflow-hidden hover:border-primary-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {project.image_url && (
                    <div className="w-full h-52 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-heading text-xl font-semibold text-foreground-950">
                        {project.title}
                      </h3>
                      {project.period && (
                        <span className="text-xs font-medium text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full whitespace-nowrap">
                          {project.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground-600 leading-relaxed mb-4">
                      {isEs
                        ? project.description_es || project.description_en
                        : project.description_en || project.description_es}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-accent-100 text-accent-900 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}