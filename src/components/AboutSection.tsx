import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { ABOUT_HIGHLIGHTS } from '../data/portfolioData';

export function AboutSection() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ee-student':
        return <GraduationCap className="h-5 w-5 text-[#00E5FF]" aria-hidden="true" />;
      case 'eim-lv3':
        return <Award className="h-5 w-5 text-[#FFB300]" aria-hidden="true" />;
      default:
        return <BookOpen className="h-5 w-5 text-[#00E5FF]" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="about"
      className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#00E5FF]">
            About Me
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Engineering discipline meets practical craftsmanship
          </h2>
        </div>

        {/* Clean 2-paragraph bio */}
        <div className="glass-card mt-8 rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-6 text-[15px] leading-[1.75] text-slate-300 lg:grid-cols-2 lg:gap-10 sm:text-base">
            <p>
              I am <strong className="font-semibold text-slate-100">Abdul Baki</strong>, an Electrical
              Engineering student at{' '}
              <span className="font-medium text-slate-100">
                Bogura Government Polytechnic Institute
              </span>{' '}
              <span className="font-bn text-slate-200">
                (বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট)
              </span>
              . My engineering journey is driven by hands-on curiosity—understanding how electrical
              power moves safely from distribution boards to everyday spaces, and applying certified
              installation standards to real-world systems.
            </p>
            <p>
              Alongside practical house wiring, circuit diagnostics, and systematic troubleshooting,
              I enjoy building clean, responsive websites and studying how modern digital technology
              connects with electrical hardware. Outside the workshop, I find lasting inspiration in
              Islamic history and timeless lessons of integrity, patience, and purposeful learning.
            </p>
          </div>
        </div>

        {/* 3 balanced highlight cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ABOUT_HIGHLIGHTS.map((item) => {
            const isAmber = item.accent === 'amber';
            return (
              <div
                key={item.id}
                className={`rounded-2xl p-6 ${
                  isAmber
                    ? 'glass-card-amber'
                    : 'glass-card glass-card-hover'
                }`}
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isAmber
                      ? 'border-[#FFB300]/30 bg-[#FFB300]/10'
                      : 'border-[#00E5FF]/25 bg-[#00E5FF]/10'
                  }`}
                >
                  {getIcon(item.id)}
                </div>
                <h3
                  className={`mt-4 font-display text-xl font-bold tracking-tight ${
                    isAmber ? 'text-[#FFB300]' : 'text-slate-50'
                  }`}
                >
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
