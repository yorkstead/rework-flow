'use client';

import React from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { 
  Wine, 
  Building, 
  Calendar, 
  DollarSign, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const PrivateDiningView: React.FC = () => {
  const { 
    events, 
    menu, 
    eightySixList, 
    toggle86, 
    decrementCellar 
  } = useUnionStore();

  const wineAndReserveItems = menu.filter(m => m.category === 'wine' || m.wineDetails);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* SECTION 1: PRIVATE DINING CONTRACTS & MINIMUMS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#e2e4ea] flex items-center gap-2 font-serif">
              <Building className="w-4 h-4 text-[#c29b68]" />
              <span>Private Dining & Banquet Minimums</span>
              <span className="text-[10px] font-mono bg-[#16181d] text-[#c29b68] px-2 py-0.5 rounded border border-[#262a34] font-bold uppercase font-sans">
                240 Union Event Spaces
              </span>
            </h2>
            <p className="text-xs text-[#9ca3af] font-serif">
              Live spend-to-minimum meters, deposit deductions, and master banquet folios
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {events.map((evt) => {
            const percentMet = Math.min(100, Math.round((evt.currentSpend / evt.fnbMinimum) * 100));
            const remainingToMin = Math.max(0, evt.fnbMinimum - evt.currentSpend);
            const balanceAfterDeposit = Math.max(0, evt.currentSpend - evt.depositPaid);

            return (
              <div
                key={evt.id}
                className="bg-[#16181d] border border-[#262a34] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#c29b68]/50 transition"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-[#262a34] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#c29b68] font-bold">
                        Private Space
                      </span>
                      <h3 className="text-base font-bold text-[#e2e4ea] font-serif">{evt.roomName}</h3>
                      <p className="text-xs text-[#9ca3af]">Capacity: up to {evt.maxCapacity} guests</p>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-[10px] text-[#9ca3af] uppercase">F&B Minimum</div>
                      <div className="text-sm font-bold text-[#c29b68]">${evt.fnbMinimum.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Host & Contract Info */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="bg-[#111215] p-2.5 rounded-lg border border-[#262a34] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Host:</span>
                        <span className="font-bold text-[#e2e4ea] font-serif">{evt.hostName}</span>
                      </div>
                      {evt.hostCompany && (
                        <div className="flex justify-between">
                          <span className="text-[#9ca3af]">Organization:</span>
                          <span className="text-[#c29b68] font-medium">{evt.hostCompany}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#9ca3af]">Schedule:</span>
                        <span className="font-mono text-[#e2e4ea]">{evt.eventTime}</span>
                      </div>
                    </div>

                    {/* Progress to Minimum */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#9ca3af]">Live Ring Spend:</span>
                        <span className="text-emerald-400 font-bold">${evt.currentSpend.toLocaleString()} / ${evt.fnbMinimum.toLocaleString()}</span>
                      </div>

                      <div className="w-full h-2.5 bg-[#111215] rounded-full overflow-hidden p-0.5 border border-[#262a34]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentMet >= 100
                              ? 'bg-emerald-500'
                              : 'bg-[#c29b68]'
                          }`}
                          style={{ width: `${percentMet}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[10px] font-mono text-[#9ca3af]">
                        <span>{percentMet}% of min met</span>
                        {remainingToMin > 0 ? (
                          <span className="text-amber-400 font-semibold">${remainingToMin.toLocaleString()} needed to hit min</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">✓ Minimum Exceeded</span>
                        )}
                      </div>
                    </div>

                    {/* Contract Details */}
                    <p className="text-[11px] text-[#9ca3af] italic bg-[#111215] p-2 rounded border border-[#262a34] font-serif">
                      "{evt.contractNotes}"
                    </p>
                  </div>
                </div>

                {/* Folio Closeout Summary */}
                <div className="pt-3 border-t border-[#262a34] space-y-2">
                  <div className="flex justify-between text-xs font-mono text-[#9ca3af]">
                    <span>Deposit Applied (OpenTable):</span>
                    <span className="text-emerald-400 font-bold">-${evt.depositPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-[#e2e4ea] font-bold">
                    <span>Est. Folio Balance Due:</span>
                    <span className="text-[#c29b68] text-sm">${balanceAfterDeposit.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => alert(`Generating master folio for ${evt.hostName} (${evt.roomName}). OpenTable deposit of $${evt.depositPaid} credited.`)}
                    className="w-full py-2 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print Master Banquet Folio</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: SOMMELIER CELLAR & REAL-TIME 86 BOARD */}
      <div className="space-y-3 pt-4 border-t border-[#262a34]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#e2e4ea] flex items-center gap-2 font-serif">
              <Wine className="w-4 h-4 text-[#c29b68]" />
              <span>Sommelier Cellar & Live 86 Board</span>
              <span className="text-[10px] font-mono bg-[#16181d] text-[#c29b68] px-2 py-0.5 rounded border border-[#262a34] font-bold uppercase font-sans">
                Synchronized 0ms Across All Stations
              </span>
            </h2>
            <p className="text-xs text-[#9ca3af] font-serif">
              Instant vintage tracking, cellar bin depletion, and one-tap 86 cutoff prevents floor servers from selling unavailable bottles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {wineAndReserveItems.map(item => {
            const is86 = eightySixList.includes(item.id);
            const stock = item.wineDetails ? item.wineDetails.cellarStock : 0;

            return (
              <div
                key={item.id}
                className={`bg-[#16181d] rounded-xl border p-3.5 flex flex-col justify-between space-y-3 transition ${
                  is86
                    ? 'border-rose-900/50 bg-rose-950/20'
                    : stock <= 2
                    ? 'border-amber-500/50 bg-[#1a1d24]'
                    : 'border-[#262a34]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-xs text-[#e2e4ea] line-clamp-1 font-serif">
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#c29b68]">
                      ${item.price}
                    </span>
                  </div>

                  {item.wineDetails && (
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9ca3af]">
                        <span>{item.wineDetails.binNumber}</span>
                        <span className="text-[#c29b68] font-bold">{item.wineDetails.vintage} Vintage</span>
                      </div>
                      <p className="text-[10px] text-[#9ca3af] line-clamp-2 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#262a34] pt-2 flex items-center justify-between gap-2">
                  <div className="font-mono text-xs">
                    {is86 ? (
                      <span className="text-rose-400 font-bold">86'D (0 Stock)</span>
                    ) : (
                      <span className={`${stock <= 3 ? 'text-amber-400 font-bold' : 'text-[#9ca3af]'}`}>
                        {stock} in cellar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!is86 && stock > 0 && (
                      <button
                        onClick={() => decrementCellar(item.id)}
                        className="px-2 py-1 bg-[#111215] hover:bg-[#1a1d24] text-[#e2e4ea] rounded text-[10px] font-mono font-semibold transition border border-[#262a34]"
                        title="Decrement 1 bottle sold"
                      >
                        -1 Sold
                      </button>
                    )}

                    <button
                      onClick={() => toggle86(item.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                        is86
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-[#0c0d10]'
                          : 'bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/60'
                      }`}
                    >
                      {is86 ? 'Restock' : '86 Item'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
