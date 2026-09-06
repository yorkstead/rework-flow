'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Plus, 
  X, 
  Bell, 
  Sparkles, 
  DollarSign, 
  CalendarClock,
  PhoneCall,
  UserCheck
} from 'lucide-react';

export interface WaitlistParty {
  id: string;
  guestName: string;
  partySize: number;
  phone: string;
  quotedWaitMins: number;
  createdAt: number;
  seatingPreference: 'Booth' | 'Dining' | 'Patio' | 'First Available';
  notes?: string;
  pagedAt?: number;
  status: 'waiting' | 'paged' | 'seated' | 'cancelled';
}

const INITIAL_WAITLIST: WaitlistParty[] = [
  {
    id: 'wait-1',
    guestName: 'Dr. Jennifer Walsh',
    partySize: 4,
    phone: '(303) 555-0184',
    quotedWaitMins: 20,
    createdAt: Date.now() - 16 * 60 * 1000,
    seatingPreference: 'Booth',
    notes: 'St. Anthony Hospital surgical team dinner • celebrating grant',
    status: 'waiting',
  },
  {
    id: 'wait-2',
    guestName: 'Marcus Lindholm',
    partySize: 2,
    phone: '(720) 555-9241',
    quotedWaitMins: 15,
    createdAt: Date.now() - 14 * 60 * 1000,
    seatingPreference: 'First Available',
    notes: 'Having cocktails at Bar Top 2 while waiting',
    status: 'paged',
    pagedAt: Date.now() - 2 * 60 * 1000,
  },
  {
    id: 'wait-3',
    guestName: 'Senator Paul Sandoval',
    partySize: 6,
    phone: '(303) 555-7733',
    quotedWaitMins: 30,
    createdAt: Date.now() - 5 * 60 * 1000,
    seatingPreference: 'Dining',
    notes: 'VIP regular • prefers quiet corner booth if possible',
    status: 'waiting',
  },
];

interface WaitlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSeatParty?: (party: WaitlistParty) => void;
}

export const WaitlistDrawer: React.FC<WaitlistDrawerProps> = ({ isOpen, onClose, onSeatParty }) => {
  const [parties, setParties] = useState<WaitlistParty[]>(INITIAL_WAITLIST);
  const [newGuestName, setNewGuestName] = useState('');
  const [newPartySize, setNewPartySize] = useState(2);
  const [newPhone, setNewPhone] = useState('');
  const [newQuotedMins, setNewQuotedMins] = useState(20);
  const [newPref, setNewPref] = useState<WaitlistParty['seatingPreference']>('First Available');
  const [newNotes, setNewNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [lastPagedMessage, setLastPagedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newParty: WaitlistParty = {
      id: `wait-${Date.now()}`,
      guestName: newGuestName.trim(),
      partySize: newPartySize,
      phone: newPhone || '(303) 555-0100',
      quotedWaitMins: newQuotedMins,
      createdAt: Date.now(),
      seatingPreference: newPref,
      notes: newNotes,
      status: 'waiting',
    };

    setParties([newParty, ...parties]);
    setNewGuestName('');
    setNewPhone('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handlePageGuest = (partyId: string) => {
    const party = parties.find(p => p.id === partyId);
    if (!party) return;

    setParties(parties.map(p => 
      p.id === partyId 
        ? { ...p, status: 'paged' as const, pagedAt: Date.now() }
        : p
    ));

    const smsText = `240 UNION: Hi ${party.guestName.split(' ')[0]}, your table for ${party.partySize} is now ready! Please see the host stand within 5 minutes.`;
    setLastPagedMessage(smsText);
    setTimeout(() => setLastPagedMessage(null), 5000);
  };

  const handleMarkSeated = (partyId: string) => {
    const party = parties.find(p => p.id === partyId);
    if (party && onSeatParty) {
      onSeatParty(party);
    }
    setParties(parties.map(p => 
      p.id === partyId 
        ? { ...p, status: 'seated' as const }
        : p
    ));
  };

  const waitingCount = parties.filter(p => p.status === 'waiting' || p.status === 'paged').length;
  const waitingCovers = parties
    .filter(p => p.status === 'waiting' || p.status === 'paged')
    .reduce((sum, p) => sum + p.partySize, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#16181d] border-l border-[#262a34] shadow-2xl h-full flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c29b68]/20 border border-[#c29b68]/50 flex items-center justify-center text-[#c29b68]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#e2e4ea] font-serif">
                  Host Stand SMS Waitlist
                </h3>
                <span className="text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">
                  $0 / Cover
                </span>
              </div>
              <p className="text-xs text-[#9ca3af]">
                {waitingCount} Parties Waiting ({waitingCovers} Covers) • Direct Twilio SMS Carrier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#222731] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live SMS Sent Toast Banner */}
        {lastPagedMessage && (
          <div className="p-3 bg-emerald-950/60 border-b border-emerald-500/50 flex items-start gap-2.5 animate-in slide-in-from-top duration-200">
            <Send className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200">
              <span className="font-bold text-emerald-300 block uppercase tracking-wider text-[10px]">
                SMS Dispatched Instantly via Local Appliance:
              </span>
              <p className="font-mono text-[11px] mt-0.5 text-[#e2e4ea]">
                "{lastPagedMessage}"
              </p>
            </div>
          </div>
        )}

        {/* 3rd Party Cost Displacement Banner */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-[#211b14] via-[#1a1c22] to-[#16181d] border-b border-[#c29b68]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#c29b68]">
            <Sparkles className="w-4 h-4 text-[#c29b68] shrink-0" />
            <span className="font-medium">
              Eliminates OpenTable / Resy Guest Seating Fees:
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/30">
            Saves ~$7,200 / yr
          </span>
        </div>

        {/* Action Button to Add Guest */}
        <div className="p-3 bg-[#111215] border-b border-[#262a34] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
            Active Queue
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Walk-In Party</span>
          </button>
        </div>

        {/* Add Walk-In Party Drawer Form */}
        {showAddForm && (
          <form onSubmit={handleAddParty} className="p-4 bg-[#1a1d24] border-b border-[#262a34] space-y-3 animate-in slide-in-from-top duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Guest Name / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Thomas Vance"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#111215] border border-[#262a34] rounded text-xs text-[#e2e4ea] focus:outline-none focus:border-[#c29b68]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Mobile Phone (SMS Pager)
                </label>
                <input
                  type="tel"
                  placeholder="(303) 555-0199"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#111215] border border-[#262a34] rounded text-xs text-[#e2e4ea] focus:outline-none focus:border-[#c29b68]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Party Size
                </label>
                <select
                  value={newPartySize}
                  onChange={(e) => setNewPartySize(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#111215] border border-[#262a34] rounded text-xs text-[#e2e4ea]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
                    <option key={n} value={n}>{n} Guests</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Quoted Wait
                </label>
                <select
                  value={newQuotedMins}
                  onChange={(e) => setNewQuotedMins(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#111215] border border-[#262a34] rounded text-xs text-[#e2e4ea]"
                >
                  {[10, 15, 20, 25, 30, 40, 50, 60].map(m => (
                    <option key={m} value={m}>{m} Mins</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Seating Area
                </label>
                <select
                  value={newPref}
                  onChange={(e) => setNewPref(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-[#111215] border border-[#262a34] rounded text-xs text-[#e2e4ea]"
                >
                  <option value="First Available">First Available</option>
                  <option value="Booth">Booth</option>
                  <option value="Dining">Dining</option>
                  <option value="Patio">Patio</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                Guest Notes / Hospital / St. Anthony Surgical Team
              </label>
              <input
                type="text"
                placeholder="e.g. Needs high chair, enjoying drinks at bar"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#111215] border border-[#262a34] rounded text-xs text-[#e2e4ea] focus:outline-none focus:border-[#c29b68]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-[#9ca3af] hover:text-[#e2e4ea]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded transition"
              >
                Send Confirmation SMS & Add
              </button>
            </div>
          </form>
        )}

        {/* Scrollable Party Queue */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {parties.map((party) => {
            const elapsedMins = Math.floor((Date.now() - party.createdAt) / 60000);
            const isOverdue = elapsedMins > party.quotedWaitMins;

            return (
              <div 
                key={party.id}
                className={`p-3.5 rounded-xl border transition ${
                  party.status === 'paged'
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : party.status === 'seated'
                    ? 'bg-[#111215]/50 border-[#262a34] opacity-50'
                    : 'bg-[#1a1d24] border-[#262a34] hover:border-[#c29b68]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#e2e4ea] font-serif">
                        {party.guestName}
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#c29b68] bg-[#111215] px-2 py-0.5 rounded border border-[#262a34]">
                        {party.partySize} Guests
                      </span>
                      <span className="text-[10px] text-[#9ca3af] bg-[#222731] px-1.5 py-0.5 rounded">
                        {party.seatingPreference}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#9ca3af]">
                      <span className="font-mono text-[#9ca3af]">{party.phone}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#c29b68]" />
                        Waiting {elapsedMins}m / Quoted {party.quotedWaitMins}m
                      </span>
                      {isOverdue && party.status === 'waiting' && (
                        <span className="text-rose-400 font-bold text-[10px] uppercase tracking-wider animate-pulse">
                          Wait Exceeded
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {party.status === 'paged' ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                        <Bell className="w-3 h-3 animate-bounce" />
                        PAGED
                      </span>
                    ) : party.status === 'seated' ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        SEATED
                      </span>
                    ) : null}
                  </div>
                </div>

                {party.notes && (
                  <p className="mt-2 text-xs text-[#e2e4ea]/80 bg-[#111215] p-2 rounded border border-[#262a34] italic">
                    "{party.notes}"
                  </p>
                )}

                {/* Card Actions */}
                {party.status !== 'seated' && (
                  <div className="mt-3 pt-2.5 border-t border-[#262a34] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePageGuest(party.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        party.status === 'paged'
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/50'
                          : 'bg-[#111215] hover:bg-[#222731] text-[#e2e4ea] border border-[#c29b68]/50'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5 text-[#c29b68]" />
                      <span>{party.status === 'paged' ? 'Re-Page via SMS' : 'Page Guest (SMS Ready)'}</span>
                    </button>

                    <button
                      onClick={() => handleMarkSeated(party.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Seat at Table</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-[#111215] border-t border-[#262a34] flex items-center justify-between text-xs text-[#9ca3af]">
          <span>Auto-sync with KDS Expo & Host Screen</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#222731] hover:bg-[#2c323f] text-[#e2e4ea] rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
