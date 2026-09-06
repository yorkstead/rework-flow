'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  WifiOff, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  Flame,
  ArrowRight,
  Sliders,
  Scale,
  Sparkles,
  HardDrive,
  Monitor,
  Tablet,
  Printer,
  ShoppingCart,
  Check
} from 'lucide-react';

interface ToastComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToastComparisonModal: React.FC<ToastComparisonModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'financial' | 'hardware'>('financial');

  // Configurable sliders based on 240 Union's volume
  const [monthlyVolume, setMonthlyVolume] = useState<number>(240000); // $240k/mo
  const [terminalCount, setTerminalCount] = useState<number>(7); // 7 active terminals
  const [toastRate, setToastRate] = useState<number>(2.79); // Toast 2.79% + 15c
  const [unionRate, setUnionRate] = useState<number>(2.15); // Direct interchange + markup 2.15%

  // Toast Hidden Add-ons
  const [hasToastTables, setHasToastTables] = useState(true); // $199/mo
  const [hasToastOnline, setHasToastOnline] = useState(true); // $149/mo
  const [hasToastHandhelds, setHasToastHandhelds] = useState(true); // $50/device/mo ($200)
  const [hasToastCellBackup, setHasToastCellBackup] = useState(true); // $65/mo

  // Rework Flow Buyout & Support Configuration
  const [includeOptionalSupport, setIncludeOptionalSupport] = useState(true); // $149/mo optional insurance

  if (!isOpen) return null;

  // Monthly Calculations
  const averageCheck = 85;
  const monthlyTransactions = Math.round(monthlyVolume / averageCheck);

  // Toast Recurring Software & Module Drain (Pure SaaS Rent)
  const toastSoftwareFee = terminalCount * 110; // $110/mo/terminal base = $770/mo
  const toastAddonFees = 
    (hasToastTables ? 199 : 0) + 
    (hasToastOnline ? 149 : 0) + 
    (hasToastHandhelds ? 200 : 0) + 
    (hasToastCellBackup ? 65 : 0);
  const toastMonthlySoftwareTotal = toastSoftwareFee + toastAddonFees; // ~$1,383/mo
  const toastAnnualSoftwareTotal = toastMonthlySoftwareTotal * 12; // ~$16,596/yr

  // Processing Spread (Toast Flat 2.79% vs Direct Interchange 2.15%)
  const toastProcessingFee = (monthlyVolume * (toastRate / 100)) + (monthlyTransactions * 0.15);
  const unionProcessingFee = (monthlyVolume * (unionRate / 100)) + (monthlyTransactions * 0.08);
  const monthlyProcessingSavings = toastProcessingFee - unionProcessingFee;
  const annualProcessingSavings = monthlyProcessingSavings * 12;

  // Total Toast Annual Cash Outflow
  const totalAnnualToast = toastAnnualSoftwareTotal + (toastProcessingFee * 12);

  // Rework Flow One-Time Buyout & Optional Support
  const buyoutPrice = 7500; // Flat one-time complete ownership
  const optionalAnnualSupport = includeOptionalSupport ? (149 * 12) : 0; // $1,788/yr optional insurance
  
  // Year 1 Total & Recurring Years
  const year1UnionTotal = buyoutPrice + optionalAnnualSupport + (unionProcessingFee * 12);
  const year2PlusUnionAnnual = optionalAnnualSupport + (unionProcessingFee * 12);

  // Net Savings
  const year1NetSavings = totalAnnualToast - year1UnionTotal;
  const recurringAnnualSavings = totalAnnualToast - year2PlusUnionAnnual;
  const fiveYearRecovery = year1NetSavings + (recurringAnnualSavings * 4);

  // Payback period (Months to pay back $7,500 purely from software SaaS elimination)
  const monthlyPureSoftwareSavings = toastMonthlySoftwareTotal - (includeOptionalSupport ? 149 : 0);
  const breakevenMonths = Math.max(1, Math.round((buyoutPrice / (monthlyPureSoftwareSavings + monthlyProcessingSavings)) * 10) / 10);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-4xl bg-[#16181d] border border-[#c29b68]/40 rounded-2xl shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#221c15] via-[#1a1c22] to-[#16181d] border-b border-[#c29b68]/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#c29b68]/20 border border-[#c29b68]/50 flex items-center justify-center text-[#c29b68] shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#e2e4ea] font-serif">
                  Toast POS vs. UnionOS TCO Comparison
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#c29b68] text-[#0c0d10] font-black px-2 py-0.5 rounded">
                  Executive Brief
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Financial recovery model engineered specifically for 240 Union (Lakewood, CO)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#222731] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tab Switcher */}
        <div className="flex border-b border-[#262a34] bg-[#111215] px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('financial')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'financial'
                ? 'border-[#c29b68] text-[#c29b68]'
                : 'border-transparent text-[#9ca3af] hover:text-[#e2e4ea]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>1. Toast Financial Audit & ROI</span>
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'hardware'
                ? 'border-[#c29b68] text-[#c29b68]'
                : 'border-transparent text-[#9ca3af] hover:text-[#e2e4ea]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>2. Station Hardware Bill of Materials (Amazon Direct)</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              0% Markup
            </span>
          </button>
        </div>

        {activeTab === 'financial' ? (
          <>
            {/* Big Impact Recovery Summary Card */}
            <div className="p-4 sm:p-6 bg-[#0e1013] border-b border-[#262a34] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3.5 bg-[#16181d] rounded-xl border border-rose-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                Current Toast Annual Drain
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-rose-300 block mt-1">
                ${Math.round(totalAnnualToast).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-[#9ca3af] mt-2 block border-t border-[#262a34] pt-1.5">
              ${Math.round(toastAnnualSoftwareTotal).toLocaleString()}/yr pure software rent + card markup
            </span>
          </div>

          <div className="p-3.5 bg-gradient-to-b from-[#1b251f] to-[#16181d] rounded-xl border border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  UnionOS Handover Buyout
                </span>
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">
                  Own It
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-mono font-black text-white block mt-1">
                $7,500 <span className="text-xs text-emerald-400 font-normal">Flat</span>
              </span>
            </div>
            <div className="text-[10px] text-emerald-400/90 mt-2 block border-t border-emerald-500/20 pt-1.5 font-medium">
              Payback in <strong className="text-white font-mono">{breakevenMonths} Months</strong> • $0 mandatory subscriptions
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-br from-[#2a1d12] to-[#16181d] rounded-xl border border-[#c29b68] shadow-lg shadow-[#c29b68]/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#c29b68] font-black block flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c29b68]" />
                5-YEAR CLIENT EQUITY
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#e2e4ea] block mt-1">
                +${Math.round(fiveYearRecovery).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-2 block border-t border-[#c29b68]/20 pt-1.5">
              +${Math.round(recurringAnnualSavings).toLocaleString()}/yr recurring bottom-line savings
            </span>
          </div>
        </div>

        {/* Independence & Payback Banner */}
        <div className="px-4 sm:px-6 py-3 bg-[#111317] border-b border-[#262a34] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[#e2e4ea]">
              <strong>Rework Flow Ownership Model:</strong> 100% turnkey handover. The hardware appliance and code run in your building. No forced subscription lock-in.
            </span>
          </div>
          
          <label className="flex items-center gap-2 bg-[#16181d] hover:bg-[#1f232b] px-3 py-1.5 rounded-lg border border-[#262a34] cursor-pointer shrink-0 transition">
            <input 
              type="checkbox"
              checked={includeOptionalSupport}
              onChange={(e) => setIncludeOptionalSupport(e.target.checked)}
              className="accent-[#c29b68] w-4 h-4 rounded"
            />
            <span className="text-[#9ca3af] text-[11px]">
              Include Optional Concierge Insurance: <strong className="text-[#e2e4ea]">$149/mo</strong>
            </span>
          </label>
        </div>

        {/* Interactive Sliders & Configuration */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-[#262a34]">
          {/* Left: Volume & Scale Inputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#c29b68] uppercase tracking-wider flex items-center gap-1.5 font-serif">
              <Sliders className="w-3.5 h-3.5" />
              Adjust Restaurant Volume & Terminals
            </h3>

            {/* Monthly Card Volume */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#9ca3af]">Monthly Gross Card Volume:</span>
                <span className="font-mono font-bold text-[#e2e4ea] text-sm">
                  ${monthlyVolume.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="450000"
                step="10000"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full accent-[#c29b68] bg-[#111215] rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-[#9ca3af]/60 font-mono mt-0.5">
                <span>$100k</span>
                <span>$240k (Typical 240 Union)</span>
                <span>$450k</span>
              </div>
            </div>

            {/* Active Terminals & Handhelds */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#9ca3af]">Total Terminal Count (Bar + Stations):</span>
                <span className="font-mono font-bold text-[#e2e4ea] text-sm">
                  {terminalCount} Terminals
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="14"
                step="1"
                value={terminalCount}
                onChange={(e) => setTerminalCount(Number(e.target.value))}
                className="w-full accent-[#c29b68] bg-[#111215] rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-[#9ca3af]/60 font-mono mt-0.5">
                <span>3 Devices</span>
                <span>7 Devices</span>
                <span>14 Devices</span>
              </div>
            </div>

            {/* Processing Rate Spread */}
            <div className="p-3 bg-[#111215] rounded-xl border border-[#262a34] space-y-2">
              <span className="text-[11px] font-bold text-[#e2e4ea] block">
                Processing Spread Analysis:
              </span>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Toast Blended Rate:</span>
                <span className="font-mono text-rose-400 font-bold">{toastRate}% + 15¢</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>UnionOS Direct Interchange:</span>
                <span className="font-mono text-emerald-400 font-bold">{unionRate}% + 8¢</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#262a34] text-[#e2e4ea]">
                <span>Spread Savings:</span>
                <span className="font-mono font-bold text-[#c29b68]">
                  {((toastRate - unionRate)).toFixed(2)}% (+ 7¢ / swipe)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Toast Monthly Add-on Checklist */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#c29b68] uppercase tracking-wider flex items-center gap-1.5 font-serif">
              <DollarSign className="w-3.5 h-3.5" />
              Toast Module Nickel-and-Dime Audit
            </h3>
            <p className="text-[11px] text-[#9ca3af]">
              Uncheck modules to see impact. UnionOS includes all of these natively in the local appliance at $0 added cost.
            </p>

            <div className="space-y-2">
              <label className="p-2.5 bg-[#111215] hover:bg-[#1a1d24] border border-[#262a34] rounded-lg flex items-center justify-between cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasToastTables}
                    onChange={(e) => setHasToastTables(e.target.checked)}
                    className="accent-[#c29b68] w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#e2e4ea] block">Toast Tables (Waitlist & Host)</span>
                    <span className="text-[10px] text-[#9ca3af]">UnionOS includes free SMS waitlist</span>
                  </div>
                </div>
                <span className="font-mono text-rose-400 font-bold">$199 / mo</span>
              </label>

              <label className="p-2.5 bg-[#111215] hover:bg-[#1a1d24] border border-[#262a34] rounded-lg flex items-center justify-between cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasToastOnline}
                    onChange={(e) => setHasToastOnline(e.target.checked)}
                    className="accent-[#c29b68] w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#e2e4ea] block">Toast Online Ordering / QR Pay</span>
                    <span className="text-[10px] text-[#9ca3af]">UnionOS includes table QR guest checkout</span>
                  </div>
                </div>
                <span className="font-mono text-rose-400 font-bold">$149 / mo</span>
              </label>

              <label className="p-2.5 bg-[#111215] hover:bg-[#1a1d24] border border-[#262a34] rounded-lg flex items-center justify-between cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasToastHandhelds}
                    onChange={(e) => setHasToastHandhelds(e.target.checked)}
                    className="accent-[#c29b68] w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#e2e4ea] block">Toast Go 2 Handheld Software Fees</span>
                    <span className="text-[10px] text-[#9ca3af]">$50/device/mo fee on top of hardware</span>
                  </div>
                </div>
                <span className="font-mono text-rose-400 font-bold">$200 / mo</span>
              </label>

              <label className="p-2.5 bg-[#111215] hover:bg-[#1a1d24] border border-[#262a34] rounded-lg flex items-center justify-between cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasToastCellBackup}
                    onChange={(e) => setHasToastCellBackup(e.target.checked)}
                    className="accent-[#c29b68] w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#e2e4ea] block">Toast Cellular LTE Backup Dongle</span>
                    <span className="text-[10px] text-[#9ca3af]">UnionOS runs 100% locally when Comcast dies</span>
                  </div>
                </div>
                <span className="font-mono text-rose-400 font-bold">$65 / mo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Payback & Cash Flow Trajectory Meter */}
        <div className="p-4 sm:p-6 bg-[#13151a] border-b border-[#262a34]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#c29b68] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Capital Payback & Equity Timeline ($7,500 One-Time Turnkey)
              </h3>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">
                Every month Toast drains <span className="text-rose-400 font-mono font-bold">${Math.round(toastMonthlySoftwareTotal).toLocaleString()}</span> in software rent alone. UnionOS eliminates this SaaS forever.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#0c0d10] px-3 py-1.5 rounded-lg border border-emerald-500/40 shrink-0">
              <span className="text-[10px] uppercase font-mono text-[#9ca3af]">Payback Reached:</span>
              <span className="text-xs font-mono font-black text-emerald-400">Month {breakevenMonths}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-[#0e1013] rounded-lg border border-[#262a34]">
              <span className="text-[10px] font-mono text-[#9ca3af] block">Month 1 (Launch)</span>
              <span className="font-mono font-bold text-white text-sm block mt-0.5">-$7,500 Capital</span>
              <span className="text-[10px] text-[#9ca3af]">Hardware installed & live</span>
            </div>
            <div className="p-2.5 bg-[#0e1013] rounded-lg border border-[#262a34]">
              <span className="text-[10px] font-mono text-[#9ca3af] block">Month 4 (Mid-Flight)</span>
              <span className="font-mono font-bold text-amber-400 text-sm block mt-0.5">-$2,560 Net</span>
              <span className="text-[10px] text-[#9ca3af]">66% of buyout recouped</span>
            </div>
            <div className="p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-500/40">
              <span className="text-[10px] font-mono text-emerald-400 block font-bold">Month 7-8 (Breakeven)</span>
              <span className="font-mono font-bold text-emerald-300 text-sm block mt-0.5">$0 Net Cost (100% Recouped)</span>
              <span className="text-[10px] text-emerald-400/80">Appliance pays for itself</span>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-[#1e1710] to-[#16181d] rounded-lg border border-[#c29b68]/60">
              <span className="text-[10px] font-mono text-[#c29b68] block font-bold">Year 1 & Beyond</span>
              <span className="font-mono font-bold text-[#c29b68] text-sm block mt-0.5">+${Math.round(recurringAnnualSavings).toLocaleString()} / yr</span>
              <span className="text-[10px] text-emerald-400 font-medium">Pure bottom-line profit</span>
            </div>
          </div>
        </div>

        {/* Latency & Reliability Benchmark Grid */}
        <div className="p-4 sm:p-6 bg-[#0e1013]">
          <h3 className="text-xs font-bold text-[#c29b68] uppercase tracking-wider flex items-center gap-1.5 font-serif mb-3">
            <Zap className="w-3.5 h-3.5" />
            Operational Benchmark: Cloud vs. Local Appliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#16181d] rounded-xl border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 uppercase text-[11px]">Toast (AWS Cloud Dependent)</span>
                <span className="font-mono font-black text-rose-400">1,800ms Latency</span>
              </div>
              <ul className="space-y-1.5 text-[#9ca3af] text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">✕</span>
                  <span>Every button tap travels to AWS cloud servers in Virginia.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">✕</span>
                  <span>Comcast outage halts credit card authorization & guest payment.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">✕</span>
                  <span>Toast charges per-terminal software licenses forever.</span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 bg-[#16181d] rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 uppercase text-[11px]">UnionOS (Local LAN Hardware)</span>
                <span className="font-mono font-black text-emerald-400">&lt; 8ms Latency</span>
              </div>
              <ul className="space-y-1.5 text-[#e2e4ea] text-[11px]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sub-millisecond local LAN sync across all POS, KDS & Bar tablets.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Offline-first resilience: Full service continues even if fiber cuts.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero per-device software taxes. Add 50 tablets for $0 extra.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    ) : (
      /* Tab 2: Station Hardware Bill of Materials (Amazon Direct / $0 Markup) */
      <div className="p-4 sm:p-6 space-y-6 bg-[#0e1013]">
        {/* Philosophy Callout Banner */}
        <div className="p-4 bg-gradient-to-r from-[#1a231d] via-[#141b16] to-[#111215] rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                Direct At-Cost Hardware Principle (0% Equipment Markup)
              </h3>
              <p className="text-xs text-[#9ca3af] mt-0.5 leading-relaxed">
                You purchase all equipment directly from Amazon/CDW on your business card. 240 Union holds direct title, manufacturer warranties, and receives an immediate IRS Section 179 tax deduction. We never mark up hardware by a single cent.
              </p>
            </div>
          </div>

          <div className="bg-[#0b0d10] px-4 py-2 rounded-xl border border-emerald-500/40 text-center shrink-0 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-center">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Total Hardware Investment</span>
            <span className="text-xl font-mono font-black text-white">$2,110 <span className="text-xs text-[#9ca3af] font-normal">est.</span></span>
          </div>
        </div>

        {/* Station by Station Hardware Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#c29b68] uppercase font-mono tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Tailored Station Hardware Configuration (240 Union)</span>
            </h4>
            <span className="text-[11px] font-mono text-[#9ca3af]">
              7 Stations • 2 Handhelds • 1 Master Expo
            </span>
          </div>

          <div className="bg-[#111215] border border-[#262a34] rounded-xl overflow-hidden divide-y divide-[#1e222b] text-xs">
            {/* Local Server Node */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#16181d] transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Local LAN Server Appliance (Brain)</span>
                    <span className="text-[10px] font-mono bg-[#222731] text-[#e2e4ea] px-1.5 py-0.5 rounded">Office / Server Rack</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    Intel N100 Fanless Mini-PC, 16GB RAM, 512GB NVMe SSD, Dual 2.5GbE LAN. Runs local database, instantaneous sync, offline persistence.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262a34]">
                <span className="text-[11px] font-mono text-[#9ca3af]">1 unit @ $160</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">$160</span>
              </div>
            </div>

            {/* Host Stand Station */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#16181d] transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Tablet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Host Stand & VIP Seating Station</span>
                    <span className="text-[10px] font-mono bg-[#222731] text-[#e2e4ea] px-1.5 py-0.5 rounded">Host Podium</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    10.9" iPad (10th Gen) or commercial touch panel with 360° steel swivel stand. Floor plan seating, SMS waitlist, reservation notes.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262a34]">
                <span className="text-[11px] font-mono text-[#9ca3af]">1 terminal + swivel stand</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">$280</span>
              </div>
            </div>

            {/* Main Bar Stations */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#16181d] transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Main Bar High-Speed Terminals</span>
                    <span className="text-[10px] font-mono bg-[#222731] text-[#e2e4ea] px-1.5 py-0.5 rounded">Bar Station 1 & 2</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    2x 15.6" Heavy-duty spill-resistant commercial touch terminals. Rapid tap-to-reorder, cellar bottle inventory tracking, auto-grat.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262a34]">
                <span className="text-[11px] font-mono text-[#9ca3af]">2 units @ $300</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">$600</span>
              </div>
            </div>

            {/* Dining Room Wait Stations */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#16181d] transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Dining Room Wait Stations</span>
                    <span className="text-[10px] font-mono bg-[#222731] text-[#e2e4ea] px-1.5 py-0.5 rounded">North & South Floor</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    2x 15.6" Server stations on heavy weighted stands. Seat-by-seat coursing, Denver Fed Center auto-splitting, kitchen fire alerts.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262a34]">
                <span className="text-[11px] font-mono text-[#9ca3af]">2 units @ $275</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">$550</span>
              </div>
            </div>

            {/* Kitchen Expo Pass KDS */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#16181d] transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Master Kitchen Expo KDS (The Pass)</span>
                    <span className="text-[10px] font-mono bg-[#222731] text-[#e2e4ea] px-1.5 py-0.5 rounded">Chef's Pass</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    21.5" Commercial display at the 60-ft open pass. Color-coded ticket timers (green/yellow/red), 1-tap course fires, multi-course syncing.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262a34]">
                <span className="text-[11px] font-mono text-[#9ca3af]">1 master screen</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">$260</span>
              </div>
            </div>

            {/* Handhelds for Patio & Speed Lunch Pay */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#16181d] transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <Tablet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Mobile Handhelds (Patio & Tableside Pay)</span>
                    <span className="text-[10px] font-mono bg-[#222731] text-[#e2e4ea] px-1.5 py-0.5 rounded">Patio & Fast Checkouts</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    2x Rugged Android handhelds. 20-second tableside Apple Pay/tap checkout for 1:00 PM Fed Center departures. Zero monthly $50 Toast fees.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262a34]">
                <span className="text-[11px] font-mono text-[#9ca3af]">2 units @ $130</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">$260</span>
              </div>
            </div>

            {/* Existing Printers & Drawers Reused */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1410] border-l-2 border-emerald-400">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-300">Existing Cook Line Printers & Cash Drawers</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">100% Reused</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    Grill, Sauté, Wood Oven, and Bar Ethernet printers (Epson TM-U220 / TM-T88) + APG cash drawers connect directly over existing Cat6.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Plug & Play</span>
                <span className="font-mono font-black text-emerald-400 text-base">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary & Comparison */}
        <div className="p-4 bg-[#14161c] rounded-xl border border-[#262a34] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#9ca3af] block font-bold">Toast Hardware Quote for Same 8 Stations:</span>
            <div className="text-xl font-mono font-bold text-rose-400 mt-1">
              $7,200 – $9,000 <span className="text-xs font-normal text-rose-300">(Locked Toast Hardware)</span>
            </div>
            <p className="text-[10px] text-[#9ca3af] mt-1">
              Toast charges $800–$1,000/terminal for proprietary hardware they lock with MDM firmware, plus $50/mo per handheld.
            </p>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l border-[#262a34] pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] font-mono uppercase text-emerald-400 block font-bold">UnionOS Direct Hardware Package:</span>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              $2,110 <span className="text-xs font-normal text-[#e2e4ea]">(100% Owned by 240 Union)</span>
            </div>
            <p className="text-[10px] text-[#9ca3af] mt-1">
              Commercial-grade hardware purchased directly at wholesale/Amazon prices. Zero locked firmware, zero per-device monthly software rent.
            </p>
          </div>
        </div>
      </div>
    )}

        {/* Footer */}
        <div className="p-4 bg-[#111215] border-t border-[#262a34] flex items-center justify-between">
          <span className="text-xs text-[#9ca3af] font-mono">
            Audit Model: 240 Union Blvd, Lakewood CO 80228
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/leave-behind', '_blank')}
              className="px-3.5 py-1.5 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] rounded-lg text-xs font-bold border border-[#262a34] transition"
            >
              Print 1-Page PDF Brief
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] rounded-lg text-xs font-bold transition shadow-sm"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
