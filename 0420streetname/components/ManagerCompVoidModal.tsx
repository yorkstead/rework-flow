'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  Check, 
  AlertTriangle, 
  DollarSign, 
  Percent, 
  Lock, 
  Award, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Trash2 
} from 'lucide-react';
import { OrderItem } from '../lib/types';

interface ManagerCompVoidModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem?: OrderItem | null;
  mode: 'item' | 'check';
  tableNumber: string;
  onConfirmCompItem?: (orderItemId: string, reason: string, managerName: string) => void;
  onConfirmVoidItem?: (orderItemId: string, reason: string, managerName: string) => void;
  onConfirmCompCheck?: (discountPercent: number, reason: string, managerName: string) => void;
}

const VOID_REASONS = [
  'Server Order Entry Error',
  'Guest Changed Mind (Before Cooking)',
  'Duplicate Ticket Fired',
  'Kitchen Spoilage / Remake',
  'Customer Left / Walked Before Fired',
];

const COMP_REASONS = [
  'VIP Regular Courtesy (Michael/Owner)',
  'Hospitality Goodwill / Table Visit',
  'Kitchen Delay Service Recovery (>25m)',
  'Food Quality / Not to Guest Liking',
  'St. Anthony / Fed Center Corporate Director',
  'Beverage on the House',
];

const CHECK_DISCOUNTS = [
  { percent: 10, label: '10% Industry / Fed Center' },
  { percent: 20, label: '20% VIP Regular / Friend' },
  { percent: 50, label: '50% Manager Discretion' },
  { percent: 100, label: '100% Full Comp on the House' },
];

export const ManagerCompVoidModal: React.FC<ManagerCompVoidModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  mode,
  tableNumber,
  onConfirmCompItem,
  onConfirmVoidItem,
  onConfirmCompCheck,
}) => {
  const [pin, setPin] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<'comp' | 'void'>('comp');
  const [selectedReason, setSelectedReason] = useState<string>(COMP_REASONS[0]);
  const [selectedDiscountPercent, setSelectedDiscountPercent] = useState<number>(20);
  const [pinError, setPinError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClear = () => {
    setPin('');
    setPinError(false);
  };

  const executeAction = () => {
    // Valid manager PINs: 2400 (240 Union default), 1234, or any 4-digit PIN for demo flexibility
    if (pin.length !== 4) {
      setPinError(true);
      return;
    }

    const managerName = pin === '2400' ? 'Michael (GM/Owner)' : 'Floor Manager Marcus';

    if (mode === 'check' && onConfirmCompCheck) {
      onConfirmCompCheck(selectedDiscountPercent, selectedReason, managerName);
      onClose();
      return;
    }

    if (mode === 'item' && targetItem) {
      if (selectedAction === 'comp' && onConfirmCompItem) {
        onConfirmCompItem(targetItem.id, selectedReason, managerName);
      } else if (selectedAction === 'void' && onConfirmVoidItem) {
        onConfirmVoidItem(targetItem.id, selectedReason, managerName);
      }
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#16181d] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#241a10] via-[#1c1815] to-[#16181d] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif">
                  {mode === 'check' ? 'Table Check Comp' : 'Manager Item Authorization'}
                </h3>
                <span className="text-[10px] font-mono uppercase bg-amber-500 text-black font-black px-1.5 py-0.2 rounded">
                  Table #{tableNumber}
                </span>
              </div>
              <p className="text-xs text-[#9ca3af]">
                Audited & cryptographically recorded in shift ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#222731] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Target Summary */}
          {mode === 'item' && targetItem && (
            <div className="p-3 bg-[#111215] rounded-xl border border-[#262a34] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#9ca3af] uppercase block">Selected Item:</span>
                <span className="text-sm font-bold text-white block mt-0.5">{targetItem.name}</span>
                <span className="text-[11px] text-[#c29b68] font-mono">Seat {targetItem.seatNumber === 'shared' ? 'ALL' : targetItem.seatNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-mono font-black text-white">${targetItem.price.toFixed(2)}</span>
                <span className="text-[10px] text-[#9ca3af] block uppercase">{targetItem.status}</span>
              </div>
            </div>
          )}

          {/* Mode Selector: COMP vs VOID (Only for Item mode) */}
          {mode === 'item' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAction('comp');
                  setSelectedReason(COMP_REASONS[0]);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  selectedAction === 'comp'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow'
                    : 'bg-[#111215] border-[#262a34] text-[#9ca3af] hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>COMP (Courtesy / $0)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAction('void');
                  setSelectedReason(VOID_REASONS[0]);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  selectedAction === 'void'
                    ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow'
                    : 'bg-[#111215] border-[#262a34] text-[#9ca3af] hover:text-white'
                }`}
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>VOID (Mistake / Spoilage)</span>
              </button>
            </div>
          )}

          {/* Check Discount Percent Selector (Only for Check mode) */}
          {mode === 'check' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#c29b68] uppercase font-mono tracking-wider block">
                Select Discount / Comp Percentage:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CHECK_DISCOUNTS.map(d => (
                  <button
                    key={d.percent}
                    type="button"
                    onClick={() => setSelectedDiscountPercent(d.percent)}
                    className={`p-2 rounded-lg border text-xs font-bold transition flex items-center justify-between ${
                      selectedDiscountPercent === d.percent
                        ? 'bg-[#c29b68] text-[#0c0d10] border-[#c29b68] shadow'
                        : 'bg-[#111215] border-[#262a34] text-[#e2e4ea] hover:bg-[#1a1d24]'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className="font-mono font-black">{d.percent}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reason Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#c29b68] uppercase font-mono tracking-wider block">
              Required Reason for Audit Trail:
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-2.5 bg-[#111215] border border-[#262a34] rounded-xl text-xs text-white focus:border-amber-500 outline-none"
            >
              {(selectedAction === 'comp' ? COMP_REASONS : VOID_REASONS).map((reason, idx) => (
                <option key={idx} value={reason} className="bg-[#16181d] text-white">
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Manager Security PIN Pad */}
          <div className="p-3.5 bg-[#111215] rounded-xl border border-[#262a34] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Enter Manager 4-Digit PIN:</span>
              </div>
              <span className="text-[10px] font-mono text-[#9ca3af]/60">
                (Default: <strong>2400</strong> or <strong>1234</strong>)
              </span>
            </div>

            {/* PIN Display Digits */}
            <div className={`p-2 rounded-lg border flex items-center justify-center gap-3 font-mono text-xl tracking-widest ${
              pinError 
                ? 'bg-rose-950/30 border-rose-500/50 text-rose-300' 
                : 'bg-[#16181d] border-[#262a34] text-[#c29b68]'
            }`}>
              {[0, 1, 2, 3].map(idx => (
                <span key={idx} className="w-4 text-center">
                  {pin[idx] ? '●' : '○'}
                </span>
              ))}
            </div>

            {pinError && (
              <p className="text-[11px] text-rose-400 font-mono text-center">
                * Please enter a 4-digit manager PIN (e.g. 2400)
              </p>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinInput(num)}
                  className="py-2.5 bg-[#1a1d24] hover:bg-[#252a35] text-white font-mono font-bold text-sm rounded-lg transition border border-[#262a34]"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 bg-[#1a1d24] hover:bg-[#252a35] text-[#9ca3af] font-mono text-xs rounded-lg transition border border-[#262a34]"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handlePinInput('0')}
                className="py-2.5 bg-[#1a1d24] hover:bg-[#252a35] text-white font-mono font-bold text-sm rounded-lg transition border border-[#262a34]"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 bg-[#1a1d24] hover:bg-[#252a35] text-rose-400 font-mono text-xs rounded-lg transition border border-[#262a34]"
              >
                DEL
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#111215] border-t border-[#262a34] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1a1d24] hover:bg-[#222731] text-[#9ca3af] hover:text-white rounded-lg text-xs font-bold transition border border-[#262a34]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={executeAction}
            className={`px-5 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-md ${
              selectedAction === 'void' && mode === 'item'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-black font-black'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Authorize {mode === 'check' ? 'Check Comp' : selectedAction.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
