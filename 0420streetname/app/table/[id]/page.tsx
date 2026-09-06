'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUnionStore } from '@/lib/store/useUnionStore';
import { 
  Receipt, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  User, 
  Wine, 
  ArrowLeft,
  DollarSign,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function GuestTablePage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string || '23');
  // Support either "23" or "tbl-23"
  const tableId = rawId.startsWith('tbl-') ? rawId : `tbl-${rawId}`;

  const { tables, orders, autoSplitBySeat, settleCheck } = useUnionStore();

  const table = useMemo(() => tables.find(t => t.id === tableId || t.number === rawId) || tables[0], [tables, tableId, rawId]);
  const order = useMemo(() => orders.find(o => (o.tableId === table.id || o.tableNumber === table.number) && o.status === 'open') || orders[0], [orders, table]);

  const [selectedSeat, setSelectedSeat] = useState<number>(1);
  const [selectedTipPct, setSelectedTipPct] = useState<number>(20);
  const [paidSuccess, setPaidSuccess] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'Apple Pay' | 'Card'>('Apple Pay');

  // Discover seats on the order
  const seats = useMemo(() => {
    if (!order) return [1, 2];
    const s = new Set<number>();
    order.items.forEach(i => {
      if (typeof i.seatNumber === 'number') s.add(i.seatNumber);
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [order]);

  // Compute breakdown for selected seat
  const seatItems = useMemo(() => {
    if (!order) return [];
    return order.items.filter(i => i.seatNumber === selectedSeat);
  }, [order, selectedSeat]);

  const sharedItems = useMemo(() => {
    if (!order) return [];
    return order.items.filter(i => i.seatNumber === 'shared');
  }, [order]);

  const seatCount = seats.length > 0 ? seats.length : (order?.guestCount || 1);
  const sharedPerSeat = sharedItems.reduce((acc, i) => acc + i.price, 0) / seatCount;
  const seatSubtotal = seatItems.reduce((acc, i) => acc + i.price, 0) + sharedPerSeat;
  const tax = Math.round(seatSubtotal * 0.0825 * 100) / 100; // Lakewood 8.25%
  const tipAmount = Math.round(seatSubtotal * (selectedTipPct / 100) * 100) / 100;
  const finalTotal = Math.round((seatSubtotal + tax + tipAmount) * 100) / 100;

  const handlePayNow = () => {
    if (order && order.splitChecks) {
      const chk = order.splitChecks.find(c => c.seatNumbers.includes(selectedSeat));
      if (chk) {
        settleCheck(order.tableId, chk.id, paymentMethod === 'Apple Pay' ? 'Apple Pay' : 'Card');
      }
    }
    setPaidSuccess(true);
  };

  return (
    <main className="min-h-screen bg-[#0e0a07] text-[#e2e4ea] flex flex-col items-center p-4 sm:p-6 selection:bg-[#c29b68]/30">
      <div className="w-full max-w-md flex flex-col gap-4">
        
        {/* Brand Bar */}
        <header className="flex items-center justify-between py-2 border-b border-[#262a34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c29b68] text-black font-serif font-black flex items-center justify-center text-base shadow">
              240
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-widest text-[#e2e4ea] uppercase">
                240 Union
              </h1>
              <p className="text-[10px] text-[#9ca3af] font-mono">
                Table {table.number} • Lakewood, CO
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono bg-[#16181d] px-2.5 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Pay</span>
          </div>
        </header>

        {paidSuccess ? (
          /* Payment Receipt Success Screen */
          <div className="bg-[#16181d] border border-emerald-500/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Payment Settled • Thank You
              </span>
              <h2 className="text-xl font-bold font-serif text-white mt-1">
                Seat {selectedSeat} Paid ${finalTotal.toFixed(2)}
              </h2>
              <p className="text-xs text-[#9ca3af] mt-1">
                Receipt dispatched. No waiting on paper checks—you are all set to head to your 1:00 PM briefing!
              </p>
            </div>

            <div className="bg-[#111215] p-4 rounded-xl border border-[#262a34] font-mono text-xs space-y-1.5 text-left">
              <div className="flex justify-between text-[#9ca3af]">
                <span>Method</span>
                <span className="text-white">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Server</span>
                <span className="text-white">{order?.serverName || 'Marcus T.'}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Lakewood Tax (8.25%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Tip ({selectedTipPct}%)</span>
                <span className="text-white">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#262a34] pt-2 flex justify-between font-bold text-emerald-400 text-sm">
                <span>Total Paid</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setPaidSuccess(false)}
              className="text-xs text-[#9ca3af] hover:text-[#c29b68] font-mono underline"
            >
              Pay another seat or split differently
            </button>
          </div>
        ) : (
          /* Live Guest Split & Pay Screen */
          <>
            {/* Denver Fed Center Banner */}
            <div className="bg-gradient-to-r from-[#1c241e] to-[#16181d] border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Denver Fed Center Speed-Check</div>
                  <div className="text-[10px] text-[#9ca3af]">Pick your seat, tap Apple Pay, head back on time.</div>
                </div>
              </div>
            </div>

            {/* Seat Selector Carousel */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#9ca3af] flex items-center justify-between">
                <span>Select Your Seat / Check:</span>
                <span className="text-[#c29b68] font-bold">{seats.length} Guests Seated</span>
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {seats.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeat(s)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition flex flex-col items-center gap-0.5 ${
                      selectedSeat === s
                        ? 'bg-[#c29b68] text-black shadow-md border-2 border-white/20'
                        : 'bg-[#16181d] text-[#9ca3af] border border-[#262a34] hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Seat {s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized Check for this Seat */}
            <div className="bg-[#16181d] border border-[#262a34] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a34]">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#c29b68]" />
                  <span className="text-xs font-bold text-white font-serif">
                    Seat {selectedSeat} Order Summary
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#9ca3af]">
                  Server: {order?.serverName || 'Marcus T.'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#1e222a] text-xs">
                {seatItems.map(item => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{item.name}</div>
                      {item.mods.length > 0 && (
                        <div className="text-[10px] text-amber-400 font-mono">{item.mods.join(', ')}</div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-white">${item.price.toFixed(2)}</span>
                  </div>
                ))}

                {sharedItems.length > 0 && (
                  <div className="py-2 flex items-center justify-between bg-[#111215]/50 px-2 rounded-lg my-1">
                    <div>
                      <div className="font-semibold text-[#c29b68] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Shared Appetizers ({sharedItems.length} items split {seatCount} ways)</span>
                      </div>
                      <div className="text-[10px] text-[#9ca3af]">
                        {sharedItems.map(i => i.name).join(', ')}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#c29b68]">+${sharedPerSeat.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Tip Selector */}
              <div className="pt-2 border-t border-[#262a34] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#9ca3af] font-mono">
                  <span>Add Server Gratuity:</span>
                  <span className="text-emerald-400 font-bold">${tipAmount.toFixed(2)} ({selectedTipPct}%)</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                  {[18, 20, 22, 25].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setSelectedTipPct(pct)}
                      className={`py-1.5 rounded-lg border text-center transition font-bold ${
                        selectedTipPct === pct
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-[#111215] border-[#262a34] text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtotal, Tax, Final Math */}
              <div className="pt-2 border-t border-[#262a34] font-mono text-xs space-y-1">
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Subtotal</span>
                  <span>${seatSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Lakewood Tax (8.25%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Tip</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#262a34] pt-2 flex justify-between font-black text-white text-base">
                  <span>Seat {selectedSeat} Total</span>
                  <span className="text-[#c29b68]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Instant 1-Tap Payment Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setPaymentMethod('Apple Pay');
                    handlePayNow();
                  }}
                  className="w-full py-3 bg-white hover:bg-gray-100 text-black font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span className="text-base font-black">Pay</span>
                  <span>• Pay ${finalTotal.toFixed(2)}</span>
                </button>

                <button
                  onClick={() => {
                    setPaymentMethod('Card');
                    handlePayNow();
                  }}
                  className="w-full py-2.5 bg-[#262a34] hover:bg-[#323846] text-white font-bold text-xs rounded-xl border border-white/10 transition flex items-center justify-center gap-2 font-mono"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with Credit / Corporate Amex</span>
                </button>
              </div>
            </div>

            {/* Back to Home link */}
            <div className="text-center pt-2">
              <Link 
                href="/" 
                className="text-[11px] font-mono text-[#9ca3af] hover:text-[#c29b68] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Switch to Floor POS / KDS Terminal</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
