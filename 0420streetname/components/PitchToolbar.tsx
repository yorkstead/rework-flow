'use client';

import React, { useState } from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { ActiveTab } from './Header';
import { 
  Zap, 
  Flame, 
  Wine, 
  DollarSign, 
  Smartphone, 
  Columns2, 
  Play, 
  CheckCircle,
  Volume2
} from 'lucide-react';
import { RoiCalculatorModal } from './RoiCalculatorModal';
import { QRCodeModal } from './QRCodeModal';
import { sound } from '../lib/audio';

interface PitchToolbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  dualViewMode: boolean;
  setDualViewMode: (val: boolean) => void;
}

export const PitchToolbar: React.FC<PitchToolbarProps> = ({
  activeTab,
  setActiveTab,
  dualViewMode,
  setDualViewMode,
}) => {
  const { 
    setActiveTableId, 
    autoSplitBySeat, 
    fireCourse, 
    settleCheck, 
    orders, 
    decrementCellar 
  } = useUnionStore();

  const [roiModalOpen, setRoiModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeScenarioName, setActiveScenarioName] = useState<string | null>(null);

  // Scenario 1: Fed Center Lunch Rush (1-tap speed split & settle)
  const runFedCenterRush = () => {
    setActiveScenarioName('Running: 12:15 PM Fed Center Lunch Rush...');
    setDualViewMode(false);
    setActiveTableId('tbl-23');
    setActiveTab('split');
    sound.playPaymentSettled();

    setTimeout(() => {
      autoSplitBySeat('tbl-23');
      // Settle 2 checks right away
      const ord = orders.find(o => o.tableId === 'tbl-23');
      if (ord && ord.splitChecks) {
        if (ord.splitChecks[0]) settleCheck('tbl-23', ord.splitChecks[0].id, 'Corporate Amex');
        if (ord.splitChecks[1]) settleCheck('tbl-23', ord.splitChecks[1].id, 'Corporate Amex');
      }
      setActiveScenarioName(null);
    }, 400);
  };

  // Scenario 2: Coursing & Kitchen Firing Rush
  const runKitchenCoursingRush = () => {
    setActiveScenarioName('Running: 60-ft Open Kitchen Coursing Rush...');
    setActiveTableId('tbl-21');
    setDualViewMode(true);
    sound.playKitchenFire();

    setTimeout(() => {
      fireCourse('tbl-21', 3); // Fire Entrees
      setActiveScenarioName(null);
    }, 500);
  };

  // Scenario 3: Private Wine Room Buyout & Cellar 86
  const runWineRoomBuyout = () => {
    setActiveScenarioName('Running: Wine Room Event & Cellar Depletion...');
    setDualViewMode(false);
    setActiveTab('events');
    setActiveTableId('tbl-wr1');
    sound.playPaymentSettled();

    // Decrement cellar bottle to simulate sommelier depletion
    decrementCellar('wine-silver-oak');

    setTimeout(() => {
      setActiveScenarioName(null);
    }, 400);
  };

  // Scenario 4: "Save-A-Ho" Pocket POS • Server Out Smoking & Fired T12
  const runPocketSavior = () => {
    setActiveScenarioName('🚬 Out back smoking... "SHIT, TABLE 12!" -> Fired from pocket in 3s');
    setActiveTableId('tbl-12');
    setDualViewMode(false);
    setActiveTab('pos');
    sound.playKitchenFire();

    setTimeout(() => {
      // Fire apps for Table 12 instantly from pocket phone
      fireCourse('tbl-12', 1);
      setTimeout(() => {
        setActiveScenarioName(null);
      }, 2500);
    }, 600);
  };

  return (
    <>
      <aside aria-label="Interactive Demo Scenarios" className="bg-[#111215] border-b border-[#262a34] px-3 py-1.5 shadow-md max-w-full overflow-hidden">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-full overflow-hidden">
          {/* Pitch Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c29b68] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c29b68]"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#e2e4ea] font-mono flex items-center gap-1">
              <Play className="w-3 h-3 fill-[#c29b68] text-[#c29b68]" />
              1-Click Pitch Scenarios:
            </span>
            {activeScenarioName && (
              <span className="text-[10px] text-[#e2e4ea] animate-pulse font-mono font-semibold bg-[#1a1d24] px-2 py-0.5 rounded border border-[#c29b68]/60 truncate max-w-[260px]">
                {activeScenarioName}
              </span>
            )}
          </div>

          {/* Quick Scenario Triggers */}
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-none flex items-center gap-1.5 pb-0.5 sm:pb-0 max-w-full">
            {/* The Signature "Save-A-Ho" Scenario Button */}
            <button
              onClick={runPocketSavior}
              className="px-2.5 py-1 bg-[#1e1724] hover:bg-[#281e31] text-[#f43f5e] border border-[#f43f5e]/50 rounded-lg text-xs font-black flex items-center gap-1.5 transition shadow-sm shrink-0 whitespace-nowrap animate-pulse"
              title="Pitch: Server is out back smoking, remembers Table 12, whips out phone and fires apps in 3 seconds flat"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#f43f5e]" />
              <span>🚬 Pocket Savior (T12 Smoke Break)</span>
            </button>

            <button
              onClick={runFedCenterRush}
              className="px-2.5 py-1 bg-[#16181d] hover:bg-[#1f232b] text-[#e2e4ea] border border-[#3b82f6]/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0 whitespace-nowrap"
              title="Demonstrate 1-tap 6-way split check for Denver Federal Center lunch"
            >
              <Zap className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>⚡ Fed Center Rush</span>
            </button>

            <button
              onClick={runKitchenCoursingRush}
              className="px-2.5 py-1 bg-[#16181d] hover:bg-[#1f232b] text-[#e2e4ea] border border-amber-500/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0 whitespace-nowrap"
              title="Demonstrate dual-screen open kitchen coursing and line station routing"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>🔥 60-ft Pass</span>
            </button>

            <button
              onClick={runWineRoomBuyout}
              className="px-2.5 py-1 bg-[#16181d] hover:bg-[#1f232b] text-[#e2e4ea] border border-[#c29b68]/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0 whitespace-nowrap"
              title="Demonstrate Wine Room $2,200 minimum meter and cellar bottle depletion"
            >
              <Wine className="w-3.5 h-3.5 text-[#c29b68]" />
              <span>🍷 Wine Room 86</span>
            </button>

            <div className="h-4 w-px bg-[#262a34] mx-0.5 shrink-0 hidden sm:block"></div>

            {/* ROI Calculator Trigger */}
            <button
              onClick={() => setRoiModalOpen(true)}
              className="px-2.5 py-1 bg-[#111e16] hover:bg-[#172b20] text-emerald-300 border border-emerald-500/60 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm shrink-0 whitespace-nowrap"
              title="Interactive 5-Year Savings Audit vs Toast"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>ROI ($260k+)</span>
            </button>

            {/* QR Phone Pairing */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-2.5 py-1 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] border border-[#262a34] rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap"
              title="Scan QR to control POS from your phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#c29b68]" />
              <span>QR Pair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <RoiCalculatorModal
        isOpen={roiModalOpen}
        onClose={() => setRoiModalOpen(false)}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        lanUrl="http://100.83.16.11:3005"
      />
    </>
  );
};
