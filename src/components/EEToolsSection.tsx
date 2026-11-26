import { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Gauge,
  Info,
  Minus,
  Plus,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';

interface AppliancePreset {
  id: 'led' | 'fan' | 'tv' | 'fridge' | 'pump' | 'ac';
  watts: number;
  defaultQty: number;
}

const APPLIANCES: AppliancePreset[] = [
  { id: 'led', watts: 15, defaultQty: 4 },
  { id: 'fan', watts: 75, defaultQty: 2 },
  { id: 'tv', watts: 100, defaultQty: 1 },
  { id: 'fridge', watts: 180, defaultQty: 1 },
  { id: 'pump', watts: 750, defaultQty: 0 },
  { id: 'ac', watts: 1500, defaultQty: 0 },
];

function getDefaultQuantities(): Record<AppliancePreset['id'], number> {
  return {
    led: 4,
    fan: 2,
    tv: 1,
    fridge: 1,
    pump: 0,
    ac: 0,
  };
}

interface WireRecommendation {
  cable: string;
  mcb: string;
  highLoad: boolean;
}

function getWireAndBreakerSuggestion(currentAmps: number): WireRecommendation | null {
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

export function EEToolsSection() {
  const { lang, isBn } = useLanguage();
  const t = TRANSLATIONS[lang].eeTools;

  const [activeTab, setActiveTab] = useState<'load' | 'bill'>('load');

  // Tab 1: House Load & Wire Estimator state
  const [quantities, setQuantities] = useState<
    Record<AppliancePreset['id'], number>
  >(getDefaultQuantities);
  const [customWatts, setCustomWatts] = useState<string>('0');

  // Tab 2: Electricity Bill (kWh) Estimator state
  const [billWatts, setBillWatts] = useState<string>('500');
  const [dailyHours, setDailyHours] = useState<string>('8');
  const [ratePerUnit, setRatePerUnit] = useState<string>('8.5');

  const updateQty = (id: AppliancePreset['id'], delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(99, prev[id] + delta)),
    }));
  };

  const setQtyDirect = (id: AppliancePreset['id'], raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const safe = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(99, parsed));
    setQuantities((prev) => ({ ...prev, [id]: safe }));
  };

  const parsedCustomWatts = Math.max(
    0,
    Math.min(50000, Number.parseFloat(customWatts) || 0)
  );

  const applianceWatts = APPLIANCES.reduce(
    (sum, item) => sum + item.watts * quantities[item.id],
    0
  );
  const totalWatts = applianceWatts + parsedCustomWatts;
  const totalKw = totalWatts / 1000;
  // Single-phase 220V with power factor 0.85: I = P / (220 * 0.85)
  const estimatedAmps = totalWatts > 0 ? totalWatts / (220 * 0.85) : 0;
  const recommendation = getWireAndBreakerSuggestion(estimatedAmps);

  // Tab 2 calculations
  const safeBillWatts = Math.max(
    0,
    Math.min(100000, Number.parseFloat(billWatts) || 0)
  );
  const safeDailyHours = Math.max(
    0,
    Math.min(24, Number.parseFloat(dailyHours) || 0)
  );
  const safeRate = Math.max(
    0,
    Math.min(200, Number.parseFloat(ratePerUnit) || 0)
  );

  const dailyKwh = (safeBillWatts * safeDailyHours) / 1000;
  const monthlyKwh = dailyKwh * 30;
  const monthlyBill = monthlyKwh * safeRate;
  const dailyCost = dailyKwh * safeRate;

  const handleResetLoad = () => {
    setQuantities({ led: 0, fan: 0, tv: 0, fridge: 0, pump: 0, ac: 0 });
    setCustomWatts('0');
  };

  const handleResetBill = () => {
    setBillWatts('500');
    setDailyHours('8');
    setRatePerUnit('8.5');
  };

  const handleTransferToBill = () => {
    if (totalWatts > 0) {
      setBillWatts(String(Math.round(totalWatts)));
    }
    setActiveTab('bill');
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
              {/* Left: Appliance Inputs */}
              <div className="glass-card flex flex-col rounded-2xl p-5 sm:p-7 lg:col-span-7">
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold text-slate-50`}
                  >
                    {t.load.appliancesTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={handleResetLoad}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.load.reset}</span>
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {APPLIANCES.map((item) => {
                    const qty = quantities[item.id];
                    const subtotal = qty * item.watts;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
                          qty > 0
                            ? 'border-[#00E5FF]/35 bg-[#00E5FF]/[0.06]'
                            : 'border-slate-800/90 bg-[#070B14]/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-100">
                            {t.load.appliances[item.id]}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 tabular-nums">
                            {item.watts}W
                            {qty > 0 && (
                              <span className="ml-1.5 font-semibold text-[#00E5FF]">
                                = {subtotal}W
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            disabled={qty === 0}
                            aria-label={`Decrease ${t.load.appliances[item.id]}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] disabled:opacity-35"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>

                          <input
                            type="number"
                            min={0}
                            max={99}
                            inputMode="numeric"
                            aria-label={`${t.load.appliances[item.id]} quantity`}
                            value={qty}
                            onChange={(e) => setQtyDirect(item.id, e.target.value)}
                            className="h-9 w-12 rounded-lg border border-slate-700/80 bg-[#070B14] text-center font-display text-sm font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            aria-label={`Increase ${t.load.appliances[item.id]}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Watts Input */}
                <div className="mt-4 rounded-xl border border-slate-800/90 bg-[#070B14]/60 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
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
                    <div className="flex items-center gap-2 sm:w-40">
                      <input
                        id="ee-custom-watts"
                        type="number"
                        min={0}
                        max={50000}
                        step={50}
                        inputMode="numeric"
                        value={customWatts}
                        onChange={(e) => setCustomWatts(e.target.value)}
                        className="min-h-[42px] w-full rounded-lg border border-slate-700/80 bg-[#070B14] px-3 py-2 font-display text-sm font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20"
                      />
                      <span className="text-xs font-semibold text-slate-400 shrink-0">
                        W
                      </span>
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
                      <div className="mt-1.5 flex items-baseline gap-2.5">
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
                    onClick={handleTransferToBill}
                    disabled={totalWatts === 0}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/45 bg-[#00E5FF]/12 px-4 py-2.5 text-xs font-semibold text-[#00E5FF] transition-colors hover:bg-[#00E5FF] hover:text-[#070B14] disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                  >
                    <span>{t.load.sendToBill}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
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
            /* Tab 2: Electricity Bill (kWh) Estimator */
            <div
              role="tabpanel"
              className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
            >
              {/* Left: Bill Inputs */}
              <div className="glass-card flex flex-col justify-between rounded-2xl p-5 sm:p-7 lg:col-span-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`${isBn ? 'font-bn' : 'font-display'} text-lg font-bold text-slate-50`}
                    >
                      {t.bill.inputsTitle}
                    </h3>
                    <button
                      type="button"
                      onClick={handleResetBill}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.bill.reset}</span>
                    </button>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="bill-watts"
                        className="block text-sm font-medium text-slate-200"
                      >
                        {t.bill.totalLoadLabel}
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          id="bill-watts"
                          type="number"
                          min={0}
                          max={100000}
                          step={50}
                          inputMode="decimal"
                          value={billWatts}
                          onChange={(e) => setBillWatts(e.target.value)}
                          className="min-h-[46px] w-full rounded-xl border border-slate-700/80 bg-[#070B14]/85 px-4 py-2.5 font-display text-base font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20"
                        />
                        <span className="w-12 text-center text-xs font-semibold text-slate-400 shrink-0">
                          Watts
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bill-hours"
                        className="block text-sm font-medium text-slate-200"
                      >
                        {t.bill.dailyHoursLabel}
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          id="bill-hours"
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          inputMode="decimal"
                          value={dailyHours}
                          onChange={(e) => setDailyHours(e.target.value)}
                          className="min-h-[46px] w-full rounded-xl border border-slate-700/80 bg-[#070B14]/85 px-4 py-2.5 font-display text-base font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20"
                        />
                        <span className="w-12 text-center text-xs font-semibold text-slate-400 shrink-0">
                          hrs
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bill-rate"
                        className="block text-sm font-medium text-slate-200"
                      >
                        {t.bill.rateLabel}
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          id="bill-rate"
                          type="number"
                          min={0}
                          max={200}
                          step={0.25}
                          inputMode="decimal"
                          value={ratePerUnit}
                          onChange={(e) => setRatePerUnit(e.target.value)}
                          className="min-h-[46px] w-full rounded-xl border border-slate-700/80 bg-[#070B14]/85 px-4 py-2.5 font-display text-base font-bold text-slate-100 tabular-nums focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20"
                        />
                        <span className="w-12 text-center text-xs font-semibold text-slate-400 shrink-0">
                          BDT
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400">
                        {t.bill.rateHint}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Live Bill Summary */}
              <div className="glass-card flex flex-col justify-between rounded-2xl p-5 sm:p-7 lg:col-span-6">
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
