import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoginForm from './components/LoginForm';
import ProfileEditor from './components/ProfileEditor';
import NotesResourcesManager from './components/NotesResourcesManager';
import CVManager from './components/CVManager';
import ResearchManager from './components/ResearchManager';
import TeachingManager from './components/TeachingManager';

type Tab = 'profile' | 'notes' | 'cv' | 'research' | 'teaching';

export default function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [session, setSession] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(!!data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) setSession(!!currentSession);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(false);
    navigate('/');
  };

  if (session === null) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm onSuccess={() => setSession(true)} />;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: t('admin.tab_profile') },
    { key: 'notes', label: t('admin.tab_notes') },
    { key: 'cv', label: t('admin.tab_cv') },
    { key: 'research', label: t('admin.tab_research') },
    { key: 'teaching', label: t('admin.tab_teaching') },
  ];

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-foreground-950 text-background-50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <h1 className="font-heading text-xl tracking-tight">
            {t('admin.title')}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-background-700 hover:border-primary-500 hover:text-primary-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('admin.logout')}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-background-100 text-foreground-700 hover:bg-background-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && <ProfileEditor />}
        {activeTab === 'notes' && <NotesResourcesManager />}
        {activeTab === 'cv' && <CVManager />}
        {activeTab === 'research' && <ResearchManager />}
        {activeTab === 'teaching' && <TeachingManager />}
      </div>
    </div>
  );
}