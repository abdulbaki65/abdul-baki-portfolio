import { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Clock,
  Gauge,
  Info,
  Minus,
  Plus,
  Receipt,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';

type ApplianceId = 'led' | 'fan' | 'tv' | 'fridge' | 'pump' | 'ac';
type PumpHpOption = '0.5' | '1' | '1.5' | '2';

interface AppliancePreset {
  id: ApplianceId;
  watts: number;
  defaultQty: number;
  defaultHours: number;
}

const PUMP_HP_OPTIONS: Array<{
  value: PumpHpOption;
  label: string;
  watts: number;
}> = [
  { value: '0.5', label: '0.5 HP (373W)', watts: 373 },
  { value: '1', label: '1 HP (746W)', watts: 746 },
  { value: '1.5', label: '1.5 HP (1119W)', watts: 1119 },
  { value: '2', label: '2 HP (1492W)', watts: 1492 },
];

const APPLIANCES: AppliancePreset[] = [
  { id: 'led', watts: 10, defaultQty: 4, defaultHours: 6 },
  { id: 'fan', watts: 75, defaultQty: 2, defaultHours: 10 },
  { id: 'tv', watts: 100, defaultQty: 1, defaultHours: 4 },
  { id: 'fridge', watts: 180, defaultQty: 1, defaultHours: 12 },
  { id: 'pump', watts: 746, defaultQty: 0, defaultHours: 0.5 },
  { id: 'ac', watts: 1500, defaultQty: 0, defaultHours: 6 },
];

function getDefaultQuantities(): Record<ApplianceId, number> {
  return {
    led: 4,
    fan: 2,
    tv: 1,
    fridge: 1,
    pump: 0,
    ac: 0,
  };
}

function getDefaultHours(): Record<ApplianceId, string> {
  return {
    led: '6',
    fan: '10',
    tv: '4',
    fridge: '12',
    pump: '0.5',
    ac: '6',
  };
}

interface WireRecommendation {
  cable: string;
  mcb: string;
  highLoad: boolean;
}

function getWireAndBreakerSuggestion(
  currentAmps: number
): WireRecommendation | null {
  if (currentAmps <= 0) return null;
  if (currentAmps <= 6) {
    return { cable: '1.5 rm', mcb: '10A MCB', highLoad: false };
  }
  if (currentAmps <= 12) {
    return { cable: '2.5 rm', mcb: '16A MCB', highLoad: false };
  }
  if (currentAmps <= 16) {
    return { cable: '2.5 rm', mcb: '20A MCB', highLoad: false };
  }
  if (currentAmps <= 25) {
    return { cable: '4.0 rm', mcb: '32A MCB', highLoad: false };
  }
  if (currentAmps <= 35) {
    return { cable: '6.0 rm', mcb: '40A MCB', highLoad: false };
  }
  return { cable: '10.0 rm+', mcb: '63A MCB', highLoad: true };
}

function parseHours(raw: string): number {
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num) || num < 0) return 0;
  return Math.min(24, num);
}

export function EEToolsSection() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].eeTools;

  const [activeTab, setActiveTab] = useState<'load' | 'bill'>('load');

  // Shared live appliance state (synchronizes both Load Estimator and Bill Estimator)
  const [quantities, setQuantities] = useState<Record<ApplianceId, number>>(
    getDefaultQuantities
  );
  const [hoursMap, setHoursMap] =
    useState<Record<ApplianceId, string>>(getDefaultHours);
  const [pumpHp, setPumpHp] = useState<PumpHpOption>('1');
  const [customWatts, setCustomWatts] = useState<string>('0');
  const [customHours, setCustomHours] = useState<string>('4');
  const [ratePerUnit, setRatePerUnit] = useState<string>('8.5');

  const selectedPumpWatts =
    PUMP_HP_OPTIONS.find((opt) => opt.value === pumpHp)?.watts ?? 746;

  const getApplianceWatts = (item: AppliancePreset): number =>
    item.id === 'pump' ? selectedPumpWatts : item.watts;

  const updateQty = (id: ApplianceId, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(99, prev[id] + delta)),
    }));
  };

  const setQtyDirect = (id: ApplianceId, raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const safe = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(99, parsed));
    setQuantities((prev) => ({ ...prev, [id]: safe }));
  };

  const updateHours = (id: ApplianceId, raw: string) => {
    setHoursMap((prev) => ({ ...prev, [id]: raw }));
  };

  const parsedCustomWatts = Math.max(
    0,
    Math.min(50000, Number.parseFloat(customWatts) || 0)
  );
  const parsedCustomHours = parseHours(customHours);
  const safeRate = Math.max(
    0,
    Math.min(200, Number.parseFloat(ratePerUnit) || 0)
  );

  // Per-appliance live calculations
  const applianceBreakdown = APPLIANCES.map((item) => {
    const watts = getApplianceWatts(item);
    const qty = quantities[item.id];
    const hours = parseHours(hoursMap[item.id]);
    const connectedWatts = watts * qty;
    const dailyKwh = (connectedWatts * hours) / 1000;
    return {
      id: item.id,
      watts,
      qty,
      hours,
      connectedWatts,
      dailyKwh,
    };
  });

  const applianceWattsSum = applianceBreakdown.reduce(
    (sum, row) => sum + row.connectedWatts,
    0
  );
  const totalWatts = applianceWattsSum + parsedCustomWatts;
  const totalKw = totalWatts / 1000;
  // Single-phase 220V with power factor 0.85: I = P / (220 * 0.85)
  const estimatedAmps = totalWatts > 0 ? totalWatts / (220 * 0.85) : 0;
  const recommendation = getWireAndBreakerSuggestion(estimatedAmps);

  // Automatic per-appliance kWh sum: sum((Watt * Qty * Hours/day) / 1000)
  const customDailyKwh = (parsedCustomWatts * parsedCustomHours) / 1000;
  const dailyKwh =
    applianceBreakdown.reduce((sum, row) => sum + row.dailyKwh, 0) +
    customDailyKwh;
  const monthlyKwh = dailyKwh * 30;
  const monthlyBill = monthlyKwh * safeRate;
  const dailyCost = dailyKwh * safeRate;

  const activeBillRows = applianceBreakdown.filter((row) => row.qty > 0);

  const handleResetLoad = () => {
    setQuantities({ led: 0, fan: 0, tv: 0, fridge: 0, pump: 0, ac: 0 });
    setHoursMap(getDefaultHours());
    setPumpHp('1');
    setCustomWatts('0');
    setCustomHours('4');
  };

  const handleResetDefaults = () => {
    setQuantities(getDefaultQuantities());
    setHoursMap(getDefaultHours());
    setPumpHp('1');
    setCustomWatts('0');
    setCustomHours('4');
    setRatePerUnit('8.5');
  };

  return (
    <section
      id="ee-tools"
      className={`relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22 ${isBn ? 'font-bn' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Section Heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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

          {/* Interactive 2-Tab Segmented Bar */}
          <div
            role="tablist"
            aria-label="Electrical calculator tools"
            className="grid w-full grid-cols-1 gap-1.5 rounded-xl border border-slate-800 bg-[#0F172A]/85 p-1.5 sm:inline-grid sm:w-auto sm:grid-cols-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'load'}
              onClick={() => setActiveTab('load')}
              className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] ${
                activeTab === 'load'
                  ? 'bg-[#00E5FF] text-[#070B14] shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-slate-50'
              }`}
            >
              <Calculator className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.tabLoad}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'bill'}
              onClick={() => setActiveTab('bill')}
              className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] ${
                activeTab === 'bill'
                  ? 'bg-[#00E5FF] text-[#070B14] shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-slate-50'
              }`}
            >
              <Receipt className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.tabBill}</span>
            </button>
          </div>
        </div>

        {/* Active Calculator Panel */}
        <div className="mt-8">
          {activeTab === 'load' ? (
            <div
              role="tabpanel"
              className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
            >
              {/* Left: Appliance Inputs with Qty, Water Pump HP Dropdown, and Individual Hours/day */}
              <div className="glass-card flex flex-col rounded-2xl p-4 sm:p-6 lg:col-span-7">
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold text-slate-50`}
                  >
                    {t.load.appliancesTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={handleResetLoad}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.load.reset}</span>
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {APPLIANCES.map((item) => {
                    const watts = getApplianceWatts(item);
                    const qty = quantities[item.id];
                    const subtotalWatts = qty * watts;
                    const itemHours = parseHours(hoursMap[item.id]);
                    const itemKwh = (subtotalWatts * itemHours) / 1000;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3.5 transition-colors ${
                          qty > 0
                            ? 'border-[#00E5FF]/35 bg-[#00E5FF]/[0.05]'
                            : 'border-slate-800/90 bg-[#070B14]/60'
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          {/* Appliance Name, Wattage & Water Pump HP Selector */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <p className="text-sm font-semibold text-slate-100">
                                {t.load.appliances[item.id]}
                              </p>
                              {item.id !== 'pump' && (
                                <span className="font-display text-xs font-medium text-slate-400 tabular-nums">
                                  {watts}W
                                </span>
                              )}
                            </div>

                            {item.id === 'pump' && (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <label
                                  htmlFor="ee-pump-hp"
                                  className="text-[11px] font-medium text-slate-400"
                                >
                                  {t.load.pumpHpLabel}:
                                </label>
                                <select
                                  id="ee-pump-hp"
                                  value={pumpHp}
                                  onChange={(e) =>
                                    setPumpHp(e.target.value as PumpHpOption)
                                  }
                                  className="min-h-[34px] rounded-lg border border-slate-700/90 bg-[#070B14] px-2.5 py-1 font-display text-xs font-semibold text-[#00E5FF] tabular-nums focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20"
                                >
                                  {PUMP_HP_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {qty > 0 && (
                              <p className="mt-1 text-xs text-slate-400 tabular-nums">
                                <span className="font-semibold text-[#00E5FF]">
                                  {subtotalWatts.toLocaleString()}W
                                </span>
                                <span className="mx-1.5 text-slate-600">·</span>
                                <span className="text-amber-200/90">
                                  {itemKwh.toFixed(2)} kWh/d
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Qty Stepper + Individual Hours/day Input */}
                          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end shrink-0">
                            {/* Qty */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-medium text-slate-400">
                                {t.load.qtyLabel}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateQty(item.id, -1)}
                                  disabled={qty === 0}
                                  aria-label={`Decrease ${t.load.appliances[item.id]}`}
                                  className="inline-flex h-9 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] disabled:opacity-35"
                                >
                                  <Minus
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </button>

                                <input
                                  type="number"
                                  min={0}
                                  max={99}
                                  inputMode="numeric"
                                  aria-label={`${t.load.appliances[item.id]} quantity`}
                                  value={qty}
                                  onChange={(e) =>
                                    setQtyDirect(item.id, e.target.value)
                                  }
                                  className="h-9 w-11 rounded-lg border border-slate-700/80 bg-[#070B14] text-center font-display text-sm font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none"
                                />

                                <button
                                  type="button"
                                  onClick={() => updateQty(item.id, 1)}
                                  aria-label={`Increase ${t.load.appliances[item.id]}`}
                                  className="inline-flex h-9 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                                >
                                  <Plus
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>

                            {/* Individual Daily Usage (Hours/day) */}
                            <div className="flex flex-col gap-1">
                              <label
                                htmlFor={`ee-hours-${item.id}`}
                                className="flex items-center gap-1 text-[10px] font-medium text-slate-400"
                              >
                                <Clock
                                  className="h-2.5 w-2.5 text-[#FFB300]"
                                  aria-hidden="true"
                                />
                                <span>{t.load.hoursLabel}</span>
                              </label>
                              <input
                                id={`ee-hours-${item.id}`}
                                type="number"
                                min={0}
                                max={24}
                                step={0.5}
                                inputMode="decimal"
                                value={hoursMap[item.id]}
                                onChange={(e) =>
                                  updateHours(item.id, e.target.value)
                                }
                                className="h-9 w-[72px] rounded-lg border border-slate-700/80 bg-[#070B14] px-2 text-center font-display text-sm font-bold text-amber-100 tabular-nums focus:border-[#FFB300] focus:outline-none focus:ring-2 focus:ring-[#FFB300]/20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Additional Load (Watts + Hours/day) */}
                <div className="mt-4 rounded-xl border border-slate-800/90 bg-[#070B14]/60 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <label
                        htmlFor="ee-custom-watts"
                        className="block text-sm font-semibold text-slate-100"
                      >
                        {t.load.customLoadLabel}
                      </label>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {t.load.customLoadHint}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 shrink-0">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-slate-400">
                          Watts (W)
                        </span>
                        <input
                          id="ee-custom-watts"
                          type="number"
                          min={0}
                          max={50000}
                          step={50}
                          inputMode="numeric"
                          value={customWatts}
                          onChange={(e) => setCustomWatts(e.target.value)}
                          className="h-9 w-24 rounded-lg border border-slate-700/80 bg-[#070B14] px-2.5 font-display text-sm font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="ee-custom-hours"
                          className="flex items-center gap-1 text-[10px] font-medium text-slate-400"
                        >
                          <Clock
                            className="h-2.5 w-2.5 text-[#FFB300]"
                            aria-hidden="true"
                          />
                          <span>{t.load.hoursLabel}</span>
                        </label>
                        <input
                          id="ee-custom-hours"
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          inputMode="decimal"
                          value={customHours}
                          onChange={(e) => setCustomHours(e.target.value)}
                          className="h-9 w-[72px] rounded-lg border border-slate-700/80 bg-[#070B14] px-2 text-center font-display text-sm font-bold text-amber-100 tabular-nums focus:border-[#FFB300] focus:outline-none focus:ring-2 focus:ring-[#FFB300]/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Live Results & Cable / MCB Reference */}
              <div className="glass-card flex flex-col justify-between rounded-2xl p-5 sm:p-7 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-5 w-5 text-[#00E5FF]" aria-hidden="true" />
                    <h3
                      className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold text-slate-50`}
                    >
                      {t.load.summaryTitle}
                    </h3>
                  </div>

                  {/* Primary Power & Current Metrics */}
                  <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-xl border border-[#00E5FF]/25 bg-[#070B14]/75 p-4">
                      <p className="text-xs font-medium text-slate-400">
                        {t.load.totalPower}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-baseline gap-2.5">
                        <span className="font-display text-3xl font-bold text-[#00E5FF] tabular-nums">
                          {totalWatts.toLocaleString()} W
                        </span>
                        <span className="font-display text-sm font-semibold text-slate-300 tabular-nums">
                          ({totalKw.toFixed(2)} kW)
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-[#070B14]/75 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-slate-400">
                          {t.load.estimatedCurrent}
                        </p>
                        <Gauge
                          className="h-4 w-4 text-[#FFB300] shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1.5 font-display text-3xl font-bold text-slate-50 tabular-nums">
                        {estimatedAmps.toFixed(2)}{' '}
                        <span className="text-lg font-semibold text-[#FFB300]">
                          A
                        </span>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {t.load.currentFormulaNote}
                      </p>
                    </div>
                  </div>

                  {/* General Reference Cable & MCB */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#FFB300]/30 bg-[#FFB300]/[0.07] p-3.5">
                      <p className="text-[11px] font-medium text-amber-200/85">
                        {t.load.cableLabel}
                      </p>
                      <p className="mt-1.5 font-display text-lg font-bold text-[#FFB300] tabular-nums">
                        {recommendation ? recommendation.cable : '—'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#FFB300]/30 bg-[#FFB300]/[0.07] p-3.5">
                      <p className="text-[11px] font-medium text-amber-200/85">
                        {t.load.mcbLabel}
                      </p>
                      <p className="mt-1.5 font-display text-lg font-bold text-[#FFB300] tabular-nums">
                        {recommendation ? recommendation.mcb : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Synced Daily Energy Preview */}
                  {totalWatts > 0 && (
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-[#070B14]/65 px-4 py-3 text-xs">
                      <span className="text-slate-400">
                        {t.load.dailyEnergyPreview}
                      </span>
                      <span className="font-display font-bold text-slate-100 tabular-nums">
                        {dailyKwh.toFixed(2)} kWh/d{' '}
                        <span className="text-[#FFB300]">
                          ({t.bill.currencySymbol}
                          {monthlyBill.toFixed(0)}/mo)
                        </span>
                      </span>
                    </div>
                  )}

                  {!recommendation && (
                    <p className="mt-3 text-xs text-slate-400">
                      {t.load.emptyPrompt}
                    </p>
                  )}

                  {recommendation?.highLoad && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#FFB300]/35 bg-[#FFB300]/10 px-3 py-2 text-xs text-amber-200">
                      <ShieldCheck
                        className="h-4 w-4 shrink-0 text-[#FFB300]"
                        aria-hidden="true"
                      />
                      <span>{t.load.phaseNote}</span>
                    </div>
                  )}
                </div>

                {/* Action + Disclaimer */}
                <div className="mt-5 space-y-3.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bill')}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/45 bg-[#00E5FF]/12 px-4 py-2.5 text-xs font-semibold text-[#00E5FF] transition-colors hover:bg-[#00E5FF] hover:text-[#070B14] sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                  >
                    <span>{t.load.sendToBill}</span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </button>

                  <div className="flex items-start gap-2 rounded-xl border border-slate-800/80 bg-[#070B14]/60 p-3 text-xs leading-relaxed text-slate-400">
                    <Info
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <p>{t.load.disclaimer}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Automatic Per-Appliance Electricity Bill (kWh) Estimator */
            <div
              role="tabpanel"
              className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
            >
              {/* Left: Unit Rate + Per-Appliance Auto kWh Breakdown */}
              <div className="glass-card flex flex-col justify-between rounded-2xl p-5 sm:p-7 lg:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3
                      className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold text-slate-50`}
                    >
                      {t.bill.inputsTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('load')}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1.5 text-xs font-semibold text-[#00E5FF] transition-colors hover:bg-[#00E5FF] hover:text-[#070B14] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                      >
                        <SlidersHorizontal
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        <span>{t.bill.editAppliancesBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.bill.reset}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rate per Unit Input */}
                  <div className="mt-5 rounded-xl border border-[#FFB300]/30 bg-[#070B14]/75 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <label
                          htmlFor="bill-rate"
                          className="block text-sm font-semibold text-slate-100"
                        >
                          {t.bill.rateLabel}
                        </label>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {t.bill.rateHint}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 sm:w-40">
                        <input
                          id="bill-rate"
                          type="number"
                          min={0}
                          max={200}
                          step={0.25}
                          inputMode="decimal"
                          value={ratePerUnit}
                          onChange={(e) => setRatePerUnit(e.target.value)}
                          className="min-h-[44px] w-full rounded-xl border border-slate-700/80 bg-[#0F172A] px-3.5 py-2 font-display text-base font-bold text-[#FFB300] tabular-nums focus:border-[#FFB300] focus:outline-none focus:ring-2 focus:ring-[#FFB300]/20"
                        />
                        <span className="text-xs font-semibold text-slate-400 shrink-0">
                          BDT
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Per-Appliance Energy Breakdown */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold tracking-wide text-slate-400">
                      {t.bill.breakdownTitle}
                    </p>

                    {activeBillRows.length === 0 && parsedCustomWatts === 0 ? (
                      <div className="mt-3 rounded-xl border border-slate-800/90 bg-[#070B14]/60 p-5 text-center text-sm text-slate-400">
                        {t.bill.emptyBreakdown}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2.5">
                        {activeBillRows.map((row) => (
                          <div
                            key={row.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-[#070B14]/65 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-100">
                                {t.load.appliances[row.id]}
                                {row.id === 'pump' && (
                                  <span className="ml-1.5 font-display text-xs font-medium text-[#00E5FF]">
                                    ({pumpHp} HP)
                                  </span>
                                )}
                              </p>
                              <p className="mt-0.5 font-display text-xs text-slate-400 tabular-nums">
                                {row.qty} × {row.watts}W × {row.hours}h
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5">
                                <label
                                  htmlFor={`bill-hrs-${row.id}`}
                                  className="sr-only"
                                >
                                  {t.load.appliances[row.id]}{' '}
                                  {t.load.hoursLabel}
                                </label>
                                <input
                                  id={`bill-hrs-${row.id}`}
                                  type="number"
                                  min={0}
                                  max={24}
                                  step={0.5}
                                  inputMode="decimal"
                                  value={hoursMap[row.id]}
                                  onChange={(e) =>
                                    updateHours(row.id, e.target.value)
                                  }
                                  className="h-8 w-16 rounded-lg border border-slate-700/80 bg-[#0F172A] px-2 text-center font-display text-xs font-bold text-amber-100 tabular-nums focus:border-[#FFB300] focus:outline-none"
                                />
                                <span className="text-[11px] text-slate-400">
                                  {t.load.hoursUnit}
                                </span>
                              </div>

                              <span className="min-w-[78px] text-right font-display text-sm font-bold text-[#00E5FF] tabular-nums">
                                {row.dailyKwh.toFixed(2)} kWh
                              </span>
                            </div>
                          </div>
                        ))}

                        {parsedCustomWatts > 0 && (
                          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-[#070B14]/65 px-4 py-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-100">
                                {t.bill.customRowLabel}
                              </p>
                              <p className="mt-0.5 font-display text-xs text-slate-400 tabular-nums">
                                {parsedCustomWatts.toLocaleString()}W ×{' '}
                                {parsedCustomHours}h
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={24}
                                  step={0.5}
                                  inputMode="decimal"
                                  aria-label="Custom load daily hours"
                                  value={customHours}
                                  onChange={(e) =>
                                    setCustomHours(e.target.value)
                                  }
                                  className="h-8 w-16 rounded-lg border border-slate-700/80 bg-[#0F172A] px-2 text-center font-display text-xs font-bold text-amber-100 tabular-nums focus:border-[#FFB300] focus:outline-none"
                                />
                                <span className="text-[11px] text-slate-400">
                                  {t.load.hoursUnit}
                                </span>
                              </div>

                              <span className="min-w-[78px] text-right font-display text-sm font-bold text-[#00E5FF] tabular-nums">
                                {customDailyKwh.toFixed(2)} kWh
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Live Bill Summary */}
              <div className="glass-card flex flex-col justify-between rounded-2xl p-5 sm:p-7 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Receipt
                      className="h-5 w-5 text-[#FFB300]"
                      aria-hidden="true"
                    />
                    <h3
                      className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold text-slate-50`}
                    >
                      {t.bill.summaryTitle}
                    </h3>
                  </div>

                  {/* Highlight Monthly Bill Card */}
                  <div className="mt-5 rounded-2xl border border-[#FFB300]/35 bg-[#FFB300]/[0.08] p-5">
                    <p className="text-xs font-semibold text-amber-200/90">
                      {t.bill.estimatedBill}
                    </p>
                    <p className="mt-2 font-display text-4xl font-bold tracking-tight text-[#FFB300] tabular-nums">
                      {t.bill.currencySymbol}{' '}
                      {monthlyBill.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      <span className="text-base font-semibold text-amber-100/90">
                        {t.bill.bdtLabel}
                      </span>
                    </p>
                    <p className="mt-1.5 text-xs text-amber-100/75 tabular-nums">
                      {t.bill.dailyCostLabel}: {t.bill.currencySymbol}
                      {dailyCost.toFixed(2)} {t.bill.bdtLabel}
                    </p>
                  </div>

                  {/* Daily & Monthly kWh */}
                  <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800/90 bg-[#070B14]/75 p-4">
                      <p className="text-xs font-medium text-slate-400">
                        {t.bill.dailyUnits}
                      </p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-[#00E5FF] tabular-nums">
                        {dailyKwh.toFixed(2)}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {t.bill.unitsSuffix}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-[#070B14]/75 p-4">
                      <p className="text-xs font-medium text-slate-400">
                        {t.bill.monthlyUnits}
                      </p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-slate-50 tabular-nums">
                        {monthlyKwh.toFixed(2)}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {t.bill.unitsSuffix}
                      </p>
                    </div>
                  </div>

                  {/* Total Connected Load Reference */}
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-slate-800/90 bg-[#070B14]/65 px-4 py-3 text-xs">
                    <span className="text-slate-400">
                      {t.bill.connectedLoadLabel}
                    </span>
                    <span className="font-display font-bold text-slate-100 tabular-nums">
                      {totalWatts.toLocaleString()} W ({totalKw.toFixed(2)} kW)
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-800/80 bg-[#070B14]/60 p-3 text-xs leading-relaxed text-slate-400">
                  <Info
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <p>{t.bill.note}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
