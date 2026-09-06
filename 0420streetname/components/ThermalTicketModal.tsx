'use client';

import React from 'react';
import { Order, Table } from '../lib/types';
import { Printer, X, Clock, Flame, Sparkles } from 'lucide-react';

interface ThermalTicketModalProps {
  order: Order | null;
  table?: Table | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThermalTicketModal: React.FC<ThermalTicketModalProps> = ({
  order,
  table,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md flex flex-col items-center my-8"
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-3 text-xs text-[#9ca3af] px-2">
          <span className="font-mono text-[#c29b68] flex items-center gap-1.5 font-bold">
            <Flame className="w-3.5 h-3.5" />
            Epson TM-T88VI 80mm Kitchen Thermal Pass
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold rounded-lg flex items-center gap-1 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Chit</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#222731] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 80mm Photorealistic Thermal Kitchen Paper */}
        <div className="w-[340px] sm:w-[380px] bg-[#fbf9f4] text-[#111215] shadow-2xl rounded-t-sm relative font-mono text-xs select-none">
          {/* Top Paper Feed Notch */}
          <div className="w-full h-3 border-b-2 border-dashed border-neutral-300 flex justify-center items-center">
            <div className="w-12 h-1 bg-neutral-200 rounded-full"></div>
          </div>

          {/* Ticket Header */}
          <div className="p-5 pb-3 text-center border-b border-black">
            <h1 className="text-xl font-black tracking-wider uppercase font-mono">
              *** KITCHEN EXPO ***
            </h1>
            <p className="text-sm font-bold tracking-widest text-neutral-800 uppercase mt-0.5">
              240 UNION GRILL
            </p>
            <div className="text-[10px] text-neutral-600 mt-1 uppercase">
              Lakewood, CO • Order #{order.id.slice(-6).toUpperCase()}
            </div>

            {/* Giant Table Header */}
            <div className="my-3 py-2 border-y-2 border-black flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] block text-neutral-600 uppercase font-sans font-semibold">TABLE</span>
                <span className="text-3xl font-black font-mono tracking-tight leading-none">
                  #{order.tableNumber}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] block text-neutral-600 uppercase font-sans font-semibold">GUESTS / SVR</span>
                <span className="text-base font-bold font-mono leading-none">
                  {order.guestCount} GRP • {order.serverName}
                </span>
              </div>
            </div>

            {/* Timestamp line */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-700">
              <span>{dateStr}</span>
              <span className="font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-800 inline" />
                {timeStr}
              </span>
            </div>
          </div>

          {/* Table VIP / Special Instructions Banner */}
          {(table?.vipNote || order.notes) && (
            <div className="px-5 py-2.5 bg-neutral-100 border-b border-black">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block">
                *** EXPEDITE / VIP NOTE ***
              </span>
              <p className="text-[11px] font-bold text-neutral-900 leading-tight uppercase mt-0.5">
                {table?.vipNote || order.notes}
              </p>
            </div>
          )}

          {/* Itemized Order Items Grouped by Course */}
          <div className="p-5 py-3 space-y-4">
            {([1, 2, 3, 4] as const).map(courseNum => {
              const courseItems = order.items.filter(i => (i.course || 1) === courseNum);
              if (courseItems.length === 0) return null;

              const courseTitles = {
                1: 'COURSE 1: APPETIZERS',
                2: 'COURSE 2: SALADS & SOUPS',
                3: 'COURSE 3: WOOD GRILL & ENTREES',
                4: 'COURSE 4: DESSERT & PASTRY',
              };

              return (
                <div key={courseNum} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-neutral-400 pb-0.5">
                    <span className="font-black text-[11px] tracking-wider uppercase text-neutral-900">
                      {courseTitles[courseNum]}
                    </span>
                    <span className="text-[9px] font-bold bg-neutral-200 px-1 py-0.2 uppercase">
                      HOLD / AUTO-HOLD
                    </span>
                  </div>

                  <div className="space-y-2.5 pl-1">
                    {courseItems.map((item, idx) => (
                      <div key={item.id || idx} className="text-xs">
                        <div className="flex items-baseline justify-between font-black text-neutral-900">
                          <span className="text-sm">
                            1x {item.name.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-neutral-600 uppercase font-sans">
                            {item.station.toUpperCase()} • S{item.seatNumber === 'shared' ? 'SHR' : item.seatNumber}
                          </span>
                        </div>

                        {/* Red Bold Kitchen Mods */}
                        {item.mods && item.mods.length > 0 && (
                          <div className="pl-3 mt-0.5 space-y-0.5">
                            {item.mods.map((mod: string, mi: number) => (
                              <div 
                                key={mi} 
                                className="text-rose-700 font-black text-[11px] uppercase tracking-wide flex items-center gap-1"
                              >
                                <span>** {mod.toUpperCase()} **</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Footer Details */}
          <div className="p-5 pt-3 border-t-2 border-black space-y-1 text-center">
            <div className="flex items-center justify-between text-xs font-black">
              <span>TOTAL ITEMS COUNT:</span>
              <span className="font-mono text-sm">{order.items.length}</span>
            </div>
            <div className="text-[10px] text-neutral-600 font-mono pt-2">
              *** END OF TICKET — UNION•OS LAN LOCAL ***
            </div>
            <div className="text-[9px] text-neutral-400 font-mono tracking-widest pt-1">
              RECOVERED FROM TOAST POS • 0ms ZERO LATENCY
            </div>
          </div>

          {/* Jagged Zigzag Tear Edge */}
          <div 
            className="w-full h-4 bg-repeat-x"
            style={{
              backgroundImage: `radial-gradient(circle at 10px 0, transparent 0, transparent 8px, #fbf9f4 9px)`,
              backgroundSize: '20px 20px',
              transform: 'rotate(180deg)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
