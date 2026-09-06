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
  Sparkles
} from 'lucide-react';

interface ToastComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToastComparisonModal: React.FC<ToastComparisonModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  // Monthly Calculations
  const averageCheck = 85;
  const monthlyTransactions = Math.round(monthlyVolume / averageCheck);

  // Toast Monthly Costs
  const toastProcessingFee = (monthlyVolume * (toastRate / 100)) + (monthlyTransactions * 0.15);
  const toastSoftwareFee = terminalCount * 110; // $110/mo/terminal base
  const toastAddonFees = 
    (hasToastTables ? 199 : 0) + 
    (hasToastOnline ? 149 : 0) + 
    (hasToastHandhelds ? 200 : 0) + 
    (hasToastCellBackup ? 65 : 0);
  const totalMonthlyToast = toastProcessingFee + toastSoftwareFee + toastAddonFees;
  const totalAnnualToast = totalMonthlyToast * 12;

  // UnionOS Costs (Local-First Flat Appliance)
  const unionProcessingFee = (monthlyVolume * (unionRate / 100)) + (monthlyTransactions * 0.08);
  const unionApplianceFee = 450; // Flat enterprise appliance maintenance & support
  const totalMonthlyUnion = unionProcessingFee + unionApplianceFee;
  const totalAnnualUnion = totalMonthlyUnion * 12;

  // Net Annual Client Recovery
  const annualSavings = totalAnnualToast - totalAnnualUnion;
  const fiveYearRecovery = annualSavings * 5;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
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

        {/* Big Impact Recovery Summary Card */}
        <div className="p-4 sm:p-6 bg-[#0e1013] border-b border-[#262a34] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#16181d] rounded-xl border border-rose-500/30">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
              Current Toast Annual Drain
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-rose-300 block mt-1">
              ${Math.round(totalAnnualToast).toLocaleString()}
            </span>
            <span className="text-[10px] text-[#9ca3af] mt-0.5 block">
              Processing + Per-Terminal Software + Add-ons
            </span>
          </div>

          <div className="p-3 bg-[#16181d] rounded-xl border border-emerald-500/30">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              UnionOS Annual Cost
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 block mt-1">
              ${Math.round(totalAnnualUnion).toLocaleString()}
            </span>
            <span className="text-[10px] text-[#9ca3af] mt-0.5 block">
              Interchange-Plus + Flat Local Appliance
            </span>
          </div>

          <div className="p-3 bg-gradient-to-br from-[#2a1d12] to-[#16181d] rounded-xl border border-[#c29b68] shadow-lg shadow-[#c29b68]/10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#c29b68] font-black block flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#c29b68]" />
              NET ANNUAL CLIENT RECOVERY
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#e2e4ea] block mt-1">
              +${Math.round(annualSavings).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">
              ${Math.round(fiveYearRecovery).toLocaleString()} 5-Yr Direct Bottom-Line Profit
            </span>
          </div>
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
