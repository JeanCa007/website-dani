import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import ResearchInterests from './components/ResearchInterests';
import RecentPublications from './components/RecentPublications';
import { useProfile } from '@/hooks/useProfile';
import { usePublications } from '@/hooks/usePublications';

export default function Home() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { publications, loading: pubsLoading, error: pubsError } = usePublications(3);

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection profile={profile} error={profileError} />
        <ResearchInterests profile={profile} />
        <RecentPublications
          publications={publications}
          loading={pubsLoading}
          error={pubsError}
        />
      </main>
      <Footer />
    </div>
  );
}