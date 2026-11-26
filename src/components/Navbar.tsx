import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NAV_ITEMS, PHONE_HREF } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  activeSection: string;
}

export function Navbar({ activeSection }: NavbarProps) {
  const { lang, setLang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].nav;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? 'border-b border-slate-800/80 bg-[#070B14]/88 backdrop-blur-md'
          : 'border-b border-transparent bg-[#070B14]/55 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={handleLinkClick}
          className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold tracking-tight text-slate-50 transition-colors hover:text-[#00E5FF] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5FF]`}
        >
          {t.brand} <span aria-hidden="true">⚡</span>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className={`hidden items-center gap-5 lg:gap-7 md:flex ${isBn ? 'font-bn' : ''}`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const label = t.links[item.id] ?? item.label;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5FF] ${
                  isActive
                    ? 'text-[#00E5FF]'
                    : 'text-slate-300 hover:text-slate-50'
                }`}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[#00E5FF] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher (Desktop + Mobile), Call Now CTA (Desktop), Hamburger (Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sleek EN | বাং Pill Toggle */}
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-full border border-[#00E5FF]/35 bg-[#0F172A]/85 p-0.5 shadow-[0_0_20px_-8px_rgba(0,229,255,0.35)] backdrop-blur-md shrink-0"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`min-h-[32px] rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#00E5FF] ${
                lang === 'en'
                  ? 'bg-[#00E5FF] text-[#070B14] shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              EN
            </button>
            <span
              aria-hidden="true"
              className="px-0.5 text-[10px] text-slate-600 select-none"
            >
              |
            </span>
            <button
              type="button"
              onClick={() => setLang('bn')}
              aria-pressed={lang === 'bn'}
              className={`font-bn min-h-[32px] rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#00E5FF] ${
                lang === 'bn'
                  ? 'bg-[#00E5FF] text-[#070B14] shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              বাং
            </button>
          </div>

          <a
            href={PHONE_HREF}
            className={`${isBn ? 'font-bn' : ''} hidden items-center gap-2 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3.5 py-2 text-xs font-semibold text-[#00E5FF] transition-colors duration-150 hover:bg-[#00E5FF] hover:text-[#070B14] whitespace-nowrap shrink-0 md:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]`}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.callNow}</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-200 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className={`border-t border-slate-800/80 bg-[#070B14]/96 px-5 pb-5 pt-3 backdrop-blur-xl md:hidden ${isBn ? 'font-bn' : ''}`}
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const label = t.links[item.id] ?? item.label;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg px-3.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#00E5FF]/12 text-[#00E5FF]'
                      : 'text-slate-200 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span className="text-xs font-medium text-[#00E5FF]/80">
                      {t.active}
                    </span>
                  )}
                </a>
              );
            })}

            <div className="mt-3 border-t border-slate-800/80 pt-3">
              <a
                href={PHONE_HREF}
                onClick={handleLinkClick}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#00E5FF] px-4 py-2.5 text-sm font-semibold text-[#070B14] transition-opacity hover:opacity-90"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>{t.callWithNumber}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
