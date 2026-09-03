import Link from "next/link";
import { Truck, LayoutDashboard, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#0b192c] via-[#060d17] to-black text-white">
      <div className="max-w-2xl w-full text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Yorkstead Systems • Live Dual-Screen Prototype</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Rework<span className="text-[#d4af37]">Flow</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Denver Express Warehousing & Cross-Docking Terminal Engine
          </p>
          <p className="text-xs text-slate-400">
            6030 Washington St, Ste 130, Denver, CO • I-25 & I-70 Crossroads
          </p>
        </div>

        {/* Dual Screen Demo Instructions Box */}
        <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 text-left space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
            <ShieldCheck className="w-4 h-4" />
            <span>How to Run the Two-Device Live Pitch:</span>
          </div>
          <ol className="text-xs sm:text-sm text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              Keep your <strong>Laptop</strong> open on this site at{" "}
              <code className="bg-[#162b45] px-1.5 py-0.5 rounded text-[#d4af37] font-mono">/office</code> (the Billing Board).
            </li>
            <li>
              Open this same site on your <strong>Smartphone</strong> at{" "}
              <code className="bg-[#162b45] px-1.5 py-0.5 rounded text-[#d4af37] font-mono">/dock</code> (the Forklift Operator View).
            </li>
            <li>
              Complete an emergency shifted-pallet job on your phone.
            </li>
            <li>
              <strong>Instant result:</strong> Your laptop will automatically play a confirmation chime, update the daily revenue ticker, and display the completed job with Before/After photos and the driver’s digital signature!
            </li>
          </ol>
        </div>

        {/* Two Big Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* Card 1: Dock Phone View */}
          <Link
            href="/dock"
            className="group relative flex flex-col items-center justify-between p-6 rounded-2xl bg-[#162b45] border-2 border-[#233f63] hover:border-[#d4af37] transition-all hover:scale-[1.02] shadow-lg text-left"
          >
            <div className="w-full flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0b192c] text-emerald-400 font-bold border border-[#233f63]">
                Phone / Tablet
              </span>
            </div>
            <div className="w-full">
              <h2 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition flex items-center justify-between">
                <span>Forklift Operator View</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#d4af37] group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                2-minute dock intake, before/after camera capture, supply tally, and driver glass signature.
              </p>
            </div>
          </Link>

          {/* Card 2: Office Laptop View */}
          <Link
            href="/office"
            className="group relative flex flex-col items-center justify-between p-6 rounded-2xl bg-[#162b45] border-2 border-[#233f63] hover:border-[#d4af37] transition-all hover:scale-[1.02] shadow-lg text-left"
          >
            <div className="w-full flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0b192c] text-blue-400 font-bold border border-[#233f63]">
                Laptop / Desktop
              </span>
            </div>
            <div className="w-full">
              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition flex items-center justify-between">
                <span>Office Billing Board</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time bay occupancy, live revenue ticker, instant PDF certificate preview, and QuickBooks export.
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="pt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>Denver Express Terminal • 6030 Washington St</span>
          <span>•</span>
          <span>USDOT: 4514095</span>
          <span>•</span>
          <span className="text-[#d4af37]">Yorkstead Systems</span>
        </div>

      </div>
    </main>
  );
}
