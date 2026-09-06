'use client';

import React, { useState, useEffect } from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { 
  Flame, 
  UtensilsCrossed, 
  Receipt, 
  MonitorCheck, 
  Wine, 
  RotateCcw, 
  Wifi, 
  WifiOff,
  Clock, 
  UserCheck, 
  Sparkles,
  ChevronDown,
  FileSpreadsheet,
  Scale,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ZReportModal } from './ZReportModal';
import { ToastComparisonModal } from './ToastComparisonModal';
import { sound } from '../lib/audio';

export type ActiveTab = 'floor' | 'pos' | 'split' | 'kds' | 'events';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentServer, 
    setCurrentServer, 
    activeTable, 
    resetDemo, 
    orders,
    isOfflineSimulated,
    offlineQueueCount
  } = useUnionStore();

  const [timeStr, setTimeStr] = useState<string>('');
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false);
  const [zReportModalOpen, setZReportModalOpen] = useState(false);
  const [toastComparisonOpen, setToastComparisonOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(sound.isMuted);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const servers = ['Marcus T.', 'Sarah K.', 'David L.', 'Alex B. (Bar)', 'Elena R.'];

  const activeOrdersCount = orders.filter(o => o.status === 'open').length;

  return (
    <>
      <header className="border-b border-[#262a34] bg-[#111215]/95 backdrop-blur sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="px-3 py-1 bg-[#0c0d10] border-b border-[#1e222a] flex items-center justify-between text-xs text-[#9ca3af] max-w-full overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          {isOfflineSimulated ? (
            <div className="flex items-center gap-1.5 text-amber-400 font-mono shrink-0 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/50 animate-pulse">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold tracking-wider text-[11px]">COMCAST DOWN • LOCAL LAN APPLIANCE ACTIVE</span>
              {offlineQueueCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded ml-1">
                  {offlineQueueCount} queued
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold tracking-wider text-[11px] hidden sm:inline text-[#e2e4ea]">LOCAL-FIRST APPLIANCE • 0ms LAN</span>
              <span className="font-semibold tracking-wider text-[11px] sm:hidden text-[#e2e4ea]">0ms LAN</span>
            </div>
          )}
          <span className="text-[#262a34] hidden lg:inline">|</span>
          <span className="hidden lg:inline text-[#9ca3af] truncate font-serif italic">
            240 Union Blvd, Lakewood CO • American Grill & Wood-Fired Kitchen
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[#e2e4ea] bg-[#1a1d24] px-2 py-0.5 rounded border border-[#262a34] shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#c29b68]" />
            <span>{timeStr || '12:42:15 PM'} MT</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] rounded border border-[#262a34] transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#c29b68]" />
              <span className="font-medium">Server: {currentServer}</span>
              <ChevronDown className="w-3 h-3 text-[#9ca3af]" />
            </button>

            {serverDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[#16181d] border border-[#262a34] rounded-md shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#c29b68] border-b border-[#262a34]">
                  Switch Active Server
                </div>
                {servers.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setCurrentServer(s);
                      setServerDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#c29b68]/15 transition ${
                      currentServer === s ? 'text-[#e2e4ea] font-semibold bg-[#c29b68]/20' : 'text-[#9ca3af]'
                    }`}
                  >
                    <span>{s}</span>
                    {currentServer === s && <Sparkles className="w-3 h-3 text-[#c29b68]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setToastComparisonOpen(true)}
            title="Toast POS vs. UnionOS Total Cost of Ownership Audit"
            className="flex items-center gap-1.5 px-2.5 py-0.5 text-amber-300 hover:text-white bg-gradient-to-r from-amber-950/40 to-[#1a1d24] hover:bg-amber-900/50 rounded border border-amber-500/50 transition font-mono font-bold text-[11px] shadow-sm"
          >
            <Scale className="w-3.5 h-3.5 text-[#c29b68]" />
            <span className="hidden sm:inline">Toast vs. UnionOS</span>
            <span className="sm:hidden">TCO</span>
          </button>

          <button
            onClick={() => setZReportModalOpen(true)}
            title="Manager End-of-Day Shift Closeout & Z-Report"
            className="flex items-center gap-1 px-2 py-0.5 text-[#c29b68] hover:text-white bg-[#1a1d24] hover:bg-[#222731] rounded border border-[#c29b68]/40 transition font-mono font-semibold"
          >
            <FileSpreadsheet className="w-3 h-3 text-[#c29b68]" />
            <span>Z-Report</span>
          </button>

          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsAudioMuted(muted);
              if (!muted) sound.playTap();
            }}
            title={isAudioMuted ? 'Unmute Tactile Sound Effects' : 'Mute Tactile Sound Effects'}
            className="p-1 rounded bg-[#1a1d24] hover:bg-[#222731] text-[#9ca3af] hover:text-[#e2e4ea] border border-[#262a34] transition"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>

          <button
            onClick={() => {
              if (confirm('Reset demo state to default 240 Union shift?')) {
                resetDemo();
              }
            }}
            title="Reset to fresh shift demo"
            className="flex items-center gap-1 px-2 py-0.5 text-[#9ca3af] hover:text-rose-400 hover:bg-rose-950/30 rounded border border-transparent hover:border-rose-800/40 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Shift</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-3 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 max-w-full overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#c29b68] via-[#8b6f48] to-[#1a1d24] p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#111215] rounded-[7px] flex items-center justify-center">
              <span className="font-serif font-black text-[#c29b68] text-lg md:text-xl tracking-tight">240</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest font-bold text-base md:text-lg text-[#e2e4ea] uppercase">
                240 Union
              </span>
              <span className="text-[10px] tracking-widest font-mono bg-[#c29b68] text-[#0c0d10] px-2 py-0.5 rounded font-black shadow-sm">
                UNION•OS
              </span>
            </div>
            <p className="text-[10px] md:text-[11px] text-[#9ca3af] truncate font-serif">
              Creative American Grill • Handcrafted POS & KDS Appliance
            </p>
          </div>
        </div>

        {/* Surface Navigation Tabs */}
        <nav className="w-full md:w-auto overflow-x-auto scrollbar-none flex items-center gap-1 bg-[#0c0d10] p-1 rounded-xl border border-[#262a34] shadow-inner max-w-full">
          <button
            onClick={() => setActiveTab('floor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 whitespace-nowrap ${
              activeTab === 'floor'
                ? 'bg-[#1a1d24] text-[#e2e4ea] border border-[#c29b68]/70 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#16181d]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#c29b68]" />
            <span>Floor Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 whitespace-nowrap ${
              activeTab === 'pos'
                ? 'bg-[#1a1d24] text-[#e2e4ea] border border-[#c29b68]/70 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#16181d]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#c29b68]" />
            <span>Terminal POS</span>
            {activeTable && (
              <span className="text-[10px] font-mono bg-[#262a34] text-[#e2e4ea] px-1.5 py-0.2 rounded border border-[#c29b68]/50">
                T{activeTable.number}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 whitespace-nowrap ${
              activeTab === 'split'
                ? 'bg-[#1a1d24] text-[#e2e4ea] border border-[#3b82f6]/70 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#16181d]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Speed-Split & Pay</span>
            <span className="text-[10px] font-mono bg-[#16181d] text-[#3b82f6] px-1.5 py-0.2 rounded border border-[#3b82f6]/40 font-bold">
              Fed Center
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 whitespace-nowrap ${
              activeTab === 'kds'
                ? 'bg-[#1a1d24] text-[#e2e4ea] border border-emerald-500/70 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#16181d]'
            }`}
          >
            <MonitorCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>60-ft Open Kitchen KDS</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[10px] font-mono bg-[#111e16] text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/50">
              {activeOrdersCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#1a1d24] text-[#e2e4ea] border border-[#c29b68]/70 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#16181d]'
            }`}
          >
            <Wine className="w-3.5 h-3.5 text-[#c29b68]" />
            <span>Private Events & Cellar</span>
          </button>
        </nav>
      </div>
    </header>

    {/* Toast vs. UnionOS TCO Comparison Modal (Mounted outside sticky header) */}
    <ToastComparisonModal
      isOpen={toastComparisonOpen}
      onClose={() => setToastComparisonOpen(false)}
    />

    {/* Z-Report Closeout Modal (Mounted outside sticky header) */}
    <ZReportModal
      isOpen={zReportModalOpen}
      onClose={() => setZReportModalOpen(false)}
    />
  </>
  );
};
