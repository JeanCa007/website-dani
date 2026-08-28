import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '@/components/feature/PageShell';
import { useProfile } from '@/hooks/useProfile';

const FORM_URL = 'https://readdy.ai/api/form/da8r3b4tvq5lvgtnaqog';

export default function ContactPage() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypot = formData.get('website_alt');
    if (honeypot && String(honeypot).trim() !== '') {
      setStatus('success');
      return;
    }
    formData.delete('website_alt');

    setStatus('sending');
    setErrorMessage('');

    try {
      const body = new URLSearchParams();
      formData.forEach((value, key) => {
        body.append(key, String(value));
      });

      const response = await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const responseText = await response.text();
      let parsed: { code?: string; meta?: { message?: string; detail?: string } } = {};
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = {};
      }

      const isSuccess = response.ok && parsed.code === 'OK';
      if (isSuccess) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMessage(
          parsed?.meta?.message || parsed?.meta?.detail || t('contact.form_error'),
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('contact.form_error'));
    }
  };

  return (
    <PageShell pageTitle={t('contact.title')}>
      <div className="max-w-6xl">
        <p className="text-foreground-600 max-w-2xl mb-10 leading-relaxed">
          {t('contact.subtitle')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-semibold text-foreground-950 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary-500 rounded-full" />
              {t('contact.info_title')}
            </h2>

            {profile?.email && (
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary-100 text-secondary-800 shrink-0">
                  <i className="ri-mail-line text-lg" />
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-500 uppercase tracking-wide mb-1">
                    {t('contact.email')}
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-foreground-800 hover:text-primary-600 transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile?.location && (
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100 text-accent-800 shrink-0">
                  <i className="ri-map-pin-line text-lg" />
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-500 uppercase tracking-wide mb-1">
                    {t('contact.location')}
                  </p>
                  <p className="text-sm text-foreground-800">{profile.location}</p>
                </div>
              </div>
            )}

            {profile?.institution && (
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 shrink-0">
                  <i className="ri-building-line text-lg" />
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-500 uppercase tracking-wide mb-1">
                    {t('admin.institution')}
                  </p>
                  <p className="text-sm text-foreground-800">{profile.institution}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              data-readdy-form
              className="bg-background-100 rounded-lg border border-background-200 p-6 md:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-foreground-700 mb-1.5">
                    {t('contact.form_name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    placeholder={t('contact.form_name_placeholder')}
                    className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-foreground-700 mb-1.5">
                    {t('contact.form_email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    placeholder={t('contact.form_email_placeholder')}
                    className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  {t('contact.form_subject')}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  placeholder={t('contact.form_subject_placeholder')}
                  className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  {t('contact.form_message')}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={500}
                  rows={6}
                  placeholder={t('contact.form_message_placeholder')}
                  className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors resize-y"
                />
              </div>

              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="hp-field"
              />

              {status === 'success' && (
                <p className="text-sm text-accent-700 bg-accent-100 border border-accent-200 rounded-md px-4 py-3">
                  {t('contact.form_success')}
                </p>
              )}

              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm disabled:opacity-60 whitespace-nowrap cursor-pointer"
              >
                {status === 'sending' ? t('contact.form_sending') : t('contact.form_send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}