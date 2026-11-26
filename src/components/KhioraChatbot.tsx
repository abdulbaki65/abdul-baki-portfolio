import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  RotateCcw,
  Send,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isNotice?: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: "Hi! I'm KHIORA, Abdul Baki's AI assistant. Ask me anything about his Electrical Engineering skills, EIM LV-3 certification, or how to contact him!",
};

const QUICK_QUESTIONS: string[] = [
  "What are Abdul Baki's skills?",
  'Tell me about EIM LV-3 & House Wiring',
  'How can I contact Abdul Baki?',
];

const PREVIEW_UNAVAILABLE_REPLY =
  'KHIORA connects automatically to the live AI backend when deployed on Cloudflare Pages. In local or AI Studio preview, the /api/chat Pages Function is not active—once live on Cloudflare Pages with GEMINI_API_KEY set, I will answer in real time in both English and Bengali!';

export function KhioraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

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

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    // Build history excluding welcome & local notice banners
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome' && !m.isNotice)
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.text }));

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
          history: historyPayload,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      // In Vite / AI Studio preview, /api/chat either 404s or returns HTML
      if (response.status === 404 || response.status === 405 || !isJson) {
        setMessages((prev) => [
          ...prev,
          {
            id: `notice-${Date.now()}`,
            role: 'model',
            text: PREVIEW_UNAVAILABLE_REPLY,
            isNotice: true,
          },
        ]);
        return;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.reply) {
        const errorText =
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : 'Sorry, I could not reach the assistant right now. Please try again shortly.';

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: errorText,
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
          text: PREVIEW_UNAVAILABLE_REPLY,
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
    setMessages([WELCOME_MESSAGE]);
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
            className="fixed inset-x-3 bottom-20 flex max-h-[min(76vh,560px)] flex-col overflow-hidden rounded-2xl border border-[#00E5FF]/35 bg-[#070B14]/95 shadow-[0_24px_70px_-14px_rgba(0,0,0,0.88),0_0_32px_-12px_rgba(0,229,255,0.28)] backdrop-blur-xl sm:inset-x-auto sm:bottom-22 sm:right-6 sm:w-[396px]"
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
                    <span className="text-[11px] font-semibold tracking-wider text-[#FFB300]">
                      EE Assistant
                    </span>
                  </div>
                  <p className="font-bn truncate text-xs text-slate-400">
                    English & বাংলা • Abdul Baki Portfolio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading || messages.length === 1}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-400 transition-colors hover:border-[#00E5FF]/45 hover:text-[#00E5FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close KHIORA AI chat"
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
                          <Sparkles className="h-3 w-3 text-[#FFB300]" aria-hidden="true" />
                          <span className="font-display">KHIORA</span>
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start" role="status" aria-live="polite">
                  <div className="rounded-2xl rounded-bl-sm border border-[#00E5FF]/30 bg-[#0F172A]/90 px-4 py-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1" aria-hidden="true">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00E5FF] [animation-delay:-0.25s] motion-reduce:animate-none" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00E5FF] [animation-delay:-0.12s] motion-reduce:animate-none" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FFB300] motion-reduce:animate-none" />
                      </span>
                      <span>KHIORA is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3 Clickable Quick-Question Chips */}
              {showQuickQuestions && (
                <div className="pt-1">
                  <p className="mb-2 text-[11px] font-medium text-slate-400">
                    Quick questions
                  </p>
                  <div className="flex flex-col gap-2">
                    {QUICK_QUESTIONS.map((question) => (
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

            {/* Composer Form */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-800/90 bg-[#0F172A]/90 p-3"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="khiora-chat-input" className="sr-only">
                  Ask KHIORA a question in English or Bengali
                </label>
                <input
                  ref={inputRef}
                  id="khiora-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  maxLength={1500}
                  placeholder="Ask in English or বাংলা..."
                  className="font-bn min-h-[44px] flex-1 rounded-xl border border-slate-700/80 bg-[#070B14]/90 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
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
        aria-label={isOpen ? 'Close KHIORA AI assistant' : 'Open KHIORA AI assistant'}
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
