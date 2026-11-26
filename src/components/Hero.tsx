import { useState } from 'react';
import { ArrowRight, Mail, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { PROFILE_IMAGE_URL } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';

export function Hero() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].hero;
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="home"
      className={`relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-18 lg:pt-24 ${isBn ? 'font-bn' : ''}`}
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Typographic Hierarchy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 flex flex-col items-center text-center lg:order-1 lg:col-span-7 lg:items-start lg:text-left"
        >
          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#00E5FF]/35 bg-[#0F172A]/85 px-4 py-1.5 shadow-[0_0_24px_-6px_rgba(0,229,255,0.3)]">
            <Zap
              className="h-3.5 w-3.5 shrink-0 text-[#FFB300]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-wider text-slate-100">
              {t.statusPrefix} <span className="mx-1 text-[#00E5FF]">•</span>{' '}
              <span className="text-[#FFB300]">{t.statusCert}</span>
            </span>
          </div>

          <h1
            className={`${isBn ? 'font-bn leading-[1.2]' : 'font-display leading-[1.1]'} text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-[3.5rem]`}
            style={{ textWrap: 'balance' }}
          >
            {t.greeting}{' '}
            <span className="bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-[#00E5FF] bg-clip-text text-transparent">
              {t.name}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {t.role}{' '}
            <span className="mx-1.5 text-[#00E5FF]" aria-hidden="true">
              •
            </span>{' '}
            {t.institute}
          </p>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-[15px]">
            {t.lead}
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex w-full flex-col items-center gap-3.5 sm:w-auto sm:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#00E5FF] px-7 py-3 text-sm font-semibold text-[#070B14] shadow-[0_8px_28px_-6px_rgba(0,229,255,0.45)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-cyan-300 whitespace-nowrap shrink-0 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{t.ctaContact}</span>
            </a>

            <a
              href="#skills"
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-slate-700/90 bg-[#0F172A]/80 px-7 py-3 text-sm font-semibold text-slate-100 transition-colors duration-150 hover:border-[#00E5FF]/55 hover:text-[#00E5FF] whitespace-nowrap shrink-0 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
            >
              <span>{t.ctaSkills}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        {/* Right Column: Prominent Portrait in Electric Cyan Circuit-Ring Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end"
        >
          <div className="relative flex h-72 w-72 items-center justify-center sm:h-88 sm:w-88 lg:h-[360px] lg:w-[360px]">
            {/* Ambient Electric Cyan halo behind portrait */}
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full opacity-35 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(0,229,255,0.45) 0%, rgba(255,179,0,0.12) 60%, transparent 80%)',
              }}
            />

            {/* Precision Rotating Circuit-Ring SVG */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              className="animate-slow-spin absolute inset-0 h-full w-full"
            >
              <circle
                cx="200"
                cy="200"
                r="192"
                fill="none"
                stroke="#00E5FF"
                strokeOpacity="0.28"
                strokeWidth="1.25"
                strokeDasharray="48 16 12 16"
              />
              <circle
                cx="200"
                cy="200"
                r="178"
                fill="none"
                stroke="#00E5FF"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray="110 24 40 24"
              />
              <circle
                cx="200"
                cy="200"
                r="185"
                fill="none"
                stroke="#FFB300"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeDasharray="24 270"
                strokeLinecap="round"
              />
              <circle cx="200" cy="8" r="4" fill="#070B14" stroke="#00E5FF" strokeWidth="2" />
              <circle cx="392" cy="200" r="4" fill="#070B14" stroke="#FFB300" strokeWidth="2" />
              <circle cx="200" cy="392" r="4" fill="#070B14" stroke="#00E5FF" strokeWidth="2" />
              <circle cx="8" cy="200" r="4" fill="#070B14" stroke="#00E5FF" strokeWidth="2" />
            </svg>

            {/* Static inner crisp glowing ring + portrait container */}
            <div className="relative h-[82%] w-[82%] overflow-hidden rounded-full border-2 border-[#00E5FF]/65 bg-slate-900 shadow-[0_0_40px_-8px_rgba(0,229,255,0.4)]">
              {!imgError ? (
                <img
                  src={PROFILE_IMAGE_URL}
                  alt={t.portraitAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full scale-[1.28] object-cover object-[50%_58%]"
                  style={{ transformOrigin: '50% 42%' }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#0C192C] to-slate-950 p-6 text-center">
                  <Zap className="mb-2 h-10 w-10 text-[#00E5FF]" aria-hidden="true" />
                  <span className="font-display text-2xl font-bold text-slate-100">
                    AB
                  </span>
                  <span className="mt-1 text-xs text-slate-400">Abdul Baki</span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-[#070B14]/40 via-transparent to-transparent"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
