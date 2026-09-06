'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Lock, 
  FileSpreadsheet, 
  RotateCcw, 
  Clock, 
  AlertTriangle, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight,
  HelpCircle,
  HardDrive,
  Printer,
  FileText,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useUnionStore } from '../lib/store/useUnionStore';

interface PilotGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PilotGuaranteeModal: React.FC<PilotGuaranteeModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useUnionStore();
  const [selectedDuration, setSelectedDuration] = useState<'7' | '14'>('14');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const exportToastReconciliationCSV = () => {
    const headers = [
      'Timestamp_ISO',
      'Transaction_ID',
      'Action',
      'Table_Number',
      'Server_Name',
      'Description',
      'Amount_USD',
      'Tax_Lakewood_8.25pct',
      'AutoGrat_20pct',
      'Cryptographic_Hash_SHA256'
    ];

    const rows = auditLogs.map(log => {
      const dateStr = new Date(log.timestamp).toISOString();
      const amount = log.amount || 0;
      const tax = log.action === 'SETTLE_CHECK' ? (amount * 0.0825).toFixed(2) : '0.00';
      const autoGrat = log.action === 'SETTLE_CHECK' ? (amount * 0.20).toFixed(2) : '0.00';
      const cleanDesc = `"${log.description.replace(/"/g, '""')}"`;
      return [
        dateStr,
        log.id,
        log.action,
        log.tableNumber || 'N/A',
        `"${log.serverName}"`,
        cleanDesc,
        amount.toFixed(2),
        tax,
        autoGrat,
        log.hash
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `240_Union_Shift_Reconciliation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#16181d] border border-[#262a34] w-full max-w-4xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-black shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#e2e4ea] font-serif">
                  Zero-Risk In-Restaurant Pilot Agreement
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  Guaranteed 0% Risk
                </span>
              </div>
              <p className="text-xs text-[#9ca3af]">
                100% In-Restaurant Implementation • Cryptographic Audit Trail • Hate It = Walk Away Owe $0.00
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#262a34] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* Trial Duration Selector & Value Banner */}
          <div className="bg-gradient-to-br from-[#1c241e] via-[#16181d] to-[#1a1d24] p-5 rounded-2xl border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  The "Hate It & Pay Nothing" Guarantee
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white font-serif">
                  {selectedDuration}-Day Live Shift Test In 240 Union
                </h4>
                <p className="text-xs text-[#9ca3af] mt-1 max-w-xl leading-relaxed">
                  We install UnionOS on your terminals side-by-side or as your primary system for {selectedDuration} days. Every ticket, tender, and coursing action is recorded in an immutable audit ledger so Toast or your legacy bookkeeper never loses a single cent.
                </p>
              </div>

              {/* Selector Toggle */}
              <div className="flex items-center bg-[#111215] p-1 rounded-xl border border-[#262a34] shrink-0">
                <button
                  onClick={() => setSelectedDuration('7')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                    selectedDuration === '7'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  7-Day Pilot
                </button>
                <button
                  onClick={() => setSelectedDuration('14')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                    selectedDuration === '14'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  14-Day Pilot (Rec)
                </button>
              </div>
            </div>

            {/* Core 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#262a34]/80">
              <div className="bg-[#111215]/80 p-3 rounded-xl border border-[#262a34] flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">100% Immutable Ledger</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">Cryptographic SHA-256 hash on every fired ticket and swipe. Impossible to lose or alter data.</div>
                </div>
              </div>

              <div className="bg-[#111215]/80 p-3 rounded-xl border border-[#262a34] flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Instant 1-Click Rollback</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">Toast hardware or legacy POS remains untouched and standby-ready in your manager station.</div>
                </div>
              </div>

              <div className="bg-[#111215]/80 p-3 rounded-xl border border-[#262a34] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c29b68] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">You Owe Exactly $0.00</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">If staff or kitchen doesn't love it, unplug the appliance. No setup fees, no contracts.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Immutable Audit Trail Viewer */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#c29b68]" />
                <h4 className="text-sm font-bold text-[#e2e4ea] font-mono uppercase tracking-wider">
                  Live Shift Cryptographic Audit Log (Tamper-Proof)
                </h4>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-mono text-[#9ca3af]">
                  {auditLogs.length} verified operations
                </span>
                <button
                  onClick={exportToastReconciliationCSV}
                  className="px-2.5 py-1 bg-[#1a1d24] hover:bg-[#252b37] text-[#c29b68] border border-[#c29b68]/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
                  title="Download full shift audit log for Toast & QuickBooks reconciliation"
                >
                  {exported ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{exported ? 'Exported CSV!' : 'Export Toast/Excel CSV'}</span>
                </button>
              </div>
            </div>

            <div className="bg-[#111215] border border-[#262a34] rounded-xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto divide-y divide-[#1e222b] font-mono text-xs">
                {auditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="p-3 hover:bg-[#16181d] transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded shrink-0 ${
                        log.action === 'SETTLE_CHECK' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        log.action === 'FIRE_COURSE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        log.action === 'CELLAR_DECREMENT' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        'bg-[#262a34] text-[#9ca3af]'
                      }`}>
                        {log.action}
                      </span>
                      <div className="truncate">
                        <span className="text-white font-semibold">{log.description}</span>
                        {log.tableNumber && (
                          <span className="text-[#9ca3af] ml-2 text-[11px]">Table: {log.tableNumber}</span>
                        )}
                        <span className="text-[#6b7280] ml-2 text-[11px]">By: {log.serverName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      {log.amount !== undefined && (
                        <span className="text-emerald-400 font-bold font-mono">
                          {log.amount > 0 ? `+$${log.amount.toFixed(2)}` : `-$${Math.abs(log.amount).toFixed(2)}`}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyHash(log.hash)}
                        className="text-[10px] text-[#9ca3af] hover:text-[#c29b68] flex items-center gap-1 bg-[#1a1d24] px-2 py-0.5 rounded border border-[#262a34]"
                        title="Copy immutable block hash"
                      >
                        {copiedHash === log.hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-[#c29b68]" />}
                        <span>{log.hash.substring(0, 8)}...</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#6b7280] italic">
              * Every action performed in this system generates a verifiable hash block. In case of audit or disagreement, 100% of shift history is exportable to Excel / QuickBooks.
            </p>
          </div>

          {/* Direct Verbal Pitch Script for 240 Union Owner */}
          <div className="bg-[#1a1d24] border border-[#262a34] rounded-xl p-4">
            <h5 className="text-xs font-bold text-[#c29b68] uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
              <span>What to Say to Michael / General Manager:</span>
            </h5>
            <blockquote className="text-xs text-[#e2e4ea] italic leading-relaxed border-l-2 border-[#c29b68] pl-3 py-1 font-serif">
              "Michael, here is what I propose: Let me put this in your restaurant for 14 days. We run your lunch or dinner shifts on it. Every order, check split, and wine bottle is logged with an immutable audit trail—so your accountant and Toast backup have every penny accounted for. If your servers don’t shave 15 minutes off Denver Fed Center split checks, or your kitchen doesn't love the coursing pass, you unplug it and walk away. You don't owe me a single dime. Zero risk on your balance sheet."
            </blockquote>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#1a1d24] border-t border-[#262a34] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#9ca3af]">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local appliance install • Zero cloud subscription lock-in</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/leave-behind"
              target="_blank"
              className="w-full sm:w-auto px-4 py-2 bg-[#111215] hover:bg-[#1a1d24] text-[#c29b68] border border-[#c29b68]/40 font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print 1-Page Leave-Behind (PDF)</span>
            </Link>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Accept Pilot Terms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
