import { useEffect, useState } from 'react';
import {
  Award,
  Check,
  Copy,
  Download,
  Globe,
  GraduationCap,
  Phone,
  QrCode,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  PORTFOLIO_URL,
} from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';

interface DigitalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QR_CODE_URL =
  'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://abdulbaki-e1m.pages.dev';

function buildVCardContent(): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Baki;Abdul;;;',
    'FN:Abdul Baki',
    'ORG:Bogura Government Polytechnic Institute',
    'TITLE:Electrical Engineering Student | EIM LV-3 Certified',
    'TEL;TYPE=CELL,VOICE:+8801575586681',
    `URL:${PORTFOLIO_URL}`,
    'ADR;TYPE=HOME:;;Bogura;;;Bangladesh',
    'END:VCARD',
  ].join('\r\n');
}

export function DigitalCardModal({ isOpen, onClose }: DigitalCardModalProps) {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].digitalCard;

  const [qrFailed, setQrFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSaveVcf = () => {
    const vcard = buildVCardContent();
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Abdul_Baki_Contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PORTFOLIO_URL);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = PORTFOLIO_URL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for restricted clipboard environments
      const tempInput = document.createElement('input');
      tempInput.value = PORTFOLIO_URL;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-card-title"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060C]/82 p-4 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`${isBn ? 'font-bn' : ''} relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#00E5FF]/35 bg-[#0A1120]/96 shadow-[0_28px_84px_-16px_rgba(0,0,0,0.9),0_0_40px_-14px_rgba(0,229,255,0.28)]`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/90 bg-[#0F172A]/90 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#00E5FF]/35 bg-[#00E5FF]/12 text-[#00E5FF]">
                  <QrCode className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wider text-[#00E5FF]">
                    {t.modalKicker}
                  </p>
                  <h3
                    id="digital-card-title"
                    className={`${isBn ? 'font-bn' : 'font-display'} truncate text-base font-bold text-slate-50 sm:text-lg`}
                  >
                    {t.modalTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t.closeAria}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-300 transition-colors hover:border-[#00E5FF]/60 hover:text-[#00E5FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Subtle SVG PCB Accent Line */}
            <svg
              aria-hidden="true"
              className="h-2.5 w-full shrink-0 bg-[#0A1120]"
              viewBox="0 0 500 10"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 5 H165 L176 2 H324 L335 5 H500"
                stroke="#00E5FF"
                strokeOpacity="0.4"
                strokeWidth="1.2"
              />
              <circle cx="250" cy="2" r="2" fill="#FFB300" />
            </svg>

            {/* Card Body */}
            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {/* Top Identity Banner */}
              <div className="rounded-2xl border border-slate-800/90 bg-[#070B14]/75 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4
                      className={`${isBn ? 'font-bn' : 'font-display'} text-2xl font-bold tracking-tight text-slate-50`}
                    >
                      {t.name}{' '}
                      <Zap
                        className="inline h-5 w-5 text-[#00E5FF]"
                        aria-hidden="true"
                      />
                    </h4>
                    <p className="mt-1 text-xs font-semibold text-[#FFB300] sm:text-sm">
                      {t.title}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#FFB300]/40 bg-[#FFB300]/12 px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#FFB300] whitespace-nowrap">
                    <Award className="h-3 w-3" aria-hidden="true" />
                    <span>EIM LV-3</span>
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 border-t border-slate-800/80 pt-4 text-sm">
                  <div className="flex items-start gap-2.5 text-slate-300">
                    <GraduationCap
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]"
                      aria-hidden="true"
                    />
                    <span>{t.institute}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone
                      className="h-4 w-4 shrink-0 text-[#00E5FF]"
                      aria-hidden="true"
                    />
                    <a
                      href={PHONE_HREF}
                      className="font-display font-semibold text-slate-100 tabular-nums transition-colors hover:text-[#00E5FF]"
                    >
                      {PHONE_DISPLAY}
                    </a>
                    <span className="text-xs text-slate-500">
                      ({t.phoneLabel})
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Globe
                      className="h-4 w-4 shrink-0 text-[#00E5FF]"
                      aria-hidden="true"
                    />
                    <a
                      href={PORTFOLIO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate font-sans text-xs font-medium text-[#00E5FF] underline-offset-2 hover:underline sm:text-sm"
                    >
                      {PORTFOLIO_URL}
                    </a>
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-slate-800/90 bg-[#070B14]/60 p-5 text-center">
                <div className="rounded-2xl bg-white p-3.5 shadow-[0_10px_30px_-10px_rgba(0,229,255,0.3)]">
                  {!qrFailed ? (
                    <img
                      src={QR_CODE_URL}
                      alt={t.qrAlt}
                      width={184}
                      height={184}
                      referrerPolicy="no-referrer"
                      onError={() => setQrFailed(true)}
                      className="h-[184px] w-[184px] rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex h-[184px] w-[184px] flex-col items-center justify-center rounded-lg bg-slate-100 p-4 text-slate-800">
                      <QrCode className="h-12 w-12 text-slate-700" aria-hidden="true" />
                      <span className="mt-2 font-sans text-xs font-semibold break-all">
                        {t.qrFallback}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs font-medium text-slate-400">
                  {t.scanCaption}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSaveVcf}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-4 py-2.5 text-sm font-semibold text-[#070B14] shadow-[0_8px_24px_-8px_rgba(0,229,255,0.45)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-cyan-300 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>{t.savedVcf}</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" aria-hidden="true" />
                      <span>{t.saveVcf}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#FFB300]/45 bg-[#FFB300]/12 px-4 py-2.5 text-sm font-semibold text-[#FFB300] transition-colors duration-150 hover:bg-[#FFB300] hover:text-[#070B14] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB300]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>{t.copiedLink}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>{t.copyLink}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
