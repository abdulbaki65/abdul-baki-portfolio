import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CircuitBackground } from './components/CircuitBackground';
import { ContactSection } from './components/ContactSection';
import { DigitalCardModal } from './components/DigitalCardModal';
import { EEToolsSection } from './components/EEToolsSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { InspirationsSection } from './components/InspirationsSection';
import { KhioraChatbot } from './components/KhioraChatbot';
import { Navbar } from './components/Navbar';
import { SectionDivider } from './components/SectionDivider';
import { SkillsSection } from './components/SkillsSection';
import { LanguageProvider } from './context/LanguageContext';
import { NAV_ITEMS } from './data/portfolioData';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openDigitalCard = () => setIsCardOpen(true);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#070B14] text-slate-100">
        <CircuitBackground />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar activeSection={activeSection} />

          <main className="flex-1">
            <Hero onOpenDigitalCard={openDigitalCard} />
            <SectionDivider variant="sine" accent="cyan" />
            <AboutSection />
            <SectionDivider variant="circuit" accent="cyan" />
            <SkillsSection />
            <SectionDivider variant="sine" accent="cyan" />
            <EEToolsSection />
            <SectionDivider variant="sine" accent="amber" />
            <InspirationsSection />
            <SectionDivider variant="circuit" accent="cyan" />
            <ContactSection onOpenDigitalCard={openDigitalCard} />
          </main>

          <Footer />
        </div>

        <DigitalCardModal
          isOpen={isCardOpen}
          onClose={() => setIsCardOpen(false)}
        />
        <KhioraChatbot />
      </div>
    </LanguageProvider>
  );
}
