import React from 'react';
import { 
  AbsoluteFill, 
  interpolate, 
  spring, 
  useCurrentFrame, 
  useVideoConfig,
  Img
} from 'remotion';

export const SCENE_DURATIONS = {
  HOOK: 90,       // 0-3s: Fed Center 45-min lunch problem
  KITCHEN: 150,   // 3-8s: 60-ft open kitchen line & wood-fired pass
  SPLIT_PAY: 120, // 8-12s: 1-tap phone split check & Apple Pay
  CTA: 90         // 12-15s: $0 Risk 14-day trial & URL
};

export const TOTAL_REEL_FRAMES = 450; // 15 seconds at 30fps

export const UnionReelComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 1: 0 to 90 frames (0 - 3 sec)
  if (frame < SCENE_DURATIONS.HOOK) {
    const hookFrame = frame;
    const scale = interpolate(hookFrame, [0, 90], [1.0, 1.12]);
    const textOpacity = interpolate(hookFrame, [0, 15, 75, 90], [0, 1, 1, 0]);
    const badgeSlide = spring({ frame: hookFrame, fps, config: { damping: 12 } });

    return (
      <AbsoluteFill className="bg-[#0c0d10] flex flex-col justify-between p-12 text-white font-sans overflow-hidden">
        {/* Background photo with subtle zoom */}
        <AbsoluteFill style={{ transform: `scale(${scale})` }} className="opacity-45">
          <Img src="/dish-ribeye.jpg" className="w-full h-full object-cover" />
        </AbsoluteFill>
        <AbsoluteFill className="bg-gradient-to-t from-black via-black/40 to-black/80" />

        {/* Top Header */}
        <div 
          style={{ transform: `translateY(${interpolate(badgeSlide, [0, 1], [-50, 0])}px)` }}
          className="relative z-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#c29b68] text-black font-serif font-black flex items-center justify-center text-2xl shadow-lg">
              240
            </div>
            <div>
              <div className="font-serif font-black text-xl tracking-widest uppercase text-white">
                240 UNION
              </div>
              <div className="text-xs font-mono text-[#c29b68] uppercase font-bold">
                Lakewood, Colorado
              </div>
            </div>
          </div>
          <div className="bg-rose-500/20 border border-rose-500 text-rose-300 font-mono text-xs uppercase px-3 py-1 rounded-full font-bold">
            12:15 PM RUSH
          </div>
        </div>

        {/* Central Hook */}
        <div style={{ opacity: textOpacity }} className="relative z-10 text-center space-y-4 my-auto">
          <div className="inline-block bg-[#111215]/90 border border-[#c29b68]/60 px-4 py-1.5 rounded-full text-sm font-mono text-[#c29b68] uppercase font-bold tracking-wider">
            Denver Federal Center Challenge
          </div>
          <h1 className="text-5xl font-black font-serif tracking-tight leading-tight text-white drop-shadow-2xl">
            Got 45 Minutes<br />
            <span className="text-[#c29b68]">For Lunch?</span>
          </h1>
          <p className="text-lg text-gray-300 font-serif max-w-xs mx-auto leading-relaxed">
            When 6 coworkers sit down with a 1:00 PM briefing deadline...
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="relative z-10 text-center font-mono text-xs text-gray-400">
          SWIPE / WATCH HOW IT WORKS ▼
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 2: 90 to 240 frames (3 - 8 sec)
  if (frame < SCENE_DURATIONS.HOOK + SCENE_DURATIONS.KITCHEN) {
    const kitchenFrame = frame - SCENE_DURATIONS.HOOK;
    const photoPan = interpolate(kitchenFrame, [0, 150], [1.05, 1.18]);
    const ticketSpring = spring({ frame: kitchenFrame, fps, config: { damping: 14 } });

    return (
      <AbsoluteFill className="bg-[#0c0d10] flex flex-col justify-between p-12 text-white font-sans overflow-hidden">
        <AbsoluteFill style={{ transform: `scale(${photoPan})` }} className="opacity-40">
          <Img src="/dish-pizza.jpg" className="w-full h-full object-cover" />
        </AbsoluteFill>
        <AbsoluteFill className="bg-gradient-to-t from-black via-black/50 to-black/70" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-sm text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/40">
            <span>🔥 60-FT EXHIBITION KITCHEN PASS</span>
          </div>
          <div className="font-mono text-xs text-gray-400 bg-black/60 px-3 py-1 rounded-md">
            11 MIN TURNAROUND
          </div>
        </div>

        {/* Center Mock Ticket Animation */}
        <div 
          style={{ transform: `scale(${interpolate(ticketSpring, [0, 1], [0.85, 1])})` }}
          className="relative z-10 my-auto bg-[#16181d]/95 border-2 border-amber-500/70 rounded-2xl p-6 shadow-2xl space-y-4 max-w-sm mx-auto backdrop-blur-md"
        >
          <div className="flex justify-between items-center border-b border-[#262a34] pb-2 text-xs font-mono">
            <span className="text-white font-bold">TABLE T23 (6-TOP)</span>
            <span className="text-amber-400 animate-pulse">COURSED & FIRED</span>
          </div>

          <div className="space-y-2 text-sm font-serif">
            <div className="flex justify-between items-center text-white">
              <span>2x Wood-Fired Prime Ribeye</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">GRILL</span>
            </div>
            <div className="flex justify-between items-center text-white">
              <span>2x Colorado Striped Bass</span>
              <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/40">SAUTE</span>
            </div>
            <div className="flex justify-between items-center text-white">
              <span>2x Prosciutto Wood-Fired Pizza</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">WOOD HEARTH</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#262a34] flex items-center justify-between text-xs font-mono text-[#c29b68]">
            <span>Zero server ticket delay</span>
            <span className="font-bold">1-TAP EXPO BUMP</span>
          </div>
        </div>

        {/* Subtext */}
        <div className="relative z-10 text-center">
          <h3 className="text-2xl font-bold font-serif text-white">
            Simultaneous 6-Entree Firing
          </h3>
          <p className="text-xs text-gray-300 font-mono mt-1">
            Plated and delivered before the 20-minute mark.
          </p>
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 3: 240 to 360 frames (8 - 12 sec)
  if (frame < SCENE_DURATIONS.HOOK + SCENE_DURATIONS.KITCHEN + SCENE_DURATIONS.SPLIT_PAY) {
    const payFrame = frame - (SCENE_DURATIONS.HOOK + SCENE_DURATIONS.KITCHEN);
    const checkSpring = spring({ frame: payFrame, fps, config: { damping: 15 } });

    return (
      <AbsoluteFill className="bg-[#0c0d10] flex flex-col justify-between p-12 text-white font-sans overflow-hidden">
        <AbsoluteFill className="bg-gradient-to-b from-[#111215] via-[#16181d] to-[#0c0d10]" />

        {/* Header */}
        <div className="relative z-10 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
            THE 1-TAP CHECK SPLIT
          </span>
          <h2 className="text-3xl font-black font-serif text-white mt-2">
            No Waiting 15 Mins For Checks
          </h2>
        </div>

        {/* Mobile Phone Simulation Card */}
        <div 
          style={{ transform: `scale(${interpolate(checkSpring, [0, 1], [0.8, 1])})` }}
          className="relative z-10 my-auto w-full max-w-sm mx-auto bg-[#16181d] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="flex justify-between items-center border-b border-[#262a34] pb-2">
            <span className="font-serif text-sm font-bold text-white">240.YORKSTEAD.COM/TABLE/23</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded">APPLE PAY READY</span>
          </div>

          <div className="bg-[#111215] p-3 rounded-xl border border-[#262a34] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white font-serif">Seat 3 Check Summary</div>
              <div className="text-[11px] text-gray-400">Prime Ribeye + 1/6 Flatbread Share</div>
            </div>
            <div className="text-right font-mono font-bold text-base text-[#c29b68]">
              $58.75
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl text-black font-bold text-center text-sm flex items-center justify-center gap-2 shadow-lg">
            <span className="text-lg font-black">Pay</span>
            <span>• Tap to Pay & Leave</span>
          </div>

          <p className="text-[10px] text-center text-gray-400 font-mono">
            Direct table settlement • Toast & bookkeeping audit reconciled
          </p>
        </div>

        <div className="relative z-10 text-center font-serif text-sm text-gray-300">
          Guests split checks on their phones and make their 1:00 PM briefing.
        </div>
      </AbsoluteFill>
    );
  }

  // Scene 4: 360 to 450 frames (12 - 15 sec)
  const ctaFrame = frame - (SCENE_DURATIONS.HOOK + SCENE_DURATIONS.KITCHEN + SCENE_DURATIONS.SPLIT_PAY);
  const ctaScale = spring({ frame: ctaFrame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill className="bg-[#0c0d10] flex flex-col justify-between p-12 text-white font-sans text-center overflow-hidden">
      <AbsoluteFill className="bg-gradient-to-t from-black via-[#16181d] to-[#111215]" />

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-[#c29b68] text-black font-serif font-black flex items-center justify-center text-3xl mx-auto shadow-2xl mb-3">
          240
        </div>
        <h2 className="text-3xl font-black font-serif uppercase tracking-widest text-white">
          240 UNION
        </h2>
        <p className="text-xs font-mono text-[#c29b68] mt-1 uppercase font-bold">
          Lakewood Contemporary American Grill
        </p>
      </div>

      <div 
        style={{ transform: `scale(${interpolate(ctaScale, [0, 1], [0.8, 1])})` }}
        className="relative z-10 my-auto bg-[#16181d] border-2 border-[#c29b68] rounded-2xl p-6 max-w-sm mx-auto shadow-2xl space-y-3"
      >
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
          Zero-Risk Pilot Offer
        </div>
        <div className="text-2xl font-black font-serif text-white">
          14 Days Free In 240 Union
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-serif">
          If your servers and kitchen don’t love it, unplug it and owe $0.00. Reclaims $260,000+ from Toast SaaS tolls.
        </p>
        <div className="pt-2">
          <span className="font-mono text-sm font-black text-black bg-[#c29b68] px-4 py-1.5 rounded-lg inline-block shadow">
            240.YORKSTEAD.COM
          </span>
        </div>
      </div>

      <div className="relative z-10 text-xs font-mono text-gray-400">
        Engineered for 240 Union Blvd, Lakewood CO
      </div>
    </AbsoluteFill>
  );
};
