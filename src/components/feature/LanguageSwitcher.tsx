import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm font-medium px-3 py-1 rounded-full border border-background-700 hover:border-primary-500 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer"
      aria-label="Toggle language"
    >
      {i18n.language.startsWith('es') ? 'ES' : 'EN'}
    </button>
  );
}