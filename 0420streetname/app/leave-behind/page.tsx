'use client';

import React from 'react';
import { 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function LeaveBehindPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#111215] print:bg-white print:text-black py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between print:hidden">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-mono text-[#9ca3af] hover:text-[#e2e4ea] bg-[#16181d] px-3.5 py-2 rounded-xl border border-[#262a34] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live POS Appliance</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#9ca3af] hidden sm:inline">
            Print layout formatted for 8.5" x 11" Executive Brief
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-[#c29b68] hover:bg-[#d6b07c] text-black font-bold text-xs rounded-xl shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive 1-Pager (PDF)</span>
          </button>
        </div>
      </div>

      {/* The Printable 8.5 x 11 Leaflet Document */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full print:rounded-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-black pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-black text-[#c29b68] font-serif font-black text-2xl flex items-center justify-center rounded-lg">
                240
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight uppercase text-black">
                  240 Union Restaurant Operating System
                </h1>
                <p className="text-xs font-mono tracking-wider text-gray-600 uppercase font-semibold">
                  Executive Brief • Toast Independence Audit & Zero-Risk Pilot Agreement
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Prepared for: <strong>Michael & Management Team</strong> • 240 Union Blvd, Lakewood, CO 80228
            </p>
          </div>

          <div className="text-right">
            <div className="inline-block bg-emerald-50 border border-emerald-600 text-emerald-800 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded">
              Zero-Risk In-Restaurant Trial
            </div>
            <div className="text-[11px] font-mono text-gray-500 mt-1">
              Target Launch: September 2026
            </div>
          </div>
        </div>

        {/* Section 1: The 5-Year Financial Recovery Audit vs Toast */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black uppercase tracking-wider font-mono text-black flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              1. 5-Year Financial Recovery Audit (Vs. Toast SaaS Tolls)
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              +$261,300 Direct To Bottom Line
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
            <div className="border-r border-gray-200 pr-2">
              <div className="text-[11px] font-mono uppercase text-gray-600 font-bold">Toast Software SaaS Eliminated</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-black mt-1">$14,400<span className="text-xs text-gray-500 font-normal">/yr</span></div>
              <p className="text-[10px] text-gray-500 mt-0.5">Terminal licenses ($125/mo) + KDS, gift card, & add-on module tolls.</p>
            </div>
            <div className="border-r border-gray-200 pr-2">
              <div className="text-[11px] font-mono uppercase text-gray-600 font-bold">Interchange-Plus Card Margins</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 mt-1">+$37,860<span className="text-xs text-gray-500 font-normal">/yr</span></div>
              <p className="text-[10px] text-gray-500 mt-0.5">1.05% processing spread clawed back from Toast flat rates on $3.6M gross.</p>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-gray-600 font-bold">5-Year Capital Recovered</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-black mt-1">$261,300</div>
              <p className="text-[10px] text-gray-500 mt-0.5">100% retained on local balance sheet instead of Toast shareholder dividends.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Lakewood & 240 Union Operational Superpowers */}
        <div className="mt-6">
          <h2 className="text-sm font-black uppercase tracking-wider font-mono text-black flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            2. Solving 240 Union’s 3 Biggest Operational Friction Points
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black font-serif">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Denver Fed Center Rush</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                1-tap seat auto-splitting with proportional shared flatbread math. Eliminates 15-minute terminal gridlock for 1:00 PM briefing deadlines.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black font-serif">
                <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>60-ft Open Kitchen Pass</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                Expo coursing engine. Line cooks and wood oven see apps vs entrees fire simultaneously; single-tap bumper with synchronized expo audio chime.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black font-serif">
                <Lock className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>Wine Room Depletion</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                Sommelier live cellar tracking. Pulling a Silver Oak or Caymus decrements bin stock on the fly with contract minimum spend meters ($2,200).
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: The Zero-Risk 14-Day Pilot Agreement */}
        <div className="mt-6 border-2 border-black rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black uppercase tracking-wider font-mono text-black flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              3. The "Hate It & Owe $0.00" Pilot Agreement
            </h2>
            <span className="text-[10px] font-mono uppercase bg-black text-white font-bold px-2 py-0.5 rounded">
              14-Day Shift Trial
            </span>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed font-serif">
            We will deploy and configure UnionOS side-by-side on your floor terminals for 14 consecutive days. Your team tests the speed-split checks and kitchen coursing during live lunch and dinner service.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-300 text-[11px]">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Immutable Audit Ledger:</strong> Cryptographic SHA-256 block hash on every ticket and dollar so Toast and your bookkeeper match 100%.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Zero Disruption Rollback:</strong> Toast hardware remains plugged in and on standby at your host stand. Zero lock-in.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
              <span><strong>$0.00 Risk:</strong> If your servers or kitchen do not enthusiastically prefer it after 14 days, you owe literally zero dollars.</span>
            </div>
          </div>
        </div>

        {/* Section 4: Acceptance & Signature Block */}
        <div className="mt-6 pt-5 border-t-2 border-gray-300">
          <div className="grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <div className="text-gray-500 uppercase text-[10px] font-bold">Authorized By (240 Union Restaurant):</div>
              <div className="mt-6 border-b border-black pb-1 flex items-end justify-between">
                <span className="text-gray-400 font-sans italic">Michael / General Manager</span>
                <span className="text-[10px] text-gray-500">Date: ____/____/2026</span>
              </div>
            </div>

            <div>
              <div className="text-gray-500 uppercase text-[10px] font-bold">Implementation & Technology Partner:</div>
              <div className="mt-6 border-b border-black pb-1 flex items-end justify-between">
                <span className="text-black font-sans font-bold">Yorkstead Systems</span>
                <span className="text-[10px] text-gray-500">pilot@yorkstead.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="mt-6 pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>Live Interactive Demo Appliance: <strong>https://240.yorkstead.com</strong></span>
          <span>Phone: (303) 989-3562 • 240 Union Blvd, Lakewood, CO</span>
        </div>

      </div>
    </div>
  );
}
