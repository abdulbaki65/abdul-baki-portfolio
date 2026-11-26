import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ABOUT_HIGHLIGHTS } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';

export function AboutSection() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].about;

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
      className={`relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22 ${isBn ? 'font-bn' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
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
        </div>

        {/* Clean 2-paragraph bio */}
        <div className="glass-card mt-8 rounded-2xl p-6 sm:p-8 lg:p-10">
          {isBn ? (
            <div className="font-bn grid grid-cols-1 gap-6 text-[15.5px] leading-[1.85] text-slate-300 lg:grid-cols-2 lg:gap-10 sm:text-base">
              <p>
                আমি <strong className="font-semibold text-slate-100">আব্দুল বাকি</strong>,{' '}
                <span className="font-medium text-slate-100">
                  বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট
                </span>
                -এর একজন ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং স্টুডেন্ট। বাস্তব ইলেকট্রিক্যাল সিস্টেম
                বোঝার গভীর আগ্রহ থেকেই আমার ইঞ্জিনিয়ারিং পথচলা—ডিস্ট্রিবিউশন বোর্ড থেকে দৈনন্দিন
                ব্যবহার্য সংযোগ পর্যন্ত কীভাবে বিদ্যুৎ নিরাপদে প্রবাহিত হয় এবং সার্টিফায়েড মানদণ্ড
                অনুসরণ করে কীভাবে নির্ভরযোগ্য সিস্টেম গড়ে তোলা যায়, তা নিয়ে কাজ করতে ভালোবাসি।
              </p>
              <p>
                বাস্তব হাউজ ওয়্যারিং, সার্কিট ডায়াগনস্টিকস ও সুশৃঙ্খল ট্রাবলশুটিংয়ের পাশাপাশি আমি
                আধুনিক ও রেসপন্সিভ ওয়েবসাইট তৈরি করতে এবং হার্ডওয়্যারের সাথে নতুন ডিজিটাল
                প্রযুক্তির সংযোগ জানতে আগ্রহী। কর্মশালার বাইরে ইসলামিক ইতিহাস এবং সততা, ধৈর্য ও
                অর্থবহ শিক্ষার চিরন্তন আদর্শ আমাকে সবসময় অনুপ্রাণিত করে।
              </p>
            </div>
          ) : (
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
          )}
        </div>

        {/* 3 balanced highlight cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ABOUT_HIGHLIGHTS.map((item) => {
            const isAmber = item.accent === 'amber';
            const localized = t.highlights[item.id] ?? {
              title: item.title,
              subtitle: item.subtitle,
            };
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
                  className={`${isBn ? 'font-bn' : 'font-display'} mt-4 text-xl font-bold tracking-tight ${
                    isAmber ? 'text-[#FFB300]' : 'text-slate-50'
                  }`}
                >
                  {localized.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {localized.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
