'use client';

import React from 'react';
import { VIPGuestProfile, Table } from '../lib/types';
import { useUnionStore } from '../lib/store/useUnionStore';
import { 
  Award, 
  Wine, 
  GlassWater, 
  AlertCircle, 
  Sparkles, 
  History, 
  Plus, 
  X, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

interface VIPGuestCardProps {
  table: Table;
  onClose?: () => void;
  onSelectTable?: () => void;
}

export const VIPGuestCard: React.FC<VIPGuestCardProps> = ({ table, onClose, onSelectTable }) => {
  const { vipGuest } = table;
  const { addItemToOrder, menu } = useUnionStore();
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

  if (!vipGuest) return null;

  const handleQuickAdd = (itemId: string, itemName: string) => {
    addItemToOrder(table.id, itemId, 'shared', 1);
    setAddedItem(itemName);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const getTierBadge = (tier: VIPGuestProfile['annualSpendTier']) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40';
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-[#222731] text-[#c29b68] border-[#c29b68]/40';
    }
  };

  return (
    <div className="bg-[#16181d] border border-[#c29b68]/40 rounded-xl overflow-hidden shadow-2xl shadow-black/80 max-w-lg w-full animate-in fade-in zoom-in-95 duration-200">
      {/* VIP Header Banner */}
      <div className="p-4 bg-gradient-to-r from-[#211b14] via-[#1a1c22] to-[#16181d] border-b border-[#c29b68]/30 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c29b68]/20 border border-[#c29b68]/50 flex items-center justify-center shrink-0 text-[#c29b68]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#e2e4ea] font-serif">
                {vipGuest.name}
              </h3>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getTierBadge(vipGuest.annualSpendTier)}`}>
                {vipGuest.annualSpendTier}
              </span>
            </div>
            <p className="text-xs text-[#c29b68] font-medium mt-0.5">
              {vipGuest.badge}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#9ca3af]">
              <span className="flex items-center gap-1">
                <History className="w-3 h-3 text-[#c29b68]" />
                <strong className="text-[#e2e4ea] font-mono">{vipGuest.visitCount}</strong> Total Visits
              </span>
              <span>•</span>
              <span className="text-[#9ca3af]">Table {table.number} ({table.section.replace('_', ' ')})</span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#222731] transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Guest Preferences Body */}
      <div className="p-4 space-y-3.5 text-xs">
        {/* Preferred Wine & Cocktail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-2.5 bg-[#111215] rounded-lg border border-[#262a34]">
            <div className="flex items-center gap-1.5 text-[#c29b68] font-semibold text-[11px] uppercase tracking-wider mb-1">
              <Wine className="w-3.5 h-3.5" />
              <span>Cellar Preference</span>
            </div>
            <p className="text-[#e2e4ea] font-medium leading-snug">
              {vipGuest.preferredWine}
            </p>
          </div>

          {vipGuest.preferredCocktail && (
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#262a34]">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider mb-1">
                <GlassWater className="w-3.5 h-3.5" />
                <span>Bar Pour Note</span>
              </div>
              <p className="text-[#e2e4ea] font-medium leading-snug">
                {vipGuest.preferredCocktail}
              </p>
            </div>
          )}
        </div>

        {/* Dietary & Allergies Alert */}
        {vipGuest.dietary && (
          <div className="p-2.5 bg-rose-950/20 border border-rose-500/40 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-rose-300 font-bold uppercase tracking-wide text-[10px] block">
                Dietary & Allergy Alert
              </span>
              <p className="text-rose-200/90 font-medium text-[11px]">
                {vipGuest.dietary}
              </p>
            </div>
          </div>
        )}

        {/* Hospitality & Service Notes */}
        <div className="p-2.5 bg-[#111215] rounded-lg border border-[#262a34]">
          <div className="flex items-center gap-1.5 text-[#9ca3af] font-semibold text-[11px] uppercase tracking-wider mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-[#c29b68]" />
            <span>Service & Recognition Standard</span>
          </div>
          <p className="text-[#e2e4ea]/90 leading-relaxed italic text-[11px]">
            "{vipGuest.notes}"
          </p>
        </div>

        {/* 1-Tap Quick Reorder of Favorites */}
        {vipGuest.favoriteItems && vipGuest.favoriteItems.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#c29b68] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Tap Regular Re-order</span>
              </span>
              {addedItem && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
                  <CheckCircle2 className="w-3 h-3" />
                  Added {addedItem}!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {vipGuest.favoriteItems.map(itemId => {
                const menuItem = menu.find(m => m.id === itemId);
                if (!menuItem) return null;
                return (
                  <button
                    key={itemId}
                    type="button"
                    onClick={() => handleQuickAdd(menuItem.id, menuItem.name)}
                    className="p-2 bg-[#1a1d24] hover:bg-[#222731] border border-[#262a34] hover:border-[#c29b68]/60 rounded-lg text-left transition group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-[#9ca3af] block capitalize">{menuItem.category}</span>
                      <span className="text-[11px] font-bold text-[#e2e4ea] group-hover:text-[#c29b68] transition line-clamp-1">
                        {menuItem.name}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#9ca3af]">${menuItem.price}</span>
                      <span className="text-[10px] text-[#c29b68] font-bold flex items-center gap-0.5">
                        <Plus className="w-2.5 h-2.5" /> Fire
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-[#111215] border-t border-[#262a34] flex items-center justify-between">
        <div className="text-[11px] text-[#9ca3af]">
          Server: <span className="text-[#e2e4ea] font-medium">{table.serverName || 'Unassigned'}</span>
        </div>
        {onSelectTable && (
          <button
            type="button"
            onClick={onSelectTable}
            className="px-3.5 py-1.5 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-lg transition shadow-sm"
          >
            Open POS Ticket
          </button>
        )}
      </div>
    </div>
  );
};
