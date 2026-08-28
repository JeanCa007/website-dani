import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/useProfile';

export default function Footer() {
  const { t } = useTranslation();
  const { profile } = useProfile();

  return (
    <footer className="bg-background-100 border-t border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-lg text-foreground-950 mb-2">
              {profile?.full_name || 'Daniel Alvarez Ramirez'}
            </h3>
            <p className="text-sm text-foreground-600">
              {profile?.position || 'Associate Professor of Computer Science'}
            </p>
            {profile?.email && (
              <p className="text-sm text-foreground-500 mt-1">
                {profile.email}
              </p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground-800 mb-4">
              {t('footer.academic_links')}
            </h4>
            <ul className="space-y-2">
              {profile?.social_links?.google_scholar && (
                <li>
                  <a
                    href={profile.social_links.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-600 hover:text-primary-600 transition-colors"
                  >
                    Google Scholar
                  </a>
                </li>
              )}
              {profile?.social_links?.orcid && (
                <li>
                  <a
                    href={profile.social_links.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-600 hover:text-primary-600 transition-colors"
                  >
                    ORCID
                  </a>
                </li>
              )}
              {profile?.social_links?.linkedin && (
                <li>
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-600 hover:text-primary-600 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {profile?.social_links?.github && (
                <li>
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-600 hover:text-primary-600 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              )}
              {profile?.social_links?.twitter && (
                <li>
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-600 hover:text-primary-600 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs text-foreground-500">
              © {new Date().getFullYear()} {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}