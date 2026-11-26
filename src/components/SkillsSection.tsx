import {
  Award,
  Code2,
  Compass,
  Home,
  Wrench,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS, type SkillItem } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';

function SkillIcon({
  name,
  featured,
}: {
  name: SkillItem['iconName'];
  featured?: boolean;
}) {
  const colorClass = featured ? 'text-[#FFB300]' : 'text-[#00E5FF]';
  const props = { className: `h-5 w-5 ${colorClass}`, 'aria-hidden': true as const };

  switch (name) {
    case 'award':
      return <Award {...props} />;
    case 'home':
      return <Home {...props} />;
    case 'zap':
      return <Zap {...props} />;
    case 'wrench':
      return <Wrench {...props} />;
    case 'code':
      return <Code2 {...props} />;
    case 'compass':
      return <Compass {...props} />;
  }
}

export function SkillsSection() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].skills;

  return (
    <section
      id="skills"
      className={`relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22 ${isBn ? 'font-bn' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#00E5FF]">
            {t.kicker}
          </p>
          <h2
            className={`${isBn ? 'font-bn leading-snug' : 'font-display'} mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl`}
            style={{ textWrap: 'balance' }}
          >
            {t.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Balanced 3-column desktop grid, 1-column mobile */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((skill) => {
            const isFeatured = Boolean(skill.featured);
            const localized = t.items[skill.id] ?? {
              title: skill.title,
              bnTitle: skill.bnTitle,
              subtitle: skill.subtitle,
              description: skill.description,
              badge: skill.badge,
            };

            return (
              <article
                key={skill.id}
                className={`flex h-full flex-col rounded-2xl p-6 ${
                  isFeatured
                    ? 'glass-card-amber'
                    : 'glass-card glass-card-hover'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      isFeatured
                        ? 'border-[#FFB300]/40 bg-[#FFB300]/12'
                        : 'border-[#00E5FF]/25 bg-[#00E5FF]/10'
                    }`}
                  >
                    <SkillIcon name={skill.iconName} featured={isFeatured} />
                  </div>

                  {localized.badge && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#FFB300]/45 bg-[#FFB300]/15 px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#FFB300] whitespace-nowrap">
                      {localized.badge}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h3
                    className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold leading-snug text-slate-50`}
                  >
                    {localized.title}
                    {localized.bnTitle && (
                      <span
                        className={`${isBn ? 'font-display text-sm' : 'font-bn'} ml-1.5 font-semibold text-[#00E5FF]/95`}
                      >
                        ({localized.bnTitle})
                      </span>
                    )}
                  </h3>
                  {localized.subtitle && (
                    <p className="mt-1 text-xs font-medium text-[#FFB300]/90">
                      {localized.subtitle}
                    </p>
                  )}
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                  {localized.description}
                </p>
              </article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
