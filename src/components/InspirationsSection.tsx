import { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { INSPIRATIONS, type InspirationItem } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';

function IslamicMotifHeader({ motif }: { motif: InspirationItem['motif'] }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-36 w-full items-center justify-center overflow-hidden border-b border-[#FFB300]/20 bg-gradient-to-br from-[#0F172A] via-[#131C31] to-[#090F1E]"
    >
      {/* Subtle geometric lattice pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        viewBox="0 0 360 150"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`geo-grid-${motif}`}
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M18 0 L36 18 L18 36 L0 18 Z"
              stroke="#FFB300"
              strokeWidth="0.7"
            />
          </pattern>
        </defs>
        <rect width="360" height="150" fill={`url(#geo-grid-${motif})`} />
      </svg>

      {/* Soft warm glow behind vector emblem */}
      <div
        className="absolute h-24 w-24 rounded-full opacity-25 blur-2xl"
        style={{
          background: 'radial-gradient(circle, #FFB300 0%, transparent 72%)',
        }}
      />

      {/* Handcrafted Amber Gold Vector Emblem */}
      {motif === 'octagram' && (
        <svg
          className="relative h-20 w-20 text-[#FFB300]"
          viewBox="0 0 96 96"
          fill="none"
        >
          {/* Rub el Hizb eight-pointed Islamic geometric star */}
          <rect
            x="22"
            y="22"
            width="52"
            height="52"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="22"
            y="22"
            width="52"
            height="52"
            rx="2"
            transform="rotate(45 48 48)"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="48"
            cy="48"
            r="15"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeOpacity="0.85"
          />
          {/* Subtle crescent & star core */}
          <path
            d="M52.5 41.5A7.5 7.5 0 1 0 52.5 54.5A5.8 5.8 0 1 1 52.5 41.5Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          <circle cx="53.5" cy="48" r="1.6" fill="currentColor" />
        </svg>
      )}

      {motif === 'manuscript' && (
        <svg
          className="relative h-20 w-20 text-[#FFB300]"
          viewBox="0 0 96 96"
          fill="none"
        >
          {/* Ornamental arch frame */}
          <path
            d="M20 74V40C20 26 32 16 48 12C64 16 76 26 76 40V74"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.4"
          />
          {/* Open historical manuscript / chronicle */}
          <path
            d="M48 34C42 29 33 28 24 31V66C33 63 42 64 48 69C54 64 63 63 72 66V31C63 28 54 29 48 34Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M48 34V69" stroke="currentColor" strokeWidth="1.5" />
          {/* Calligraphy lines */}
          <path
            d="M30 41H42M30 48H42M30 55H40M54 41H66M54 48H66M56 55H66"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <circle cx="48" cy="21" r="2.2" fill="currentColor" />
        </svg>
      )}

      {motif === 'maritime' && (
        <svg
          className="relative h-20 w-20 text-[#FFB300]"
          viewBox="0 0 96 96"
          fill="none"
        >
          {/* Pointed Islamic arch + stylized Red Sea waves + geometric compass */}
          <path
            d="M22 72V44C22 29 34 19 48 14C62 19 74 29 74 44V72"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M28 72V45C28 33 37 25 48 21C59 25 68 33 68 45V72"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          {/* Balanced geometric lamp / lantern motif above calm sea waves */}
          <path
            d="M48 27L54 36L48 45L42 36L48 27Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path
            d="M24 56C30 52 36 60 42 56C48 52 54 60 60 56C66 52 70 55 72 56"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M24 64C30 60 36 68 42 64C48 60 54 68 60 64C66 60 70 63 72 64"
            stroke="currentColor"
            strokeOpacity="0.65"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="72"
            x2="78"
            y2="72"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

export function InspirationsSection() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].inspirations;
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);

  useEffect(() => {
    if (!selectedItem) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedItem]);

  return (
    <section
      id="inspirations"
      className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={`max-w-3xl ${isBn ? 'font-bn' : ''}`}>
          <p className="text-xs font-semibold tracking-wider text-[#FFB300]">
            {t.kicker}
          </p>
          <h2
            className={`${isBn ? 'font-bn leading-snug' : 'font-display'} mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl`}
            style={{ textWrap: 'balance' }}
          >
            {t.headingMain}
            {t.headingAccent && (
              <>
                {' '}
                <span className="font-bn font-bold text-[#FFB300]">
                  {t.headingAccent}
                </span>
              </>
            )}
          </h2>
          <p className="font-bn mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Bengali Inspiration Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {INSPIRATIONS.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="glass-card glass-card-hover group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl transition-all hover:border-[#FFB300]/50"
            >
              <IslamicMotifHeader motif={item.motif} />

              <div className="font-bn flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold text-[#FFB300]">
                  {item.category}
                </span>

                <h3 className="mt-2 text-xl font-bold leading-snug text-slate-50 transition-colors group-hover:text-[#FFB300]">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-slate-300">
                  {item.summary}
                </p>

                <div className="mt-5 border-t border-slate-800/90 pt-4">
                  <p className="text-xs leading-relaxed text-slate-400">
                    {item.source}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="mt-4 inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-[#FFB300]/35 bg-[#FFB300]/10 px-4 py-2 text-sm font-semibold text-[#FFB300] transition-colors hover:bg-[#FFB300] hover:text-[#070B14] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB300]"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>বিস্তারিত পড়ুন</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.div>

      {/* Readable Bengali Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspiration-modal-title"
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060C]/80 p-4 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="font-bn relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#FFB300]/35 bg-[#0C1324] shadow-[0_24px_80px_-16px_rgba(0,0,0,0.85)]"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/90 bg-[#0F172A]/90 px-6 py-5">
                <div>
                  <span className="text-xs font-semibold text-[#FFB300]">
                    {selectedItem.category}
                  </span>
                  <h3
                    id="inspiration-modal-title"
                    className="mt-1 text-xl font-bold leading-snug text-slate-50 sm:text-2xl"
                  >
                    {selectedItem.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  aria-label="Close article modal"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-300 transition-colors hover:border-[#FFB300]/60 hover:text-[#FFB300] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB300]"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable Article Content */}
              <div className="overflow-y-auto px-6 py-6 sm:px-7">
                {/* Key Facts Grid */}
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-800/90 bg-[#070B14]/70 p-4 sm:grid-cols-2">
                  {selectedItem.facts.map((fact) => (
                    <div key={fact.label} className="space-y-0.5">
                      <dt className="text-xs font-semibold text-[#FFB300]">
                        {fact.label}
                      </dt>
                      <dd className="text-sm leading-relaxed text-slate-200">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </div>

                {/* Full Bengali Paragraphs */}
                <div className="mt-6 space-y-4 text-[16px] leading-[1.85] text-slate-200">
                  {selectedItem.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Dedicated Sub-Section (e.g., Farewell Sermon) */}
                {selectedItem.specialSection && (
                  <div className="mt-6 rounded-xl border border-[#FFB300]/30 bg-[#FFB300]/[0.06] p-5">
                    <h4 className="text-base font-bold leading-snug text-[#FFB300] sm:text-lg">
                      {selectedItem.specialSection.title}
                    </h4>
                    <p className="mt-2.5 text-[15px] leading-[1.8] text-slate-200">
                      {selectedItem.specialSection.intro}
                    </p>
                    <ul className="mt-3.5 space-y-2.5 text-[15px] leading-[1.75] text-slate-100">
                      {selectedItem.specialSection.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFB300]"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Takeaway Reflection */}
                <div className="mt-6 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/[0.05] p-4">
                  <p className="text-xs font-semibold text-[#00E5FF]">
                    মূল শিক্ষা
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-200">
                    {selectedItem.lesson}
                  </p>
                </div>
              </div>

              {/* Modal Footer with Source */}
              <div className="flex flex-col gap-3 border-t border-slate-800/90 bg-[#0F172A]/90 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-slate-400">
                  {selectedItem.source}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-[#FFB300]/50 hover:text-[#FFB300] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB300]"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
