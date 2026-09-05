'use client';

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Zap, X, TrendingDown, CheckCircle2 } from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [annualSales, setAnnualSales] = useState<number>(3200000); // 240 Union estimated $3.2M
  const [terminalsCount, setTerminalsCount] = useState<number>(6); // 4 stationary + 2 handhelds

  if (!isOpen) return null;

  // Calculations
  const toastMonthlySaasPerTerminal = 125; // Toast software fee per terminal
  const toastAddonFeesMonthly = 450; // KDS, loyalty, gift cards, reporting
  const totalToastAnnualSaas = (terminalsCount * toastMonthlySaasPerTerminal + toastAddonFeesMonthly) * 12;

  // Processing: Toast charges ~3.15% flat vs Interchange-Plus ~2.10% (1.05% spread)
  const processingSavingsAnnual = Math.round(annualSales * 0.0105);

  const totalAnnualSavings = totalToastAnnualSaas + processingSavingsAnnual;
  const fiveYearSavings = totalAnnualSavings * 5;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#16181d] border border-[#262a34] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111215] border border-[#262a34] flex items-center justify-center text-[#c29b68] font-serif font-black text-xl">
              $
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e2e4ea] flex items-center gap-2 font-serif">
                Toast SaaS vs. UnionOS Independence Audit
              </h3>
              <p className="text-xs text-[#9ca3af] font-serif">
                Estimated financial recovery for 240 Union (Lakewood, CO)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#e2e4ea] p-1.5 rounded-lg hover:bg-[#111215] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111215] p-4 rounded-xl border border-[#262a34]">
            <div>
              <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1 font-serif">
                Annual Gross Revenue
              </label>
              <div className="text-lg font-mono font-bold text-[#c29b68]">
                ${annualSales.toLocaleString()}
              </div>
              <input
                type="range"
                min="1500000"
                max="6000000"
                step="100000"
                value={annualSales}
                onChange={(e) => setAnnualSales(Number(e.target.value))}
                className="w-full mt-2 accent-[#c29b68] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9ca3af] font-mono mt-1">
                <span>$1.5M</span>
                <span>$3.2M (240 Est.)</span>
                <span>$6.0M</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1 font-serif">
                Active Terminals / KDS Screens
              </label>
              <div className="text-lg font-mono font-bold text-[#c29b68]">
                {terminalsCount} Stations
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={terminalsCount}
                onChange={(e) => setTerminalsCount(Number(e.target.value))}
                className="w-full mt-2 accent-[#c29b68] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9ca3af] font-mono mt-1">
                <span>3 Stations</span>
                <span>6 (Current)</span>
                <span>12 Stations</span>
              </div>
            </div>
          </div>

          {/* Big Savings Number Card */}
          <div className="bg-[#111e16] p-5 rounded-2xl border border-emerald-500/40 text-center relative overflow-hidden">
            <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1 font-serif">
              5-Year Profit Retained by 240 Union
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-[#e2e4ea] tracking-tight">
              ${fiveYearSavings.toLocaleString()}
            </div>
            <p className="text-xs text-[#9ca3af] mt-2 max-w-md mx-auto font-serif">
              Money currently bled to Toast monthly subscription charges, add-on module tolls, and proprietary payment processing markups.
            </p>
          </div>

          {/* Breakdown Line Items */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[#e2e4ea] uppercase tracking-wider text-[11px] font-serif">
              Annual Breakdown:
            </h4>

            <div className="flex items-center justify-between p-3 bg-[#111215] rounded-xl border border-[#262a34]">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-[#e2e4ea]">Toast SaaS Software & Add-on Tolls</div>
                  <div className="text-[11px] text-[#9ca3af] font-mono">${(totalToastAnnualSaas / 12).toLocaleString()}/month eliminated</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-emerald-400 text-sm">
                +${totalToastAnnualSaas.toLocaleString()}/yr
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#111215] rounded-xl border border-[#262a34]">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#c29b68]" />
                <div>
                  <div className="font-bold text-[#e2e4ea]">Interchange-Plus Card Processing Margins</div>
                  <div className="text-[11px] text-[#9ca3af] font-mono">1.05% margin clawed back from Toast flat rates</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-[#c29b68] text-sm">
                +${processingSavingsAnnual.toLocaleString()}/yr
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#111215] rounded-xl border border-[#262a34]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-bold text-[#e2e4ea]">Server Wait Time & Terminal Bottlenecks</div>
                  <div className="text-[11px] text-[#9ca3af]">1-tap split-checks eliminates ~18 hours/week of terminal queuing</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-blue-400 text-sm">
                ~936 hrs/yr Saved
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111215] border-t border-[#262a34] flex items-center justify-between">
          <span className="text-[11px] text-[#9ca3af] font-mono">
            Zero cloud dependencies • 100% owned appliance
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-xl transition shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
