'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { UnionReelComposition, TOTAL_REEL_FRAMES } from '@/remotion/scenes/UnionReelComposition';
import { ArrowLeft, Play, Download, Smartphone, Share2, Sparkles, Film, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Dynamically import Remotion Player to prevent SSR issues
const Player = dynamic(
  () => import('@remotion/player').then((mod) => mod.Player),
  { ssr: false }
);

export default function VideoPitchPage() {
  return (
    <main className="min-h-screen bg-[#0c0d10] text-[#e2e4ea] p-4 sm:p-8 flex flex-col items-center">
      {/* Top navigation */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-mono text-[#9ca3af] hover:text-[#e2e4ea] bg-[#16181d] px-3.5 py-2 rounded-xl border border-[#262a34] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live POS Appliance</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-[#16181d] text-[#c29b68] px-3 py-1.5 rounded-lg border border-[#c29b68]/40 font-bold uppercase">
            9:16 Vertical Reel (1080x1920)
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Phone Frame with Live Remotion Player */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-[320px] h-[570px] sm:w-[360px] sm:h-[640px] bg-[#16181d] rounded-[44px] p-3 border-4 border-[#262a34] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Phone Notch */}
            <div className="w-28 h-4 bg-[#0c0d10] rounded-b-xl mx-auto mb-2 z-20 shrink-0"></div>

            {/* Video Player */}
            <div className="flex-1 rounded-[32px] overflow-hidden bg-black relative">
              <Player
                component={UnionReelComposition}
                durationInFrames={TOTAL_REEL_FRAMES}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                controls
                autoPlay
                loop
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Phone Home Bar */}
            <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2 shrink-0"></div>
          </div>
          <span className="text-[11px] font-mono text-[#9ca3af] mt-3">
            Previewing: 15s High-Conversion Lakewood Pitch Reel
          </span>
        </div>

        {/* Right 7 Cols: Context, Teleprompter & Pitch Instructions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#16181d] border border-[#262a34] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c29b68] uppercase tracking-wider">
              <Film className="w-4 h-4" />
              <span>Programmatic Marketing & Pitch Asset</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              240 Union 15-Second Fed Center Commercial
            </h1>

            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Show this directly to Michael or the general manager on your phone during your meeting, or post it to 240 Union’s Instagram/TikTok targeting the Denver Federal Center and St. Anthony Hospital staff.
            </p>

            {/* Breakdown Timeline */}
            <div className="border-t border-[#262a34] pt-4 space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold shrink-0">
                  0:00 - 0:03
                </span>
                <div>
                  <div className="font-bold text-white">The Lunch Problem Hook</div>
                  <div className="text-[#9ca3af] text-[11px]">"Got 45 minutes for lunch near Denver Fed Center?"</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold shrink-0">
                  0:04 - 0:08
                </span>
                <div>
                  <div className="font-bold text-white">The 60-ft Open Kitchen Pass</div>
                  <div className="text-[#9ca3af] text-[11px]">Ribeyes, bass, and hearth pizzas fired in 11 minutes flat.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold shrink-0">
                  0:08 - 0:12
                </span>
                <div>
                  <div className="font-bold text-white">The 1-Tap Apple Pay Split Check</div>
                  <div className="text-[#9ca3af] text-[11px]">Split checks on phone. In and out before 1:00 PM briefing.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold shrink-0">
                  0:12 - 0:15
                </span>
                <div>
                  <div className="font-bold text-white">The Call To Action</div>
                  <div className="text-[#9ca3af] text-[11px]">14-day zero-risk trial. 240.yorkstead.com.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#111215] border border-[#262a34] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">Looking for the Printable Brief?</div>
              <div className="text-[11px] text-[#9ca3af]">Pair this video with the 8.5"x11" Executive Leave-Behind PDF.</div>
            </div>
            <Link
              href="/leave-behind"
              className="px-4 py-2 bg-[#c29b68] hover:bg-[#d4b07d] text-black font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 shrink-0"
            >
              <span>View 1-Page PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
