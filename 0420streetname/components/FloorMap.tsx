'use client';

import React, { useState } from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { Table, TableSection } from '../lib/types';
import { 
  Users, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Receipt, 
  Sparkles, 
  Plus, 
  Wine, 
  Layers,
  Search,
  ArrowRight,
  Award,
  Smartphone
} from 'lucide-react';
import { VIPGuestCard } from './VIPGuestCard';
import { WaitlistDrawer, WaitlistParty } from './WaitlistDrawer';

interface FloorMapProps {
  onOpenPOS: (tableId: string) => void;
  onOpenSplit: (tableId: string) => void;
}

export const FloorMap: React.FC<FloorMapProps> = ({ onOpenPOS, onOpenSplit }) => {
  const { 
    tables, 
    orders, 
    activeTableId, 
    setActiveTableId, 
    seatTable, 
    closeTable,
    currentServer 
  } = useUnionStore();

  const [selectedSection, setSelectedSection] = useState<TableSection | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [seatingModalTable, setSeatingModalTable] = useState<Table | null>(null);
  const [selectedVIPModalTable, setSelectedVIPModalTable] = useState<Table | null>(null);
  const [showWaitlist, setShowWaitlist] = useState<boolean>(false);
  const [guestCountInput, setGuestCountInput] = useState<number>(4);
  const [vipNoteInput, setVipNoteInput] = useState<string>('');

  const sections: { id: TableSection | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Floor', count: tables.length },
    { id: 'dining', label: 'Main Dining', count: tables.filter(t => t.section === 'dining').length },
    { id: 'bar', label: 'Bar & Lounge', count: tables.filter(t => t.section === 'bar').length },
    { id: 'patio', label: 'Enclosed Patio', count: tables.filter(t => t.section === 'patio').length },
    { id: 'wine_room', label: 'The Wine Room (28p)', count: tables.filter(t => t.section === 'wine_room').length },
    { id: 'lakewood_room', label: 'Lakewood Room (45p)', count: tables.filter(t => t.section === 'lakewood_room').length },
  ];

  const filteredTables = tables.filter(t => {
    if (selectedSection !== 'all' && t.section !== selectedSection) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.number.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.serverName && t.serverName.toLowerCase().includes(q)) ||
        (t.vipNote && t.vipNote.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPI Calculations
  const occupiedTables = tables.filter(t => t.status !== 'vacant');
  const totalCovers = occupiedTables.reduce((acc, t) => acc + (t.guestCount || 0), 0);
  const appsFiredCount = tables.filter(t => t.status === 'apps_fired').length;
  const entreesFiredCount = tables.filter(t => t.status === 'entrees_fired').length;

  const totalOpenSales = orders
    .filter(o => o.status === 'open')
    .reduce((acc, o) => {
      const orderTotal = o.items.reduce((s, i) => s + i.price, 0);
      return acc + orderTotal;
    }, 0);

  const getStatusBadge = (table: Table) => {
    switch (table.status) {
      case 'vacant':
        return (
          <span className="px-2 py-0.5 text-[11px] rounded bg-[#16181d] text-[#9ca3af] border border-[#262a34]">
            Available
          </span>
        );
      case 'seated':
        return (
          <span className="px-2 py-0.5 text-[11px] rounded bg-[#1a1d24] text-[#e2e4ea] border border-[#c29b68]/60 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c29b68] animate-pulse"></span>
            Seated / Ordering
          </span>
        );
      case 'apps_fired':
        return (
          <span className="px-2 py-0.5 text-[11px] rounded bg-amber-950/20 text-amber-300 border border-amber-500/40 font-medium flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            Apps Fired
          </span>
        );
      case 'entrees_fired':
        return (
          <span className="px-2 py-0.5 text-[11px] rounded bg-rose-950/20 text-rose-300 border border-rose-500/40 font-medium flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" />
            Entrees Working
          </span>
        );
      case 'dessert':
        return (
          <span className="px-2 py-0.5 text-[11px] rounded bg-blue-950/20 text-blue-300 border border-blue-500/40 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Dessert / Check
          </span>
        );
      case 'paid':
        return (
          <span className="px-2 py-0.5 text-[11px] rounded bg-emerald-950/25 text-emerald-300 border border-emerald-500/50 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Paid • Bus Table
          </span>
        );
    }
  };

  const formatElapsed = (timestamp?: number) => {
    if (!timestamp) return null;
    const diffMins = Math.floor((Date.now() - timestamp) / 60000);
    return `${diffMins}m`;
  };

  const handleSeatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seatingModalTable) return;
    seatTable(seatingModalTable.id, guestCountInput, currentServer, vipNoteInput);
    setActiveTableId(seatingModalTable.id);
    setSeatingModalTable(null);
    setVipNoteInput('');
  };

  return (
    <div className="p-3 md:p-4 max-w-7xl mx-auto space-y-4 max-w-full overflow-hidden">
      {/* Real-time KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-[#16181d] p-3 rounded-xl border border-[#262a34] shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-[#9ca3af] font-semibold font-serif">
            Active Dining Room
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#e2e4ea]">
              {occupiedTables.length} / {tables.length}
            </span>
            <span className="text-xs text-[#c29b68] font-medium">
              {Math.round((occupiedTables.length / tables.length) * 100)}% Occ
            </span>
          </div>
        </div>

        <div className="bg-[#16181d] p-3 rounded-xl border border-[#262a34] shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-[#9ca3af] font-semibold font-serif">
            Total Covers
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#e2e4ea]">
              {totalCovers}
            </span>
            <span className="text-xs text-[#c29b68] font-medium">Guests Seated</span>
          </div>
        </div>
        <div className="bg-[#16181d] p-3 rounded-xl border border-[#262a34] shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1 font-serif">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Kitchen Fired
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#e2e4ea]">
              {appsFiredCount + entreesFiredCount}
            </span>
            <span className="text-xs text-[#9ca3af]">
              {appsFiredCount} Apps • {entreesFiredCount} Entrees
            </span>
          </div>
        </div>

        <div className="bg-[#16181d] p-3 rounded-xl border border-[#262a34] shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1 font-serif">
            <Receipt className="w-3.5 h-3.5" />
            Open Floor Sales
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ${totalOpenSales.toLocaleString()}
            </span>
            <span className="text-xs text-[#9ca3af]">Pre-Tax Active</span>
          </div>
        </div>

        <div className="bg-[#16181d] p-3 rounded-xl border border-[#262a34] shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] uppercase tracking-wider text-[#c29b68] font-semibold flex items-center gap-1 font-serif">
            <Wine className="w-3.5 h-3.5" />
            Private Dining
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-serif text-[#e2e4ea]">
              Wine & Lakewood
            </span>
            <span className="text-xs text-[#c29b68]">Active Events</span>
          </div>
        </div>
      </div>

      {/* Section Filter & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-[#16181d] p-2 rounded-xl border border-[#262a34] max-w-full overflow-hidden">
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-none flex items-center gap-1.5 pb-1 sm:pb-0 max-w-full">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 whitespace-nowrap ${
                selectedSection === sec.id
                  ? 'bg-[#1a1d24] text-[#e2e4ea] border border-[#c29b68]/70 shadow-sm'
                  : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#111215]'
              }`}
            >
              {sec.label} <span className="opacity-60 text-[10px]">({sec.count})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search table, server, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111215] border border-[#262a34] rounded-lg text-xs text-[#e2e4ea] placeholder-[#9ca3af]/60 focus:outline-none focus:border-[#c29b68]"
            />
          </div>

          <button
            onClick={() => setShowWaitlist(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-[#221c15] to-[#1a1d24] hover:border-[#c29b68] text-[#c29b68] border border-[#c29b68]/60 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#c29b68]" />
            <span>Host Waitlist</span>
            <span className="font-mono text-[10px] bg-[#c29b68]/20 text-[#c29b68] px-1.5 py-0.2 rounded font-bold">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredTables.map((table) => {
          const isSelected = activeTableId === table.id;
          const order = orders.find(o => o.tableId === table.id && o.status === 'open');
          const itemCount = order ? order.items.length : 0;
          const orderTotal = order ? order.items.reduce((s, i) => s + i.price, 0) : 0;

          return (
            <div
              key={table.id}
              onClick={() => setActiveTableId(table.id)}
              className={`rounded-xl border p-4 cursor-pointer transition flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-[#c29b68] bg-[#1a1d24] shadow-lg shadow-[#c29b68]/15 ring-1 ring-[#c29b68]/50'
                  : table.status === 'vacant'
                  ? 'border-[#262a34] bg-[#16181d]/50 hover:border-[#c29b68]/40 hover:bg-[#16181d]'
                  : table.status === 'paid'
                  ? 'border-emerald-500/50 bg-[#111e16]/60 hover:border-emerald-500'
                  : 'border-[#262a34] bg-[#16181d] hover:border-[#c29b68]/60 hover:bg-[#1a1d24]'
              }`}
            >
              {/* Header with Table number, Section, and Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-[#e2e4ea] bg-[#111215] px-2 py-0.5 rounded border border-[#262a34]">
                      {table.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-[#e2e4ea]">{table.name}</h4>
                      <span className="text-[10px] text-[#9ca3af] capitalize font-serif">{table.section.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div>{getStatusBadge(table)}</div>
                </div>

                {/* Occupancy and Server line */}
                {table.status !== 'vacant' ? (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#9ca3af]">
                      <span className="flex items-center gap-1 text-[#9ca3af]">
                        <Users className="w-3.5 h-3.5 text-[#c29b68]" />
                        {table.guestCount} covers / {table.capacity} max
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[#9ca3af]">
                        <Clock className="w-3.5 h-3.5 text-[#c29b68]" />
                        {formatElapsed(table.seatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9ca3af] text-[11px]">Server: <span className="text-[#e2e4ea] font-medium">{table.serverName}</span></span>
                      {order && (
                        <span className="font-mono text-[#c29b68] font-semibold text-xs">
                          ${orderTotal} ({itemCount} items)
                        </span>
                      )}
                    </div>

                    {table.vipGuest ? (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVIPModalTable(table);
                        }}
                        className="mt-1.5 p-2 bg-gradient-to-r from-[#221c15] to-[#16181d] border border-[#c29b68]/40 hover:border-[#c29b68] rounded-lg text-[11px] text-[#e2e4ea] cursor-pointer transition group/vip flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Award className="w-3.5 h-3.5 text-[#c29b68] shrink-0" />
                          <span className="font-bold text-[#c29b68] truncate">
                            {table.vipGuest.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-[#c29b68]/20 text-[#c29b68] px-1.5 py-0.5 rounded uppercase shrink-0">
                          VIP Card
                        </span>
                      </div>
                    ) : table.vipNote ? (
                      <div className="mt-1.5 p-1.5 bg-[#111215] border border-[#262a34] rounded text-[11px] text-[#e2e4ea] leading-snug">
                        {table.vipNote}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-4 py-3 text-center text-xs text-[#9ca3af]/50 border border-dashed border-[#262a34] rounded-lg">
                    Seats up to {table.capacity} guests
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between gap-2">
                {table.status === 'vacant' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSeatingModalTable(table);
                      setGuestCountInput(Math.min(table.capacity, 4));
                    }}
                    className="w-full py-1.5 bg-[#c29b68]/15 hover:bg-[#c29b68]/25 text-[#e2e4ea] border border-[#c29b68]/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c29b68]" />
                    Seat Party
                  </button>
                ) : table.status === 'paid' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTable(table.id);
                    }}
                    className="w-full py-1.5 bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-200 border border-emerald-500/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Bus & Clear Table
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTableId(table.id);
                        onOpenPOS(table.id);
                      }}
                      className="flex-1 py-1.5 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm"
                    >
                      <span>Open POS</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTableId(table.id);
                        onOpenSplit(table.id);
                      }}
                      title="Instant Federal Center Split Check"
                      className="px-2.5 py-1.5 bg-[#111215] hover:bg-[#1a1d24] text-[#e2e4ea] border border-[#3b82f6]/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#3b82f6]" />
                      <span>Split</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Seat Table */}
      {seatingModalTable && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16181d] border border-[#262a34] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a34] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-[#c29b68] bg-[#111215] px-2 py-0.5 rounded border border-[#262a34]">
                  {seatingModalTable.number}
                </span>
                <h3 className="text-base font-bold text-[#e2e4ea] font-serif">
                  Seat {seatingModalTable.name}
                </h3>
              </div>
              <button
                onClick={() => setSeatingModalTable(null)}
                className="text-[#9ca3af] hover:text-[#e2e4ea] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSeatSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">
                  Guest Count (Max {seatingModalTable.capacity})
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 6, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCountInput(num)}
                      className={`flex-1 py-2 rounded-lg font-mono text-sm font-bold border transition ${
                        guestCountInput === num
                          ? 'bg-[#c29b68] text-[#0c0d10] border-[#c29b68] shadow-sm'
                          : 'bg-[#111215] text-[#9ca3af] border-[#262a34] hover:bg-[#1a1d24]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">
                  Assigned Server
                </label>
                <div className="p-2.5 bg-[#111215] border border-[#262a34] rounded-lg text-xs text-[#e2e4ea] font-medium">
                  {currentServer} (Active Shift)
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">
                  VIP / OpenTable / Corporate Lunch Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Denver Federal Center luncheon • Separate checks"
                  value={vipNoteInput}
                  onChange={(e) => setVipNoteInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111215] border border-[#262a34] rounded-lg text-xs text-[#e2e4ea] placeholder-[#9ca3af]/50 focus:outline-none focus:border-[#c29b68]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#262a34]">
                <button
                  type="button"
                  onClick={() => setSeatingModalTable(null)}
                  className="px-4 py-2 text-xs font-medium text-[#9ca3af] hover:text-[#e2e4ea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-lg transition shadow-md"
                >
                  Open Table & Start Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lakewood VIP Profile Modal */}
      {selectedVIPModalTable && selectedVIPModalTable.vipGuest && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedVIPModalTable(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <VIPGuestCard 
              table={selectedVIPModalTable} 
              onClose={() => setSelectedVIPModalTable(null)}
              onSelectTable={() => {
                const tableId = selectedVIPModalTable.id;
                setSelectedVIPModalTable(null);
                onOpenPOS(tableId);
              }}
            />
          </div>
        </div>
      )}

      {/* Host Stand SMS Waitlist & Table Ready Pager Drawer */}
      <WaitlistDrawer
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onSeatParty={(party) => {
          setShowWaitlist(false);
          // Find first vacant table that fits party
          const vacantTable = tables.find(t => t.status === 'vacant' && t.capacity >= party.partySize) || tables.find(t => t.status === 'vacant');
          if (vacantTable) {
            setSeatingModalTable(vacantTable);
            setGuestCountInput(party.partySize);
            setVipNoteInput(`${party.guestName} (${party.phone}) • ${party.notes || 'Walk-in waitlist'}`);
          }
        }}
      />
    </div>
  );
};
