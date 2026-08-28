import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  full_name: string;
  photo_url: string | null;
  email: string | null;
  institution: string | null;
  position: string | null;
  location: string | null;
  social_links: Record<string, string> | null;
  bio_en: string | null;
  bio_es: string | null;
  research_interests: string[] | null;
  updated_at: string;
}

interface HeroSectionProps {
  profile: Profile | null;
  error: string | null;
}

export default function HeroSection({ profile, error }: HeroSectionProps) {
  const { t, i18n } = useTranslation();

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 transition-colors cursor-pointer"
          >
            {t('common.retry')}
          </button>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="shrink-0">
            <div className="w-48 h-48 md:w-80 md:h-80 rounded-full bg-background-200 animate-pulse" />
          </div>
          <div className="flex-1 w-full space-y-4 text-center md:text-left">
            <div className="h-10 bg-background-200 rounded w-3/4 mx-auto md:mx-0 animate-pulse" />
            <div className="h-6 bg-background-200 rounded w-1/2 mx-auto md:mx-0 animate-pulse" />
            <div className="h-32 bg-background-200 rounded mx-auto md:mx-0 animate-pulse" />
            <div className="h-10 bg-background-200 rounded w-40 mx-auto md:mx-0 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const bio = i18n.language.startsWith('es') ? (profile.bio_es || profile.bio_en) : (profile.bio_en || profile.bio_es);

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 3).toUpperCase()
    : 'DAR';

  return (
    <section className="py-16 md:py-24 px-4 bg-background-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 animate-fade-in-up">
          <div className="shrink-0">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.full_name}
                className="w-48 h-48 md:w-80 md:h-80 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-48 h-48 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="text-4xl md:text-6xl font-heading text-white tracking-wider">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground-950 mb-2">
              {profile.full_name}
            </h1>
            <p className="text-lg md:text-xl text-primary-600 font-medium mb-6">
              {profile.position}
            </p>
            {profile.institution && (
              <p className="text-sm text-foreground-500 mb-4">
                {profile.institution}
                {profile.location && ` · ${profile.location}`}
              </p>
            )}
            <div className="max-w-2xl mx-auto md:mx-0">
              <p className="text-foreground-700 leading-relaxed text-base md:text-lg">
                {bio}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
              {profile.social_links?.google_scholar && (
                <a
                  href={profile.social_links.google_scholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Google Scholar
                </a>
              )}
              {profile.social_links?.orcid && (
                <a
                  href={profile.social_links.orcid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  ORCID
                </a>
              )}
              {profile.social_links?.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {profile.social_links?.github && (
                <a
                  href={profile.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  GitHub
                </a>
              )}
              {profile.social_links?.twitter && (
                <a
                  href={profile.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm whitespace-nowrap"
              >
                {t('home.contact_me')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}