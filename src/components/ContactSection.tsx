import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  SOCIAL_CHANNELS,
  type SocialChannel,
} from '../data/portfolioData';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = '4956672a-470e-4546-8ce4-7f4afe3dcecc';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function SocialIcon({ type }: { type: SocialChannel['type'] }) {
  const cls = 'h-5 w-5 text-[#00E5FF]';
  switch (type) {
    case 'whatsapp':
      return <MessageCircle className={cls} aria-hidden="true" />;
    case 'facebook':
      return <Share2 className={cls} aria-hidden="true" />;
    case 'instagram':
      return <Instagram className={cls} aria-hidden="true" />;
    case 'telegram':
      return <Send className={cls} aria-hidden="true" />;
  }
}

export function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const validate = (values: FormState): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    } else if (values.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!values.message.trim()) {
      nextErrors.message = 'Please write a short message.';
    } else if (values.message.trim().length < 10) {
      nextErrors.message = 'Message should be at least 10 characters.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError(null);
      return;
    }

    const senderName = form.name.trim();
    const senderEmail = form.email.trim();
    const senderMessage = form.message.trim();

    setErrors({});
    setSubmitError(null);
    setSubmittedName(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Portfolio Message from ${senderName}`,
          from_name: 'Abdul Baki Portfolio',
          name: senderName,
          email: senderEmail,
          message: senderMessage,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || 'Unable to send your message right now. Please try again.'
        );
      }

      setSubmittedName(senderName);
      setShowToast(true);
      setForm({ name: '', email: '', message: '' });

      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      toastTimerRef.current = window.setTimeout(() => {
        setShowToast(false);
      }, 5500);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Network error while sending message. Please try again or call directly.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#00E5FF]">
            Get In Touch
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Contact Abdul Baki
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Have a question about electrical installation, house wiring, or a
            project collaboration? Reach out directly or send a message below.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column: Connect Directly */}
          <div className="glass-card flex flex-col rounded-2xl p-6 sm:p-8 lg:col-span-5">
            <h3 className="font-display text-xl font-bold text-slate-50">
              Connect Directly
            </h3>
            <p className="mt-1.5 text-sm text-slate-400">
              Tap to call directly or connect via social messaging platforms.
            </p>

            {/* Primary Call Now Card */}
            <a
              href={PHONE_HREF}
              className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#00E5FF]/45 bg-[#00E5FF]/12 p-4 transition-all duration-150 hover:border-[#00E5FF] hover:bg-[#00E5FF]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00E5FF] text-[#070B14]">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-[#00E5FF]">
                    Call Now
                  </span>
                  <span className="font-display block text-lg font-bold tracking-wide text-slate-50 tabular-nums">
                    {PHONE_DISPLAY}
                  </span>
                </div>
              </div>
              <span className="rounded-lg bg-[#00E5FF] px-3 py-1.5 text-xs font-bold text-[#070B14] whitespace-nowrap shrink-0">
                Dial
              </span>
            </a>

            {/* Direct Social Links */}
            <div className="mt-5 flex flex-1 flex-col justify-between gap-3">
              {SOCIAL_CHANNELS.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-[#070B14]/60 px-4 py-3.5 transition-colors duration-150 hover:border-[#00E5FF]/45 hover:bg-slate-900/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/90 transition-colors group-hover:border-[#00E5FF]/35">
                      <SocialIcon type={channel.type} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-100">
                        {channel.platform}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {channel.displayPrimary}
                        {channel.displaySecondary &&
                          channel.id === 'whatsapp' && (
                            <>
                              {' '}
                              <span aria-hidden="true">•</span>{' '}
                              {channel.displaySecondary}
                            </>
                          )}
                      </span>
                    </div>
                  </div>
                  <ExternalLink
                    className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[#00E5FF]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Send a Message Form */}
          <div className="glass-card flex flex-col rounded-2xl p-6 sm:p-8 lg:col-span-7">
            <h3 className="font-display text-xl font-bold text-slate-50">
              Send a Message
            </h3>
            <p className="mt-1.5 text-sm text-slate-400">
              Fill out the form and I will get back to you as soon as possible.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 flex flex-1 flex-col gap-5"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    disabled={isSubmitting}
                    value={form.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Tariqul Islam"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`mt-2 block min-h-[46px] w-full rounded-xl border bg-[#070B14]/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.name
                        ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-500/25'
                        : 'border-slate-700/80 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-rose-400"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    value={form.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`mt-2 block min-h-[46px] w-full rounded-xl border bg-[#070B14]/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.email
                        ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-500/25'
                        : 'border-slate-700/80 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-rose-400"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-slate-200"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  disabled={isSubmitting}
                  value={form.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Write your message, project details, or inquiry here..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? 'message-error' : undefined
                  }
                  className={`mt-2 block min-h-[140px] w-full flex-1 resize-y rounded-xl border bg-[#070B14]/80 px-4 py-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.message
                      ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-500/25'
                      : 'border-slate-700/80 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20'
                  }`}
                />
                {errors.message && (
                  <p
                    id="message-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-rose-400"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-rose-400"
                    aria-hidden="true"
                  />
                  <span>{submitError}</span>
                </div>
              )}

              {submittedName && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>
                    Thank you, <strong>{submittedName}</strong>! Your message
                    has been sent to Abdul Baki&apos;s email. For an urgent
                    response, feel free to call{' '}
                    <a
                      href={PHONE_HREF}
                      className="font-semibold text-[#00E5FF] underline underline-offset-2"
                    >
                      {PHONE_DISPLAY}
                    </a>
                    .
                  </span>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-6 py-3 text-sm font-semibold text-[#070B14] shadow-[0_8px_24px_-6px_rgba(0,229,255,0.4)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-cyan-300 disabled:pointer-events-none disabled:opacity-75 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Friendly Submission Confirmation Toast */}
      <AnimatePresence>
        {showToast && submittedName && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-20 right-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-[#00E5FF]/40 bg-[#0F172A]/95 p-4 text-slate-100 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.8)] backdrop-blur-lg sm:bottom-22 sm:right-6"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[#00E5FF]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-50">
                Message Sent Successfully
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                Thanks {submittedName}, Abdul Baki will respond to your inquiry
                shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              aria-label="Dismiss notification"
              className="rounded-md px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
