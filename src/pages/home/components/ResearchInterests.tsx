import { useTranslation } from 'react-i18next';

interface Profile {
  research_interests: string[] | null;
}

interface ResearchInterestsProps {
  profile: Profile | null;
}

export default function ResearchInterests({ profile }: ResearchInterestsProps) {
  const { t } = useTranslation();

  if (!profile?.research_interests || profile.research_interests.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-background-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl font-semibold text-foreground-950 mb-8">
          {t('home.research_interests')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {profile.research_interests.map((interest, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-secondary-100 text-secondary-900 rounded-full text-sm font-medium border border-secondary-200 hover:bg-secondary-200 transition-colors"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}