export function CircuitBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070B14]"
    >
      {/* Blueprint micro + macro grid */}
      <div className="blueprint-grid absolute inset-0 opacity-90" />

      {/* Subtle ambient power-grid luminance fields */}
      <div
        className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-[0.09] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[52%] -left-48 h-[460px] w-[460px] rounded-full opacity-[0.06] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #FFB300 0%, transparent 70%)',
        }}
      />

      {/* Low-opacity PCB circuit trace schematic overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 960"
      >
        <g
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Upper left PCB bus */}
          <path d="M 0 140 H 180 L 230 190 H 380" />
          <path d="M 0 164 H 158 L 214 220 H 310" />
          <circle cx="384" cy="190" r="3.5" fill="#070B14" />
          <circle cx="314" cy="220" r="3.5" fill="#070B14" />

          {/* Upper right transformer trace */}
          <path d="M 1440 120 H 1220 L 1168 172 H 1040" />
          <path d="M 1440 148 H 1244 L 1184 208 H 1098" />
          <circle cx="1036" cy="172" r="3.5" fill="#070B14" />
          <circle cx="1094" cy="208" r="3.5" fill="#070B14" />

          {/* Mid-right vertical power line */}
          <path d="M 1340 310 V 520 L 1280 580 V 740" />
          <circle cx="1340" cy="306" r="3.5" fill="#070B14" />
          <circle cx="1280" cy="744" r="3.5" fill="#070B14" />

          {/* Lower left schematic traces */}
          <path d="M 80 620 V 760 L 145 825 H 340" />
          <path d="M 110 660 V 748 L 164 802 H 280" />
          <circle cx="80" cy="616" r="3.5" fill="#070B14" />
          <circle cx="344" cy="825" r="3.5" fill="#070B14" />
          <circle cx="284" cy="802" r="3.5" fill="#070B14" />
        </g>

        <g
          fill="none"
          stroke="#FFB300"
          strokeWidth="1"
          strokeOpacity="0.65"
          strokeLinecap="round"
        >
          <path d="M 960 840 H 1140 L 1190 790 H 1440" />
          <circle cx="956" cy="840" r="3.5" fill="#070B14" />
          <path d="M 480 88 H 620 L 656 124 H 740" />
          <circle cx="476" cy="88" r="3" fill="#070B14" />
          <circle cx="744" cy="124" r="3" fill="#070B14" />
        </g>
      </svg>
    </div>
  );
}
