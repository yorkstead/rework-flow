'use client';

import React, { useState } from 'react';
import { Header, ActiveTab } from '../components/Header';
import { PitchToolbar } from '../components/PitchToolbar';
import { FloorMap } from '../components/FloorMap';
import { TerminalPOS } from '../components/TerminalPOS';
import { SplitCheckView } from '../components/SplitCheckView';
import { KitchenKDS } from '../components/KitchenKDS';
import { PrivateDiningView } from '../components/PrivateDiningView';
import { useUnionStore } from '../lib/store/useUnionStore';
import { Columns2, Monitor, Smartphone, Flame, Utensils, Sparkles, ExternalLink } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('floor');
  const [dualViewMode, setDualViewMode] = useState<boolean>(false);
  const { setActiveTableId } = useUnionStore();

  const handleOpenPOS = (tableId: string) => {
    setActiveTableId(tableId);
    setActiveTab('pos');
  };

  const handleOpenSplit = (tableId: string) => {
    setActiveTableId(tableId);
    setActiveTab('split');
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#111215] text-[#e2e4ea] max-w-full overflow-x-hidden">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <PitchToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dualViewMode={dualViewMode}
        setDualViewMode={setDualViewMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 pb-16 max-w-full overflow-x-hidden">
        {dualViewMode ? (
          /* Live Dual-Screen Pitch Mode: POS on Left, Kitchen KDS on Right */
          <div className="p-2 grid grid-cols-1 xl:grid-cols-2 gap-3 h-[calc(100vh-80px)]">
            <div className="border border-[#262a34] rounded-2xl overflow-hidden flex flex-col bg-[#16181d]">
              <div className="px-3 py-1.5 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between text-xs font-bold text-[#c29b68]">
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#c29b68]" />
                  SURFACE A: FLOOR POS TERMINAL (TABLE T23)
                </span>
                <span className="font-mono text-[10px] text-[#9ca3af]">SERVER: MARCUS T.</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <TerminalPOS onOpenSplit={handleOpenSplit} />
              </div>
            </div>

            <div className="border border-[#262a34] rounded-2xl overflow-hidden flex flex-col bg-[#16181d]">
              <div className="px-3 py-1.5 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  SURFACE B: 60-FT OPEN KITCHEN KDS (EXPO PASS)
                </span>
                <span className="font-mono text-[10px] text-[#9ca3af]">LINE SYNC: 0ms</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <KitchenKDS />
              </div>
            </div>
          </div>
        ) : (
          /* Normal Single Screen View */
          <>
            {activeTab === 'floor' && (
              <FloorMap
                onOpenPOS={handleOpenPOS}
                onOpenSplit={handleOpenSplit}
              />
            )}

            {activeTab === 'pos' && (
              <TerminalPOS onOpenSplit={handleOpenSplit} />
            )}

            {activeTab === 'split' && (
              <SplitCheckView
                onBackToFloor={() => setActiveTab('floor')}
                onBackToPOS={() => setActiveTab('pos')}
              />
            )}

            {activeTab === 'kds' && (
              <KitchenKDS />
            )}

            {activeTab === 'events' && (
              <PrivateDiningView />
            )}
          </>
        )}
      </div>

      {/* Floating Pitch Demonstration Switcher */}
      <div className="fixed bottom-3 right-4 z-40 flex items-center gap-2 bg-[#16181d]/95 backdrop-blur-md p-1.5 rounded-xl border border-[#262a34] shadow-2xl">
        <button
          onClick={() => setDualViewMode(!dualViewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
            dualViewMode
              ? 'bg-[#c29b68] text-[#0c0d10] font-black shadow-md'
              : 'bg-[#111215] text-[#e2e4ea] hover:bg-[#1a1d24] border border-[#262a34]'
          }`}
        >
          <Columns2 className="w-3.5 h-3.5 text-[#c29b68]" />
          <span>{dualViewMode ? 'Exit Dual Demo' : 'Simulate Dual-Screen (POS + KDS)'}</span>
        </button>
      </div>
    </main>
  );
}
