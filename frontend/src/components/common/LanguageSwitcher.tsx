import { useLanguage } from '../../hooks/useLanguage';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
      <button
        onClick={() => setLanguage('id')}
        className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
          language === 'id'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
