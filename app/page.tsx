import Link from "next/link";
import { Truck, LayoutDashboard, ArrowRight, ShieldCheck, Zap, Video } from "lucide-react";

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
            <span>How to Run the 4-Step Live Pitch Demo:</span>
          </div>
          <ol className="text-xs sm:text-sm text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              <strong>Start with Google Maps:</strong> Open{" "}
              <code className="bg-[#162b45] px-1.5 py-0.5 rounded text-[#d4af37] font-mono">/maps</code> on your phone. Show Steve & Dale how a driver searching <em>&quot;pallet rework near me&quot;</em> on I-70 sees Denver Express with an exclusive <strong>&quot;⚡ Reserve Dock Bay & Instant Quote&quot;</strong> button while competitors have nothing.
            </li>
            <li>
              <strong>The Highway Lock-In:</strong> Tap that button into{" "}
              <code className="bg-[#162b45] px-1.5 py-0.5 rounded text-[#d4af37] font-mono">/reserve</code>. Pick 8 shifted pallets, see the instant $450–$550 estimate, and hold <strong>Bay 2</strong> with a 30m countdown.
            </li>
            <li>
              <strong>The Office Board Alert:</strong> Keep your <strong>Laptop</strong> open at{" "}
              <code className="bg-[#162b45] px-1.5 py-0.5 rounded text-[#d4af37] font-mono">/office</code>. Hear the instant chime as Bay 2 turns amber with the incoming trailer.
            </li>
            <li>
              <strong>The 90-Second Dock Finish:</strong> Open{" "}
              <code className="bg-[#162b45] px-1.5 py-0.5 rounded text-[#d4af37] font-mono">/dock</code>. Tap &quot;Check In&quot;, log materials, collect the driver&apos;s glass signature, and dispatch. Watch the laptop immediately chime with the completed $482.50 invoice and signed PDF certificate!
            </li>
          </ol>
        </div>

        {/* Hero Entry Card: Google Maps Lead Generator */}
        <div className="pt-2">
          <Link
            href="/maps"
            className="group relative flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#1c2e4a] via-[#162b45] to-[#0f2238] border-2 border-amber-500/60 hover:border-[#d4af37] transition-all hover:scale-[1.01] shadow-xl text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Step 0 • The Acquisition Hook
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Interactive Simulation
                  </span>
                </div>
                <h2 className="text-lg font-black text-white group-hover:text-[#d4af37] transition mt-1">
                  Google Maps Driver Discovery Screen
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Simulate a stranded driver searching I-70, finding Denver Express at 6030 Washington, and tapping the exclusive appointment button.
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition shrink-0 ml-4" />
          </Link>

          {/* Card: Commercial & Video Pitch */}
          <Link
            href="/commercial"
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#142338] via-[#102a45] to-[#142338] border-2 border-sky-500/40 hover:border-sky-400 transition-all hover:scale-[1.01] shadow-xl text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 font-bold border border-sky-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                    Remotion Studio
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 font-bold border border-amber-500/30">
                    60s Video Pitch
                  </span>
                </div>
                <h2 className="text-lg font-black text-white group-hover:text-sky-300 transition mt-1">
                  Commercial & Video Pitch Presentation
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Remotion-powered programmatic commercial with synchronized voiceover teleprompter and 1080p MP4 export.
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-sky-400 group-hover:translate-x-1 transition shrink-0 ml-4" />
          </Link>
        </div>

        {/* Three Operational Views */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          
          {/* Card 1: Trucker Reservation */}
          <Link
            href="/reserve"
            className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-[#162b45] border-2 border-[#233f63] hover:border-[#d4af37] transition-all hover:scale-[1.02] shadow-lg text-left"
          >
            <div className="w-full flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0b192c] text-amber-400 font-bold border border-[#233f63]">
                1. Driver Intake
              </span>
            </div>
            <div className="w-full">
              <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition flex items-center justify-between">
                <span>Trucker Bay Reserve</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Instant rate estimate, 45-minute dock bay hold, and turn-by-turn routing directly from I-70.
              </p>
            </div>
          </Link>

          {/* Card 2: Dock Phone View */}
          <Link
            href="/dock"
            className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-[#162b45] border-2 border-[#233f63] hover:border-[#d4af37] transition-all hover:scale-[1.02] shadow-lg text-left"
          >
            <div className="w-full flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0b192c] text-emerald-400 font-bold border border-[#233f63]">
                2. Forklift Tech
              </span>
            </div>
            <div className="w-full">
              <h2 className="text-base font-bold text-white group-hover:text-[#d4af37] transition flex items-center justify-between">
                <span>Dock Operator</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#d4af37] group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Incoming reservation intake, camera photos, supply tracking, and digital driver sign-off.
              </p>
            </div>
          </Link>

          {/* Card 3: Office Laptop View */}
          <Link
            href="/office"
            className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-[#162b45] border-2 border-[#233f63] hover:border-[#d4af37] transition-all hover:scale-[1.02] shadow-lg text-left"
          >
            <div className="w-full flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0b192c] text-blue-400 font-bold border border-[#233f63]">
                3. Office Dispatch
              </span>
            </div>
            <div className="w-full">
              <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition flex items-center justify-between">
                <span>Billing & Board</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time audio chime, live bay monitor, PDF certificate generation, and QuickBooks export.
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
