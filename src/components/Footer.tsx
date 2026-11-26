import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';

export function Footer() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].footer;

  return (
    <footer
      className={`relative z-10 border-t border-slate-800/80 bg-[#070B14]/85 ${isBn ? 'font-bn' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
        <p className="text-sm text-slate-400">
          {t.copyright}{' '}
          <span className="mx-1.5 text-[#00E5FF]/70" aria-hidden="true">
            •
          </span>{' '}
          {t.location}
        </p>
        <a
          href="#home"
          className="text-xs font-medium text-slate-400 transition-colors hover:text-[#00E5FF] whitespace-nowrap"
        >
          {t.backToTop}
        </a>
      </div>
    </footer>
  );
}
