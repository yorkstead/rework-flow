'use client';

import React, { useState, useEffect } from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { KitchenStation, CourseNumber, ItemStatus } from '../lib/types';
import { sound } from '../lib/audio';
import { 
  Flame, 
  Clock, 
  CheckCheck, 
  Bell, 
  Utensils, 
  Volume2, 
  Layers,
  ChefHat,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { ThermalTicketModal } from './ThermalTicketModal';

export const KitchenKDS: React.FC = () => {
  const { 
    orders, 
    tables, 
    activeStation, 
    setActiveStation, 
    updateItemStatus, 
    bumpCourse, 
    fireCourse,
    eightySixList,
    toggle86,
    menu
  } = useUnionStore();

  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<any | null>(null);

  // Tick clock every 5 seconds for live kitchen timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const stations: { id: KitchenStation | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Expo Pass (Master)', icon: '👨‍🍳' },
    { id: 'grill', label: 'Wood-Fired Grill', icon: '🥩' },
    { id: 'saute', label: 'Sauté Line & Pasta', icon: '🍳' },
    { id: 'pizza', label: 'Wood Pizza Oven', icon: '🍕' },
    { id: 'pantry', label: 'Pantry / Raw Bar', icon: '🥗' },
    { id: 'pastry', label: 'Pastry & Dessert', icon: '🍰' },
  ];

  // Open orders with items matching station
  const activeOrders = orders.filter(ord => {
    if (ord.status !== 'open') return false;
    if (activeStation === 'all') return ord.items.some(i => i.status !== 'bumped');
    return ord.items.some(i => i.station === activeStation && i.status !== 'bumped');
  });

  const getElapsedMins = (timestamp?: number) => {
    if (!timestamp) return 0;
    return Math.floor((currentTime - timestamp) / 60000);
  };

  const getStatusColor = (elapsedMins: number) => {
    if (elapsedMins >= 18) return 'border-rose-600/80 bg-rose-950/20 text-rose-300';
    if (elapsedMins >= 10) return 'border-amber-600/80 bg-amber-950/20 text-amber-300';
    return 'border-emerald-600/80 bg-emerald-950/20 text-emerald-300';
  };

  const nextStatusMap: Record<ItemStatus, ItemStatus> = {
    draft: 'fire',
    hold: 'fire',
    prep: 'plated',
    fire: 'plated',
    plated: 'bumped',
    bumped: 'fire',
  };

  return (
    <div className="p-3 md:p-4 max-w-[1700px] mx-auto space-y-4 max-w-full overflow-hidden">
      {/* KDS Header & Station Filter Bar */}
      <div className="bg-[#16181d] p-3 rounded-xl border border-[#262a34] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-full overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#1a1d24] border border-[#262a34] flex items-center justify-center text-[#c29b68] shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-[#e2e4ea] flex items-center gap-2 font-serif">
              60-Foot Open Kitchen KDS
              <span className="text-[9px] md:text-[10px] font-mono bg-[#111215] text-[#e2e4ea] px-1.5 py-0.2 rounded border border-[#262a34] font-bold uppercase font-sans">
                Line Station Routing
              </span>
            </h2>
            <p className="text-[11px] md:text-xs text-[#9ca3af] font-serif">
              Live coursing synchronization • Wood grill line pass alerts • 0ms LAN latency
            </p>
          </div>
        </div>

        {/* Station Filter Tabs */}
        <div className="w-full md:w-auto overflow-x-auto scrollbar-none flex items-center gap-1.5 pb-1 md:pb-0 max-w-full">
          {stations.map(st => (
            <button
              key={st.id}
              onClick={() => setActiveStation(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeStation === st.id
                  ? 'bg-[#c29b68] text-[#0c0d10] shadow-md font-extrabold'
                  : 'bg-[#1a1d24] text-[#9ca3af] border border-[#262a34] hover:bg-[#222731]'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}

          {/* Manual Chime Trigger */}
          <button
            onClick={() => sound.playKitchenFire()}
            title="Test Kitchen Pass Bell"
            className="p-1.5 bg-[#1a1d24] hover:bg-[#222731] text-[#c29b68] rounded-lg border border-[#262a34] transition ml-2"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Chef 86-Board & Depleted Inventory Banner */}
      <div className="p-3 bg-[#16181d] rounded-xl border border-[#262a34] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-xs font-mono font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Chef 86-Board (Live Auto-Cascade):
          </span>
        </div>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
          {eightySixList.length > 0 ? (
            eightySixList.map(itemId => {
              const item = menu.find(m => m.id === itemId);
              const itemName = item ? item.name : itemId;
              return (
                <span
                  key={itemId}
                  className="px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-600/70 text-rose-200 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 animate-pulse"
                >
                  <span>86: {itemName}</span>
                  <button
                    onClick={() => toggle86(itemId)}
                    title="Restock this item"
                    className="hover:text-white text-rose-400 ml-1 text-xs font-black"
                  >
                    ✕
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-emerald-400 font-medium italic">
              All items in stock across line stations • No 86 restrictions active
            </span>
          )}
        </div>

        {/* Quick 86 Toggle for Low Stock Specials */}
        <div className="flex items-center gap-1 shrink-0">
          <select
            onChange={(e) => {
              if (e.target.value) {
                toggle86(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="bg-[#111215] text-[#9ca3af] hover:text-[#e2e4ea] border border-[#262a34] text-[11px] rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="" disabled>+ Quick 86 Line Item</option>
            {menu
              .filter(m => !eightySixList.includes(m.id))
              .map(m => (
                <option key={m.id} value={m.id}>86 {m.name}</option>
              ))}
          </select>
        </div>
      </div>

      {/* Ticket Rack */}
      {activeOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
          {activeOrders.map(order => {
            const table = tables.find(t => t.id === order.tableId);
            const elapsedMins = getElapsedMins(order.createdAt);
            const isUrgent = elapsedMins >= 18;

            // Filter items for current station
            const relevantItems = order.items.filter(i => {
              if (i.status === 'bumped') return false;
              if (activeStation === 'all') return true;
              return i.station === activeStation;
            });

            if (relevantItems.length === 0) return null;

            // Group by course
            const coursesPresent = [1, 2, 3, 4].filter(c => 
              relevantItems.some(i => (i.course || 1) === c)
            ) as CourseNumber[];

            return (
              <div
                key={order.id}
                className={`bg-[#16181d] rounded-2xl border shadow-xl flex flex-col justify-between overflow-hidden transition ${
                  isUrgent
                    ? 'border-rose-500 shadow-rose-950/40 ring-2 ring-rose-500/50'
                    : elapsedMins >= 10
                    ? 'border-amber-500/70'
                    : 'border-[#262a34]'
                }`}
              >
                {/* Ticket Header */}
                <div className={`p-3 border-b flex items-center justify-between ${
                  isUrgent
                    ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                    : elapsedMins >= 10
                    ? 'bg-amber-950/30 border-amber-600/50 text-[#e2e4ea]'
                    : 'bg-[#1a1d24] border-[#262a34] text-[#e2e4ea]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-black bg-[#111215] px-2 py-0.5 rounded border border-[#262a34] text-[#c29b68]">
                      T{order.tableNumber}
                    </span>
                    <div>
                      <div className="font-bold text-xs font-serif text-[#e2e4ea]">{table?.name || `Table ${order.tableNumber}`}</div>
                      <div className="text-[11px] opacity-75 font-mono text-[#9ca3af]">{order.guestCount} guests • {order.serverName}</div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div>
                      <div className="flex items-center justify-end gap-1 font-mono font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-[#c29b68]" />
                        <span>{elapsedMins}m</span>
                      </div>
                      {isUrgent && (
                        <span className="text-[9px] font-mono tracking-widest font-black uppercase text-rose-400">
                          RUSH PASS
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicketOrder(order);
                      }}
                      title="View & Print Physical 80mm Kitchen Thermal Chit"
                      className="p-1.5 rounded-lg bg-[#111215] hover:bg-[#222731] border border-[#262a34] hover:border-[#c29b68]/60 text-[#c29b68] transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* VIP / Course notes */}
                {table?.vipNote && (
                  <div className="px-3 py-1.5 bg-[#111215] border-b border-[#262a34] text-[11px] text-[#e2e4ea] font-mono">
                    ★ {table.vipNote}
                  </div>
                )}

                {/* Ticket Coursed Items */}
                <div className="p-3 space-y-3 divide-y divide-[#262a34]">
                  {coursesPresent.map(courseNum => {
                    const itemsInCourse = relevantItems.filter(i => (i.course || 1) === courseNum);
                    const courseTitles: Record<CourseNumber, string> = {
                      1: 'Course 1 • Apps & Starters',
                      2: 'Course 2 • Salads',
                      3: 'Course 3 • Wood-Fired Entrées',
                      4: 'Course 4 • Pastry',
                    };

                    const isFired = itemsInCourse.some(i => i.status === 'fire' || i.status === 'plated');
                    const allPlated = itemsInCourse.every(i => i.status === 'plated');

                    return (
                      <div key={courseNum} className="pt-2 first:pt-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e2e4ea] font-serif">
                              {courseTitles[courseNum]}
                            </span>
                            {isFired ? (
                              <span className="text-[9px] font-mono font-bold px-1 py-0.2 bg-amber-950/40 text-amber-300 border border-amber-500/50 rounded">
                                COOKING
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold px-1 py-0.2 bg-[#111215] text-[#9ca3af]/60 border border-[#262a34] rounded">
                                HELD
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {!isFired && (
                              <button
                                onClick={() => fireCourse(order.tableId, courseNum)}
                                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-[#0c0d10] font-bold text-[10px] rounded flex items-center gap-0.5 shadow transition"
                              >
                                <Flame className="w-2.5 h-2.5 text-[#0c0d10]" />
                                <span>FIRE</span>
                              </button>
                            )}

                            {isFired && (
                              <button
                                onClick={() => bumpCourse(order.id, courseNum)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-[#0c0d10] font-bold text-[10px] rounded flex items-center gap-0.5 shadow transition"
                              >
                                <CheckCheck className="w-2.5 h-2.5" />
                                <span>Bump C{courseNum}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Items in course */}
                        <div className="space-y-1">
                          {itemsInCourse.map(item => {
                            const isPlated = item.status === 'plated';
                            const isCooking = item.status === 'fire';

                            return (
                              <div
                                key={item.id}
                                onClick={() => updateItemStatus(item.id, nextStatusMap[item.status])}
                                className={`p-2 rounded-lg border text-xs cursor-pointer select-none transition flex items-center justify-between ${
                                  isPlated
                                    ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                                    : isCooking
                                    ? 'bg-amber-950/25 border-amber-500/50 text-[#e2e4ea] hover:border-amber-400'
                                    : 'bg-[#111215] border-[#262a34] text-[#9ca3af] hover:border-[#3b4252]'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-mono text-[10px] bg-[#1a1d24] text-[#c29b68] px-1 rounded border border-[#262a34] shrink-0">
                                    {item.seatNumber === 'shared' ? 'ALL' : `S${item.seatNumber}`}
                                  </span>
                                  <div>
                                    <div className="font-bold flex items-center gap-1.5">
                                      <span className={isPlated ? 'line-through opacity-75' : ''}>{item.name}</span>
                                      {item.station && (
                                        <span className="text-[9px] font-mono px-1 rounded uppercase bg-[#1a1d24] text-[#9ca3af]">
                                          {item.station}
                                        </span>
                                      )}
                                    </div>
                                    {item.mods && item.mods.length > 0 && (
                                      <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                                        {item.mods.map((m, idx) => (
                                          <span key={idx} className="mr-1.5 font-bold">
                                            • {m}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="shrink-0 pl-2">
                                  {isPlated ? (
                                    <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-600 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      PLATED
                                    </span>
                                  ) : isCooking ? (
                                    <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-600">
                                      COOK
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono bg-[#1a1d24] text-[#9ca3af] px-1.5 py-0.5 rounded border border-[#262a34]">
                                      HOLD
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ticket Footer Pass Action */}
                <div className="p-2.5 bg-[#111215] border-t border-[#262a34] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#9ca3af]/70">
                    Tap any item to advance status
                  </span>
                  <button
                    onClick={() => {
                      // Bump all items on this ticket
                      coursesPresent.forEach(c => bumpCourse(order.id, c));
                    }}
                    className="px-3 py-1 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] rounded text-xs font-semibold border border-[#262a34] transition"
                  >
                    Bump Full Ticket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-72 flex flex-col items-center justify-center text-[#9ca3af] border border-dashed border-[#262a34] rounded-2xl space-y-2">
          <ChefHat className="w-10 h-10 opacity-30 text-[#c29b68]" />
          <p className="text-sm font-semibold text-[#e2e4ea]">Pass is clear!</p>
          <p className="text-xs text-[#9ca3af]">No active tickets waiting at station: {activeStation.toUpperCase()}</p>
        </div>
      )}

      {/* 80mm Kitchen Thermal Chit Modal */}
      {selectedTicketOrder && (
        <ThermalTicketModal
          order={selectedTicketOrder}
          table={tables.find(t => t.id === selectedTicketOrder.tableId)}
          isOpen={!!selectedTicketOrder}
          onClose={() => setSelectedTicketOrder(null)}
        />
      )}
    </div>
  );
};
