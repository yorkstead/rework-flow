'use client';

import React, { useState, useMemo } from 'react';
import { useUnionStore } from '../lib/store/useUnionStore';
import { MenuCategory, CourseNumber } from '../lib/types';
import { SPEED_MODS } from '../lib/data/menu';
import { 
  Flame, 
  Trash2, 
  Send, 
  Receipt, 
  Sparkles, 
  AlertCircle, 
  Wine, 
  Search, 
  Check, 
  ChevronRight,
  PlusCircle,
  Tag,
  Award,
  Printer
} from 'lucide-react';
import { VIPGuestCard } from './VIPGuestCard';
import { ThermalTicketModal } from './ThermalTicketModal';
import { sound } from '../lib/audio';

interface TerminalPOSProps {
  onOpenSplit: (tableId: string) => void;
}

export const TerminalPOS: React.FC<TerminalPOSProps> = ({ onOpenSplit }) => {
  const { 
    tables, 
    menu, 
    orders, 
    activeTableId, 
    setActiveTableId, 
    activeTable, 
    activeOrder, 
    addItemToOrder, 
    removeItemFromOrder, 
    fireCourse, 
    sendOrder,
    eightySixList,
    decrementCellar
  } = useUnionStore();

  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('apps');
  const [selectedSeat, setSelectedSeat] = useState<number | 'shared'>(1);
  const [selectedCourseOverride, setSelectedCourseOverride] = useState<CourseNumber | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingMods, setPendingMods] = useState<string[]>([]);
  const [activeItemForMods, setActiveItemForMods] = useState<string | null>(null);
  const [showVIPModal, setShowVIPModal] = useState<boolean>(false);
  const [showThermalTicket, setShowThermalTicket] = useState<boolean>(false);
  const [mobileHandheldView, setMobileHandheldView] = useState<'menu' | 'ticket'>('menu');

  const categories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'apps', label: 'Apps & Raw Bar' },
    { id: 'salads', label: 'Salads & Soups' },
    { id: 'sandwiches_pizza', label: 'Wood Pizza & Burgers' },
    { id: 'pasta', label: 'Handmade Pasta' },
    { id: 'entrees', label: 'Wood Grill & Entrées' },
    { id: 'sides', label: 'Sides' },
    { id: 'wine', label: 'Wine & Cellar' },
    { id: 'cocktails', label: 'Cocktails' },
    { id: 'desserts', label: 'Pastry & Dessert' },
  ];

  const filteredMenuItems = useMemo(() => {
    return menu.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.wineDetails && item.wineDetails.binNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [menu, activeCategory, searchQuery]);

  // Group active order items by course
  const coursedItems = useMemo(() => {
    if (!activeOrder) return { 1: [], 2: [], 3: [], 4: [] };
    const groups: { [key in CourseNumber]: typeof activeOrder.items } = { 1: [], 2: [], 3: [], 4: [] };
    activeOrder.items.forEach(item => {
      const c = item.course || 1;
      if (!groups[c]) groups[c] = [];
      groups[c].push(item);
    });
    return groups;
  }, [activeOrder]);

  const subtotal = activeOrder
    ? activeOrder.items.reduce((acc, i) => acc + i.price, 0)
    : 0;
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const autoGrat = activeOrder && activeOrder.guestCount >= 6 ? Math.round(subtotal * 0.20 * 100) / 100 : 0;
  const total = Math.round((subtotal + tax + autoGrat) * 100) / 100;

  const draftCount = activeOrder ? activeOrder.items.filter(i => i.status === 'draft').length : 0;

  const handleAddItem = (menuItemId: string) => {
    if (!activeTableId) return;
    const item = menu.find(m => m.id === menuItemId);
    if (!item) return;

    // Check if 86'd
    if (eightySixList.includes(menuItemId)) {
      alert(`${item.name} is currently 86'D by the kitchen/sommelier!`);
      return;
    }

    sound.playTap();
    const course = selectedCourseOverride || item.courseDefault;
    addItemToOrder(activeTableId, menuItemId, selectedSeat, course, pendingMods);

    // If it's a cellar bottle, decrement cellar count
    if (item.wineDetails) {
      decrementCellar(menuItemId);
    }

    // Reset pending mods
    setPendingMods([]);
    setActiveItemForMods(null);
  };

  const toggleMod = (mod: string) => {
    sound.playTap();
    if (pendingMods.includes(mod)) {
      setPendingMods(pendingMods.filter(m => m !== mod));
    } else {
      setPendingMods([...pendingMods, mod]);
    }
  };

  return (
    <div className="p-2 sm:p-3 max-w-[1600px] mx-auto flex flex-col gap-3 min-h-0 lg:h-[calc(100vh-100px)] max-w-full overflow-hidden">
      {/* Mobile Handheld Segmented Bar (Only visible on small viewports) */}
      <div className="lg:hidden flex items-center bg-[#111215] p-1 rounded-xl border border-[#262a34]">
        <button
          onClick={() => setMobileHandheldView('menu')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mobileHandheldView === 'menu'
              ? 'bg-[#c29b68] text-[#0c0d10] shadow-sm'
              : 'text-[#9ca3af] hover:text-[#e2e4ea]'
          }`}
        >
          <span>1. Speed Menu Tap</span>
        </button>
        <button
          onClick={() => setMobileHandheldView('ticket')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 relative ${
            mobileHandheldView === 'ticket'
              ? 'bg-[#c29b68] text-[#0c0d10] shadow-sm'
              : 'text-[#9ca3af] hover:text-[#e2e4ea]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>2. Table Ticket</span>
          {activeOrder && activeOrder.items.length > 0 && (
            <span className="font-mono text-[10px] bg-black text-[#c29b68] px-1.5 py-0.2 rounded-full font-black">
              {activeOrder.items.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 max-w-full overflow-hidden">
        {/* LEFT COLUMN: ACTIVE TABLE TICKET & COURSING PASS (5 Cols) */}
        <div className={`lg:col-span-5 flex flex-col bg-[#16181d] rounded-xl border border-[#262a34] shadow-xl overflow-hidden max-w-full ${
          mobileHandheldView === 'ticket' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Table Selector & Top Info */}
          <div className="p-3 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={activeTableId || ''}
              onChange={(e) => setActiveTableId(e.target.value)}
              className="bg-[#111215] text-[#e2e4ea] font-mono font-bold text-sm px-2.5 py-1 rounded-lg border border-[#c29b68]/60 focus:outline-none"
            >
              {tables
                .filter(t => t.status !== 'vacant')
                .map(t => (
                  <option key={t.id} value={t.id}>
                    Table {t.number} ({t.guestCount} guests • {t.serverName})
                  </option>
                ))}
            </select>
            {activeTable && (
              <span className="text-xs text-[#9ca3af] capitalize hidden sm:inline font-serif">
                {activeTable.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTable?.vipGuest && (
              <button
                onClick={() => setShowVIPModal(true)}
                className="px-2.5 py-1 bg-gradient-to-r from-[#2a1d12] to-[#1a1c22] hover:border-[#c29b68] text-[#c29b68] border border-[#c29b68]/60 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm animate-pulse"
                title="View VIP Regular Profile"
              >
                <Award className="w-3.5 h-3.5" />
                <span>VIP: {activeTable.vipGuest.name.split(' ')[0]}</span>
              </button>
            )}

            {activeOrder && (
              <button
                onClick={() => setShowThermalTicket(true)}
                className="px-2.5 py-1 bg-[#111215] hover:bg-[#222731] text-[#c29b68] border border-[#c29b68]/50 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm"
                title="View & Print 80mm Jagged-Edge Kitchen Thermal Ticket"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Chit</span>
              </button>
            )}

            {activeTableId && (
              <button
                onClick={() => onOpenSplit(activeTableId)}
                className="px-2.5 py-1 bg-[#111215] hover:bg-[#222731] text-[#e2e4ea] border border-[#3b82f6]/50 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm"
              >
                <Receipt className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Split Check</span>
              </button>
            )}
          </div>
        </div>

        {/* Seat Tabs */}
        {activeTable && activeTable.status !== 'vacant' && (
          <div className="px-3 py-2 bg-[#111215] border-b border-[#262a34] flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
            <button
              onClick={() => setSelectedSeat('shared')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                selectedSeat === 'shared'
                  ? 'bg-[#c29b68] text-[#0c0d10] shadow-sm'
                  : 'bg-[#1a1d24] text-[#9ca3af] hover:text-[#e2e4ea]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#0c0d10]" />
              <span>Table Shared</span>
            </button>

            {Array.from({ length: activeTable.guestCount || 4 }).map((_, idx) => {
              const seatNum = idx + 1;
              const isSelected = selectedSeat === seatNum;
              return (
                <button
                  key={seatNum}
                  onClick={() => setSelectedSeat(seatNum)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition shrink-0 ${
                    isSelected
                      ? 'bg-[#c29b68] text-[#0c0d10] shadow-sm'
                      : 'bg-[#1a1d24] text-[#9ca3af] hover:text-[#e2e4ea]'
                  }`}
                >
                  Seat {seatNum}
                </button>
              );
            })}
          </div>
        )}

        {/* Coursed Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-[#262a34]">
          {activeOrder && activeOrder.items.length > 0 ? (
            ([1, 2, 3, 4] as CourseNumber[]).map(courseNum => {
              const items = coursedItems[courseNum];
              if (!items || items.length === 0) return null;

              const courseTitles: { [key in CourseNumber]: { name: string; fireText: string; color: string } } = {
                1: { name: 'Course 1 • Appetizers & Soup', fireText: 'Fire Apps', color: 'text-[#c29b68]' },
                2: { name: 'Course 2 • Salads & Starters', fireText: 'Fire Salads', color: 'text-emerald-400' },
                3: { name: 'Course 3 • Wood-Fired Entrées & Pasta', fireText: 'FIRE ENTREES', color: 'text-amber-400' },
                4: { name: 'Course 4 • Pastry & Desserts', fireText: 'Fire Dessert', color: 'text-blue-400' },
              };

              const courseConfig = courseTitles[courseNum];
              const isCourseFired = items.some(i => i.status === 'fire' || i.status === 'plated' || i.status === 'bumped');

              return (
                <div key={courseNum} className="pt-2 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider font-serif ${courseConfig.color}`}>
                        {courseConfig.name}
                      </span>
                      {isCourseFired ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950/40 text-emerald-300 border border-emerald-500/50 rounded font-semibold">
                          FIRED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#111215] text-[#9ca3af]/60 border border-[#262a34] rounded">
                          ON HOLD
                        </span>
                      )}
                    </div>

                    {!isCourseFired && activeTableId && (
                      <button
                        onClick={() => fireCourse(activeTableId, courseNum)}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-[#0c0d10] font-bold text-[11px] rounded flex items-center gap-1 shadow transition"
                      >
                        <Flame className="w-3 h-3 text-[#0c0d10]" />
                        <span>{courseConfig.fireText}</span>
                      </button>
                    )}
                  </div>

                  {/* Items within course */}
                  <div className="space-y-1">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                          item.status === 'draft'
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : item.status === 'plated'
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : item.status === 'fire'
                            ? 'bg-rose-950/20 border-rose-500/40'
                            : 'bg-[#111215] border-[#262a34]'
                        }`}
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <span className="font-mono text-[10px] bg-[#111215] text-[#c29b68] px-1.5 py-0.5 rounded border border-[#262a34] shrink-0 font-bold">
                            {item.seatNumber === 'shared' ? 'ALL' : `S${item.seatNumber}`}
                          </span>
                          <div>
                            <div className="font-semibold text-[#e2e4ea]">{item.name}</div>
                            {item.mods && item.mods.length > 0 && (
                              <div className="text-[10px] text-amber-300 font-mono mt-0.5 flex flex-wrap gap-1">
                                {item.mods.map((m, idx) => (
                                  <span key={idx} className="bg-[#1a1d24] px-1 rounded border border-[#262a34]">
                                    • {m}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#e2e4ea]">
                            ${item.price}
                          </span>
                          {item.status === 'draft' ? (
                            <button
                              onClick={() => removeItemFromOrder(activeTableId!, item.id)}
                              className="text-[#9ca3af] hover:text-rose-400 p-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded text-[#9ca3af] bg-[#111215] border border-[#262a34]">
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-[#9ca3af]/60 space-y-2">
              <PlusCircle className="w-8 h-8 opacity-40 text-[#c29b68]" />
              <p className="text-xs">No items rung yet. Select seat and tap items from menu.</p>
            </div>
          )}
        </div>

        {/* Speed Modifiers Selector Bar */}
        <div className="px-3 py-2 bg-[#111215] border-t border-[#262a34]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1 font-serif">
              <Tag className="w-3 h-3 text-[#c29b68]" />
              Speed Modifiers (Apply to next tap)
            </span>
            {pendingMods.length > 0 && (
              <button
                onClick={() => setPendingMods([])}
                className="text-rose-400 hover:underline"
              >
                Clear ({pendingMods.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 max-w-full">
            {SPEED_MODS.map((mod) => {
              const isSelected = pendingMods.includes(mod);
              return (
                <button
                  key={mod}
                  onClick={() => toggleMod(mod)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono whitespace-nowrap transition border shrink-0 ${
                    isSelected
                      ? 'bg-[#c29b68] text-[#0c0d10] font-bold border-[#c29b68]'
                      : 'bg-[#1a1d24] text-[#9ca3af] border-[#262a34] hover:bg-[#222731]'
                  }`}
                >
                  {mod}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ticket Footer & Actions */}
        <div className="p-3 bg-[#111215] border-t border-[#262a34] space-y-2">
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between text-[#9ca3af]">
              <span>Subtotal:</span>
              <span className="text-[#e2e4ea]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#9ca3af]">
              <span>Lakewood Tax (8.25%):</span>
              <span className="text-[#e2e4ea]">${tax.toFixed(2)}</span>
            </div>
            {autoGrat > 0 && (
              <div className="flex justify-between text-[#c29b68]">
                <span>Auto-Grat (20% 6+ Party):</span>
                <span>${autoGrat.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#e2e4ea] pt-1 border-t border-[#262a34]">
              <span className="font-serif">Total:</span>
              <span className="text-emerald-400 font-mono">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              disabled={draftCount === 0}
              onClick={() => activeTableId && sendOrder(activeTableId)}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                draftCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-[#0c0d10] shadow-md'
                  : 'bg-[#1a1d24] text-[#9ca3af]/40 border border-[#262a34] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send New ({draftCount})</span>
            </button>

            <button
              onClick={() => activeTableId && onOpenSplit(activeTableId)}
              className="py-2 bg-[#3b82f6] hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md transition"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Split Check & Pay</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 240 UNION MENU & SPEED-RING CATALOG (7 Cols) */}
      <div className={`lg:col-span-7 flex flex-col bg-[#16181d] rounded-xl border border-[#262a34] shadow-xl overflow-hidden max-w-full ${
        mobileHandheldView === 'menu' ? 'flex' : 'hidden lg:flex'
      }`}>
        {/* Category Tabs & Search */}
        <div className="p-3 bg-[#1a1d24] border-b border-[#262a34] space-y-2 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 max-w-full overflow-hidden">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#c29b68] text-[#0c0d10] font-bold shadow-sm'
                      : 'bg-[#111215] text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#222731]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search menu, wine bin, or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#111215] border border-[#262a34] rounded-lg text-xs text-[#e2e4ea] placeholder-[#9ca3af]/50 focus:outline-none focus:border-[#c29b68]"
              />
            </div>

            {/* Course Override Indicator */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-[#9ca3af] hidden sm:inline font-serif">Course:</span>
              {([1, 2, 3, 4] as CourseNumber[]).map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedCourseOverride(selectedCourseOverride === num ? null : num)}
                  className={`w-6 h-6 rounded text-[11px] font-mono font-bold transition ${
                    selectedCourseOverride === num
                      ? 'bg-[#c29b68] text-[#0c0d10] ring-1 ring-[#c29b68]'
                      : 'bg-[#111215] text-[#9ca3af] hover:text-[#e2e4ea]'
                  }`}
                  title={`Force Course ${num}`}
                >
                  C{num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filteredMenuItems.map(item => {
            const is86 = eightySixList.includes(item.id);
            const isWine = !!item.wineDetails;

            return (
              <button
                key={item.id}
                disabled={is86}
                onClick={() => handleAddItem(item.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition relative group ${
                  is86
                    ? 'bg-rose-950/20 border-rose-900/40 opacity-60 cursor-not-allowed'
                    : 'bg-[#1a1d24] border-[#262a34] hover:border-[#c29b68] hover:bg-[#222731] active:scale-[0.98]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-xs text-[#e2e4ea] group-hover:text-[#c29b68] transition line-clamp-1 font-serif">
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#c29b68] shrink-0">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#9ca3af] line-clamp-2 mt-1 leading-snug">
                    {item.description}
                  </p>

                  {/* Dietary flags and wine bin tags */}
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {item.flags?.map(flag => (
                      <span
                        key={flag}
                        className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                          flag === 'GF'
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                            : flag === 'V'
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#111215] text-[#9ca3af] border border-[#262a34]'
                        }`}
                      >
                        {flag}
                      </span>
                    ))}

                    {isWine && item.wineDetails && (
                      <span className="text-[9px] font-mono bg-[#111215] text-[#c29b68] border border-[#c29b68]/40 px-1 py-0.2 rounded flex items-center gap-0.5">
                        <Wine className="w-2.5 h-2.5 text-[#c29b68]" />
                        {item.wineDetails.binNumber} • {item.wineDetails.vintage} ({item.wineDetails.cellarStock} left)
                      </span>
                    )}

                    <span className="text-[9px] font-mono bg-[#111215] text-[#9ca3af] border border-[#262a34] px-1 py-0.2 rounded uppercase">
                      C{item.courseDefault} • {item.station}
                    </span>
                  </div>
                </div>

                {/* 86 Ribbon */}
                {is86 && (
                  <div className="mt-2 py-0.5 bg-rose-950/80 border border-rose-800/60 rounded text-center text-[10px] font-black tracking-widest text-rose-300 uppercase">
                    86'd Out of Stock
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      </div>

      {/* Lakewood VIP Regular Profile Modal */}
      {showVIPModal && activeTable && activeTable.vipGuest && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowVIPModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <VIPGuestCard 
              table={activeTable} 
              onClose={() => setShowVIPModal(false)}
            />
          </div>
        </div>
      )}

      {/* 80mm Physical Thermal Ticket Chit */}
      {showThermalTicket && activeOrder && (
        <ThermalTicketModal
          order={activeOrder}
          table={activeTable}
          isOpen={showThermalTicket}
          onClose={() => setShowThermalTicket(false)}
        />
      )}
    </div>
  );
};
