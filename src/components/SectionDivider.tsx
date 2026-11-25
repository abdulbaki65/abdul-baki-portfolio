interface SectionDividerProps {
  variant?: 'sine' | 'circuit';
  accent?: 'cyan' | 'amber';
}

export function SectionDivider({
  variant = 'sine',
  accent = 'cyan',
}: SectionDividerProps) {
  const strokeColor = accent === 'amber' ? '#FFB300' : '#00E5FF';

  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-6xl px-6 py-2 sm:px-8"
    >
      {variant === 'sine' ? (
        <svg
          className="h-8 w-full overflow-visible"
          viewBox="0 0 1200 32"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`sine-grad-${accent}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
              <stop offset="25%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="50%" stopColor={strokeColor} stopOpacity="0.7" />
              <stop offset="75%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Baseline reference axis */}
          <line
            x1="0"
            y1="16"
            x2="1200"
            y2="16"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1"
          />
          {/* Clean AC sine wave centered in divider */}
          <path
            d="M 0 16 H 420 C 440 16, 445 4, 465 4 C 485 4, 495 28, 515 28 C 535 28, 545 4, 565 4 C 585 4, 595 28, 615 28 C 635 28, 645 4, 665 4 C 685 4, 695 28, 715 28 C 735 28, 745 16, 765 16 H 1200"
            stroke={`url(#sine-grad-${accent})`}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="420" cy="16" r="2.5" fill={strokeColor} fillOpacity="0.55" />
          <circle cx="765" cy="16" r="2.5" fill={strokeColor} fillOpacity="0.55" />
        </svg>
      ) : (
        <svg
          className="h-8 w-full overflow-visible"
          viewBox="0 0 1200 32"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`circuit-grad-${accent}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
              <stop offset="20%" stopColor={strokeColor} stopOpacity="0.32" />
              <stop offset="50%" stopColor={strokeColor} stopOpacity="0.65" />
              <stop offset="80%" stopColor={strokeColor} stopOpacity="0.32" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 16 H 460 L 478 8 H 560 L 574 16 H 626 L 640 24 H 722 L 740 16 H 1200"
            stroke={`url(#circuit-grad-${accent})`}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="600"
            cy="16"
            r="4"
            fill="#070B14"
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <circle cx="478" cy="8" r="2" fill={strokeColor} fillOpacity="0.7" />
          <circle cx="722" cy="24" r="2" fill={strokeColor} fillOpacity="0.7" />
        </svg>
      )}
    </div>
  );
}
