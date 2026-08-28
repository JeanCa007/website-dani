import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(t('admin.login_error'));
      } else {
        onSuccess();
      }
    } catch {
      setError(t('admin.login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-100 rounded-lg border border-background-200 p-8">
          <h1 className="font-heading text-2xl font-semibold text-foreground-950 text-center mb-2">
            {t('admin.login_title')}
          </h1>
          <p className="text-sm text-foreground-500 text-center mb-8">
            Daniel Alvarez Ramirez
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-foreground-700 mb-1.5">
                {t('admin.login_email')}
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground-700 mb-1.5">
                {t('admin.login_password')}
              </label>
              <input
                id="admin-password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm disabled:opacity-60 whitespace-nowrap cursor-pointer"
            >
              {loading ? t('common.loading') : t('admin.login_button')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}