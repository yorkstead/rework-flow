'use client';

import React, { useEffect, useState } from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { SplitCheck } from '../lib/types';
import { 
  Receipt, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  ArrowLeft,
  Divide,
  Share2,
  Users
} from 'lucide-react';

interface SplitCheckViewProps {
  onBackToFloor: () => void;
  onBackToPOS: () => void;
}

export const SplitCheckView: React.FC<SplitCheckViewProps> = ({ onBackToFloor, onBackToPOS }) => {
  const { 
    tables, 
    orders, 
    activeTableId, 
    setActiveTableId, 
    activeTable, 
    activeOrder, 
    autoSplitBySeat, 
    settleCheck,
    closeTable 
  } = useUnionStore();

  const [activeCheckPrinting, setActiveCheckPrinting] = useState<SplitCheck | null>(null);

  // Auto-run split calculation if not yet split
  useEffect(() => {
    if (activeTableId && activeOrder && (!activeOrder.splitChecks || activeOrder.splitChecks.length === 0)) {
      autoSplitBySeat(activeTableId);
    }
  }, [activeTableId, activeOrder, autoSplitBySeat]);

  if (!activeTable || !activeOrder) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">No Active Seated Table Selected</h3>
        <p className="text-xs text-slate-400">Select an active table from the floor plan to process split checks.</p>
        <button
          onClick={onBackToFloor}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
        >
          Return to Floor Plan
        </button>
      </div>
    );
  }

  const checks = activeOrder.splitChecks || [];
  const allPaid = checks.length > 0 && checks.every(c => c.paymentStatus === 'paid');

  const sharedItems = activeOrder.items.filter(i => i.seatNumber === 'shared');
  const sharedTotal = sharedItems.reduce((acc, i) => acc + i.price, 0);

  const handleBatchSettle = (method: SplitCheck['paymentMethod']) => {
    if (!activeTableId) return;
    checks.forEach(chk => {
      if (chk.paymentStatus === 'unpaid') {
        settleCheck(activeTableId, chk.id, method);
      }
    });
  };

  return (
    <div className="p-3 md:p-4 max-w-7xl mx-auto space-y-4 max-w-full overflow-hidden">
      {/* Top Banner & Fast Actions */}
      <div className="bg-[#16181d] p-3 md:p-4 rounded-xl border border-[#262a34] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-full overflow-hidden">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPOS}
              className="p-1.5 rounded-lg bg-[#111215] hover:bg-[#1a1d24] text-[#e2e4ea] border border-[#262a34] transition"
              title="Back to POS"
            >
              <ArrowLeft className="w-4 h-4 text-[#c29b68]" />
            </button>
            <span className="font-mono text-xl font-bold bg-[#111215] text-[#c29b68] px-2.5 py-0.5 rounded border border-[#262a34]">
              Table {activeTable.number}
            </span>
            <div>
              <h2 className="text-base font-bold text-[#e2e4ea] flex items-center gap-2 font-serif">
                Speed-Split Checkout Engine
                <span className="text-[10px] font-mono bg-[#111215] text-[#3b82f6] px-2 py-0.5 rounded border border-[#3b82f6]/40 font-semibold font-sans">
                  Denver Federal Center Fast-Pay
                </span>
              </h2>
              <p className="text-xs text-[#9ca3af] font-serif">
                {activeTable.guestCount} Guests • Server: {activeTable.serverName} • Lakewood Sales Tax 8.25%
              </p>
            </div>
          </div>
        </div>

        {/* Auto Split & Batch Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => autoSplitBySeat(activeTable.id)}
            className="px-3.5 py-2 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition"
          >
            <Divide className="w-3.5 h-3.5" />
            <span>Re-Split by Seat</span>
          </button>

          {!allPaid && (
            <button
              onClick={() => handleBatchSettle('Corporate Amex')}
              className="px-3.5 py-2 bg-[#111215] hover:bg-[#1a1d24] text-[#e2e4ea] border border-[#3b82f6]/50 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
            >
              <Building2 className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Settle All as Corp Amex</span>
            </button>
          )}

          {allPaid && (
            <button
              onClick={() => {
                closeTable(activeTable.id);
                onBackToFloor();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-[#0c0d10] font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>All Paid • Bus Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Shared Items Banner */}
      {sharedItems.length > 0 && (
        <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs max-w-full overflow-hidden">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#c29b68]" />
            <span className="font-bold text-[#e2e4ea] font-serif">Table-Shared Items:</span>
            <div className="flex flex-wrap gap-1.5">
              {sharedItems.map(item => (
                <span key={item.id} className="bg-[#111215] text-[#e2e4ea] px-2 py-0.5 rounded border border-[#262a34] font-mono">
                  {item.name} (${item.price})
                </span>
              ))}
            </div>
          </div>
          <div className="font-mono text-[#e2e4ea] bg-[#111215] px-2.5 py-1 rounded border border-[#262a34]">
            Total ${sharedTotal} ÷ {checks.length} Seats = <span className="font-bold text-[#c29b68]">${(sharedTotal / (checks.length || 1)).toFixed(2)} / person</span>
          </div>
        </div>
      )}

      {/* Grid of Individual Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => {
          const seatNum = check.seatNumbers[0];
          const isPaid = check.paymentStatus === 'paid';
          const seatItems = activeOrder.items.filter(i => check.itemIds.includes(i.id));
          const sharedShare = checks.length > 0 ? sharedTotal / checks.length : 0;

          return (
            <div
              key={check.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition shadow-md ${
                isPaid
                  ? 'bg-[#111e16]/80 border-emerald-500/50'
                  : 'bg-[#16181d] border-[#262a34] hover:border-[#3b82f6]/50'
              }`}
            >
              {/* Check Header */}
              <div>
                <div className="flex items-center justify-between border-b border-[#262a34] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#111215] text-[#3b82f6] font-mono font-bold text-xs flex items-center justify-center border border-[#262a34]">
                      S{seatNum}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#e2e4ea] font-serif">
                        Guest #{seatNum} Folio
                      </h4>
                      <span className="text-[10px] text-[#9ca3af] font-mono">Check #{check.checkNumber}</span>
                    </div>
                  </div>

                  <div>
                    {isPaid ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Paid ({check.paymentMethod})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#111215] text-[#e2e4ea] border border-[#262a34] text-[11px] font-medium">
                        Balance Due
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in this guest's check */}
                <div className="py-3 space-y-1.5 text-xs">
                  {seatItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-[#9ca3af]">
                      <span className="line-clamp-1 flex-1 pr-2">{item.name}</span>
                      <span className="font-mono text-[#e2e4ea] font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}

                  {sharedShare > 0 && (
                    <div className="flex justify-between items-center text-[#c29b68] text-[11px] font-mono pt-1 border-t border-dashed border-[#262a34]">
                      <span>Shared Apps ({checks.length} ways)</span>
                      <span>+${sharedShare.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check Totals & Closeout */}
              <div className="border-t border-[#262a34] pt-2 space-y-2">
                <div className="space-y-0.5 text-[11px] font-mono text-[#9ca3af]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-[#e2e4ea]">${check.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lakewood Tax (8.25%):</span>
                    <span className="text-[#e2e4ea]">${check.tax.toFixed(2)}</span>
                  </div>
                  {check.autoGrat > 0 && (
                    <div className="flex justify-between text-[#c29b68]">
                      <span>Auto Grat (20%):</span>
                      <span>${check.autoGrat.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#e2e4ea] pt-1 border-t border-[#262a34]">
                    <span className="font-serif">Total:</span>
                    <span className="text-emerald-400 font-mono">${check.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Actions */}
                {!isPaid ? (
                  <div className="space-y-1.5 pt-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => activeTableId && settleCheck(activeTableId, check.id, 'Corporate Amex')}
                        className="py-1.5 px-2 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] rounded text-[11px] font-semibold flex items-center justify-center gap-1 border border-[#3b82f6]/40 transition"
                      >
                        <Building2 className="w-3 h-3 text-[#3b82f6]" />
                        <span>Corp Amex</span>
                      </button>

                      <button
                        onClick={() => activeTableId && settleCheck(activeTableId, check.id, 'Card')}
                        className="py-1.5 px-2 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] rounded text-[11px] font-semibold flex items-center justify-center gap-1 border border-[#262a34] transition"
                      >
                        <CreditCard className="w-3 h-3 text-[#c29b68]" />
                        <span>Visa / MC</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => activeTableId && settleCheck(activeTableId, check.id, 'Apple Pay')}
                        className="py-1 px-1 bg-[#111215] hover:bg-[#1a1d24] text-[#9ca3af] rounded text-[10px] font-medium flex items-center justify-center gap-1 border border-[#262a34] transition"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Apple Pay</span>
                      </button>

                      <button
                        onClick={() => activeTableId && settleCheck(activeTableId, check.id, 'Cash')}
                        className="py-1 px-1 bg-[#111215] hover:bg-[#1a1d24] text-[#9ca3af] rounded text-[10px] font-medium flex items-center justify-center gap-1 border border-[#262a34] transition"
                      >
                        <Banknote className="w-3 h-3" />
                        <span>Cash</span>
                      </button>

                      <button
                        onClick={() => activeTableId && settleCheck(activeTableId, check.id, 'House Account')}
                        className="py-1 px-1 bg-[#111215] hover:bg-[#1a1d24] text-[#9ca3af] rounded text-[10px] font-medium flex items-center justify-center gap-1 border border-[#262a34] transition"
                      >
                        <span>House Acct</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400/80">
                      Settled at {new Date(check.paidAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => setActiveCheckPrinting(check)}
                      className="px-2.5 py-1 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] rounded text-[10px] font-medium flex items-center gap-1 border border-[#262a34] transition"
                    >
                      <Printer className="w-3 h-3 text-[#c29b68]" />
                      <span>Print Chit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Chit Print Modal */}
      {activeCheckPrinting && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4ecd6] text-[#0e0a07] font-mono p-6 max-w-sm w-full rounded-lg shadow-2xl space-y-3 text-xs border border-[#262a34]">
            <div className="text-center border-b border-dashed border-[#5a3f2c]/40 pb-3">
              <h3 className="font-serif font-black text-xl tracking-wider text-[#0e0a07]">240 UNION</h3>
              <p className="text-[11px] text-[#5a3f2c] font-serif italic">Creative American Grill</p>
              <p className="text-[10px] text-[#5a3f2c]/80">240 Union Blvd, Lakewood, CO 80228</p>
              <p className="text-[10px] text-[#5a3f2c]/80">(303) 989-3562</p>
            </div>

            <div className="flex justify-between text-[11px] text-[#241a12]">
              <span>Table: {activeTable.number}</span>
              <span>Server: {activeTable.serverName}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#241a12]">
              <span>Guest #{activeCheckPrinting.seatNumbers[0]}</span>
              <span>Check #{activeCheckPrinting.checkNumber}</span>
            </div>

            <div className="border-t border-b border-dashed border-[#5a3f2c]/40 py-2 space-y-1">
              {activeOrder.items
                .filter(i => activeCheckPrinting.itemIds.includes(i.id))
                .map(item => (
                  <div key={item.id} className="flex justify-between text-[#0e0a07]">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              {sharedTotal > 0 && (
                <div className="flex justify-between italic text-[#5a3f2c]">
                  <span>Shared Apps Portioned</span>
                  <span>+${(sharedTotal / checks.length).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-right text-[#241a12]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${activeCheckPrinting.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lakewood Tax (8.25%):</span>
                <span>${activeCheckPrinting.tax.toFixed(2)}</span>
              </div>
              {activeCheckPrinting.autoGrat > 0 && (
                <div className="flex justify-between text-[#8b5a3c] font-bold">
                  <span>Auto-Grat (20%):</span>
                  <span>${activeCheckPrinting.autoGrat.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-[#0e0a07] text-[#0e0a07]">
                <span>TOTAL PAID:</span>
                <span>${activeCheckPrinting.total.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-[#5a3f2c]">Method: {activeCheckPrinting.paymentMethod}</p>
            </div>

            <div className="text-center pt-2 text-[10px] text-[#5a3f2c] border-t border-dashed border-[#5a3f2c]/40 font-serif italic">
              Thank you for dining at 240 Union!
            </div>

            <button
              onClick={() => setActiveCheckPrinting(null)}
              className="w-full py-2 bg-[#16181d] text-[#e2e4ea] font-bold rounded mt-2 hover:bg-[#222731] transition border border-[#262a34]"
            >
              Close Print Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
