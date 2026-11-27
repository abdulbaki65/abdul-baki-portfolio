import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isNotice?: boolean;
}

type SpeechLang = 'en-US' | 'bn-BD';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike extends Event {
  readonly error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognitionLike, ev: SpeechRecognitionEventLike) => void)
    | null;
  onerror:
    | ((
        this: SpeechRecognitionLike,
        ev: SpeechRecognitionErrorEventLike
      ) => void)
    | null;
  onend: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

/**
 * Safely render basic **bold** emphasis and clean line breaks without raw HTML.
 */
function renderFormattedText(text: string, isUser: boolean) {
  const lines = text.split(/\r?\n/);

  return lines.map((rawLine, lineIdx) => {
    // Convert leading markdown bullet "* " or "- " into a clean bullet character
    const line = rawLine.replace(/^\s*[-*]\s+/, '• ');
    const segments = line.split(/(\*\*[^*]+\*\*)/g);

    return (
      <span key={lineIdx} className="block">
        {line.length === 0 ? (
          <span className="block h-2" aria-hidden="true" />
        ) : (
          segments.map((segment, segIdx) => {
            if (
              segment.startsWith('**') &&
              segment.endsWith('**') &&
              segment.length > 4
            ) {
              return (
                <strong
                  key={segIdx}
                  className={
                    isUser
                      ? 'font-bold text-[#070B14]'
                      : 'font-semibold text-white'
                  }
                >
                  {segment.slice(2, -2)}
                </strong>
              );
            }
            return <span key={segIdx}>{segment}</span>;
          })
        )}
      </span>
    );
  });
}

export function KhioraChatbot() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].khiora;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: t.welcome,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice Input (Web Speech API) state — automatically follows main navbar EN | বাং setting
  const recognitionLang: SpeechLang = lang === 'bn' ? 'bn-BD' : 'en-US';
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const isSpeechSupported = getSpeechRecognitionCtor() !== null;
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseInputBeforeSpeechRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync the welcome bubble text whenever the user switches EN <-> বাং
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === 'welcome' ? { ...msg, text: t.welcome } : msg
      )
    );
  }, [t.welcome]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Stop any active speech recognition cleanly when chat closes or unmounts
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors if already ended
      }
    }
  };

  useEffect(() => {
    if (!isOpen && recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore abort errors
      }
      recognitionRef.current = null;
      setIsListening(false);
      setInterimTranscript('');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      setVoiceNotice(t.micUnsupported);
      return;
    }

    if (isLoading) return;

    // Abort any lingering session before starting a fresh one
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    setVoiceNotice(null);
    setInterimTranscript('');
    baseInputBeforeSpeechRef.current = input.trim();

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = recognitionLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let finalText = '';
        let interimText = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? '';
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }

        const combined = `${finalText} ${interimText}`.trim();
        setInterimTranscript(interimText.trim());

        if (combined) {
          const prefix = baseInputBeforeSpeechRef.current;
          const nextValue = prefix ? `${prefix} ${combined}` : combined;
          setInput(nextValue.slice(0, 1500));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setIsListening(false);
        setInterimTranscript('');
        recognitionRef.current = null;

        if (event.error === 'aborted') {
          return;
        }
        if (
          event.error === 'not-allowed' ||
          event.error === 'service-not-allowed'
        ) {
          setVoiceNotice(t.micPermissionDenied);
        } else if (event.error === 'no-speech') {
          setVoiceNotice(t.micNoSpeech);
        } else {
          setVoiceNotice(t.micErrorGeneric);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        recognitionRef.current = null;
        inputRef.current?.focus();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice(t.micErrorGeneric);
    }
  };

  const handleMicButtonClick = () => {
    if (!isSpeechSupported) {
      setVoiceNotice(t.micUnsupported);
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    if (isListening) {
      stopListening();
    }
    setVoiceNotice(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    // Build strictly alternating user/model history from completed turns only
    const rawValidMessages = messages.filter(
      (m) => m.id !== 'welcome' && !m.isNotice && m.text.trim().length > 0
    );
    const historyPayload: Array<{ role: 'user' | 'model'; text: string }> = [];
    for (const msg of rawValidMessages) {
      const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';
      if (historyPayload.length === 0 && role !== 'user') continue;
      const prev = historyPayload[historyPayload.length - 1];
      if (prev && prev.role === role) continue;
      historyPayload.push({ role, text: msg.text.trim() });
    }
    if (
      historyPayload.length > 0 &&
      historyPayload[historyPayload.length - 1].role === 'user'
    ) {
      historyPayload.pop();
    }
    const trimmedHistory = historyPayload.slice(-8);

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: trimmedHistory,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      // In local Vite / AI Studio preview, /api/chat is not served as a Pages Function (returns HTML or non-JSON)
      if (!isJson) {
        setMessages((prev) => [
          ...prev,
          {
            id: `notice-${Date.now()}`,
            role: 'model',
            text: t.previewUnavailable,
            isNotice: true,
          },
        ]);
        return;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.reply) {
        const statusCode =
          typeof data?.status === 'number' ? data.status : response.status;
        const apiError =
          typeof data?.error === 'string' && data.error.trim()
            ? data.error.trim()
            : `Request failed with status ${statusCode}.`;

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: `Error (${statusCode}): ${apiError}`,
            isNotice: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: String(data.reply),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `offline-${Date.now()}`,
          role: 'model',
          text: t.previewUnavailable,
          isNotice: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    if (isLoading) return;
    if (isListening) stopListening();
    setVoiceNotice(null);
    setMessages([{ id: 'welcome', role: 'model', text: t.welcome }]);
    setInput('');
  };

  const showQuickQuestions = messages.length <= 2 && !isLoading;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Drawer / Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="KHIORA AI Assistant"
            className="fixed inset-x-3 bottom-20 flex max-h-[min(78vh,580px)] flex-col overflow-hidden rounded-2xl border border-[#00E5FF]/35 bg-[#070B14]/95 shadow-[0_24px_70px_-14px_rgba(0,0,0,0.88),0_0_32px_-12px_rgba(0,229,255,0.28)] backdrop-blur-xl sm:inset-x-auto sm:bottom-22 sm:right-6 sm:w-[404px]"
          >
            {/* Header with subtle PCB accent line */}
            <div className="relative flex items-center justify-between gap-3 border-b border-slate-800/90 bg-[#0F172A]/90 px-4 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/12 text-[#00E5FF]">
                  <Zap className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display truncate text-base font-bold tracking-tight text-slate-50">
                      KHIORA AI
                    </h2>
                    <span
                      className={`${isBn ? 'font-bn' : ''} text-[11px] font-semibold tracking-wider text-[#FFB300] whitespace-nowrap`}
                    >
                      {t.roleBadge}
                    </span>
                  </div>
                  <p className="font-bn truncate text-xs text-slate-400">
                    {t.headerSub}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading || messages.length === 1}
                  title={t.resetTitle}
                  aria-label={t.resetTitle}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-400 transition-colors hover:border-[#00E5FF]/45 hover:text-[#00E5FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={t.closeAria}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-300 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Subtle SVG circuit hairline beneath header */}
            <svg
              aria-hidden="true"
              className="h-2 w-full shrink-0 bg-[#070B14]"
              viewBox="0 0 400 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 4 H135 L145 1.5 H255 L265 4 H400"
                stroke="#00E5FF"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            </svg>

            {/* Message Feed */}
            <div className="font-bn flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        isUser
                          ? 'rounded-br-sm bg-[#00E5FF] font-medium text-[#070B14]'
                          : msg.isNotice
                            ? 'rounded-bl-sm border border-[#FFB300]/35 bg-[#FFB300]/10 text-amber-100'
                            : 'rounded-bl-sm border border-slate-700/70 bg-[#0F172A]/90 text-slate-100'
                      }`}
                    >
                      {!isUser && (
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#00E5FF]">
                          <Sparkles
                            className="h-3 w-3 text-[#FFB300]"
                            aria-hidden="true"
                          />
                          <span className="font-display">KHIORA</span>
                        </div>
                      )}
                      <div className="space-y-0.5">
                        {renderFormattedText(msg.text, isUser)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div
                  className="flex justify-start"
                  role="status"
                  aria-live="polite"
                >
                  <div className="rounded-2xl rounded-bl-sm border border-[#00E5FF]/30 bg-[#0F172A]/90 px-4 py-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1"
                        aria-hidden="true"
                      >
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00E5FF] [animation-delay:-0.25s] motion-reduce:animate-none" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00E5FF] [animation-delay:-0.12s] motion-reduce:animate-none" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FFB300] motion-reduce:animate-none" />
                      </span>
                      <span>{t.thinking}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3 Clickable Quick-Question Chips */}
              {showQuickQuestions && (
                <div className="pt-1">
                  <p className="mb-2 text-[11px] font-medium text-slate-400">
                    {t.quickLabel}
                  </p>
                  <div className="flex flex-col gap-2">
                    {t.quickQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-xl border border-slate-700/80 bg-[#0F172A]/75 px-3.5 py-2 text-left text-xs font-medium text-slate-200 transition-colors hover:border-[#00E5FF]/55 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                      >
                        <span>{question}</span>
                        <Zap
                          className="h-3.5 w-3.5 shrink-0 text-[#FFB300]"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Composer & Voice Controls */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-800/90 bg-[#0F172A]/90 p-3"
            >
              {/* Active Listening Banner */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    role="status"
                    aria-live="polite"
                    className="font-bn mb-2.5 flex items-center justify-between gap-2 rounded-xl border border-rose-500/45 bg-gradient-to-r from-rose-500/15 via-[#00E5FF]/10 to-[#0F172A] px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span
                          aria-hidden="true"
                          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75 motion-reduce:animate-none"
                        />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                      </span>
                      <span className="truncate font-semibold text-rose-200">
                        {t.micListening}
                      </span>
                      {interimTranscript && (
                        <span className="truncate text-slate-300">
                          “{interimTranscript}”
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={stopListening}
                      className="rounded-md border border-rose-400/40 bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-100 hover:bg-rose-500/35 whitespace-nowrap shrink-0"
                    >
                      {t.micStopLabel}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Polite Voice Notice (unsupported browser / permission denied) */}
              {voiceNotice && !isListening && (
                <div
                  role="alert"
                  className="font-bn mb-2.5 flex items-start justify-between gap-2 rounded-xl border border-[#FFB300]/35 bg-[#FFB300]/10 px-3 py-2 text-xs text-amber-100"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertCircle
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFB300]"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{voiceNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceNotice(null)}
                    aria-label="Dismiss voice notice"
                    className="rounded px-1 text-amber-200/80 hover:text-amber-50 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Input + Microphone + Send Row */}
              <div className="flex items-center gap-2">
                <label htmlFor="khiora-chat-input" className="sr-only">
                  {t.placeholder}
                </label>
                <input
                  ref={inputRef}
                  id="khiora-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  maxLength={1500}
                  placeholder={t.placeholder}
                  className="font-bn min-h-[44px] min-w-0 flex-1 rounded-xl border border-slate-700/80 bg-[#070B14]/90 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20 disabled:opacity-60"
                />

                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={handleMicButtonClick}
                  disabled={isLoading}
                  aria-pressed={isListening}
                  aria-label={isListening ? t.micStopAria : t.micStartAria}
                  title={
                    !isSpeechSupported
                      ? t.micUnsupported
                      : isListening
                        ? t.micStopAria
                        : t.micStartAria
                  }
                  className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-150 disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] ${
                    isListening
                      ? 'border-rose-400/75 bg-rose-500/20 text-rose-300 shadow-[0_0_20px_-4px_rgba(244,63,94,0.7),0_0_16px_-6px_rgba(0,229,255,0.6)]'
                      : !isSpeechSupported
                        ? 'border-slate-700/70 bg-slate-900/60 text-slate-500 hover:border-[#FFB300]/50 hover:text-[#FFB300]'
                        : 'border-slate-700/80 bg-[#070B14]/90 text-[#00E5FF] hover:border-[#00E5FF]/60 hover:bg-[#00E5FF]/12'
                  }`}
                >
                  {isListening && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-ping rounded-xl border border-[#00E5FF]/60 bg-rose-500/20 opacity-70 motion-reduce:animate-none"
                    />
                  )}
                  {isListening ? (
                    <Square
                      className="relative h-4 w-4 fill-current"
                      aria-hidden="true"
                    />
                  ) : !isSpeechSupported ? (
                    <MicOff className="relative h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Mic className="relative h-4 w-4" aria-hidden="true" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label={t.sendAria}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00E5FF] text-[#070B14] transition-transform duration-150 hover:bg-cyan-300 active:scale-95 disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Bottom-Right KHIORA AI Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? t.closeAria : t.openAria}
        className="group relative inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-[#00E5FF]/55 bg-[#0F172A]/92 px-4 py-2.5 text-slate-50 shadow-[0_10px_32px_-8px_rgba(0,229,255,0.45)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00E5FF] hover:shadow-[0_14px_38px_-6px_rgba(0,229,255,0.6)] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
      >
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E5FF]/15 text-[#00E5FF]">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-[#00E5FF]/35 [animation-duration:2.6s] motion-reduce:animate-none"
          />
          {isOpen ? (
            <X className="relative h-4 w-4" aria-hidden="true" />
          ) : (
            <Zap className="relative h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <span className="font-display text-sm font-bold tracking-wide text-slate-50">
          KHIORA <span className="text-[#00E5FF]">AI</span>
        </span>
      </button>
    </div>
  );
}
