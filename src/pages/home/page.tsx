import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import ResearchInterests from './components/ResearchInterests';
import RecentNotes from './components/RecentNotes';
import { useProfile } from '@/hooks/useProfile';
import { useNotesResources } from '@/hooks/useNotesResources';

export default function Home() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { notes, loading: notesLoading, error: notesError } = useNotesResources(3);

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection profile={profile} error={profileError} />
        <ResearchInterests profile={profile} />
        <RecentNotes
          notes={notes}
          loading={notesLoading}
          error={notesError}
        />
      </main>
      <Footer />
    </div>
  );
}