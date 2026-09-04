"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Download,
  Printer,
  X,
  Smartphone,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ReworkJob, RATES } from "@/lib/types";
import { playNotificationChime } from "@/lib/sound";

export default function OfficeBillingPage() {
  const [jobs, setJobs] = useState<ReworkJob[]>([]);
  const [activeJob, setActiveJob] = useState<ReworkJob | null>(null);
  const [newArrivalAlert, setNewArrivalAlert] = useState<ReworkJob | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const prevJobCountRef = useRef<number>(0);

  // Poll for jobs every 1500ms
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        // If new job arrived
        if (prevJobCountRef.current > 0 && data.jobs.length > prevJobCountRef.current) {
          const newest = data.jobs[0];
          setNewArrivalAlert(newest);
          playNotificationChime();

          // Auto-hide alert after 8 seconds
          setTimeout(() => {
            setNewArrivalAlert((curr) => (curr?.id === newest.id ? null : curr));
          }, 8000);
        }

        prevJobCountRef.current = data.jobs.length;
        setJobs(data.jobs);
      }
    } catch (err) {
      console.warn("Poll jobs error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 1500);
    return () => clearInterval(interval);
  }, []);

  // Compute metrics
  const totalRevenue = jobs.reduce((sum, j) => sum + (j.totalAmount || 0), 0);
  const activeBaysOccupied = Math.min(6, jobs.filter((j) => j.status === "In Progress").length + 3);

  // Reset Demo
  const handleReset = async () => {
    try {
      const res = await fetch("/api/jobs?reset=true");
      const data = await res.json();
      if (data.success) {
        prevJobCountRef.current = data.jobs.length;
        setJobs(data.jobs);
        setNewArrivalAlert(null);
      }
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = "Job_ID,Date,Trailer_Num,Carrier_Name,Service_Type,Bay_Num,Driver_Name,Driver_Phone,Pallets_Qty,Wrap_Qty,Labor_Hours,Scale_Ticket,Grand_Total,Status\n";
    jobs.forEach((j) => {
      csv += `${j.id},${j.createdAt.split("T")[0]},${j.trailerNumber},"${j.carrierName}","${j.serviceType}",${j.bayNumber},"${j.driverName}","${j.driverPhone}",${j.palletsCount},${j.wrapCount},${j.laborHours},${j.scaleCheck ? "Yes" : "No"},${j.totalAmount},${j.status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Denver_Express_Rework_QuickBooks_Export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#060d17] text-slate-100 flex flex-col font-sans">
      
      {/* NEW ARRIVAL FLOATING TOAST / BANNER */}
      {newArrivalAlert && (
        <div className={`fixed top-16 right-6 z-50 max-w-md w-full bg-slate-900 border-2 ${newArrivalAlert.status === "Reserved" ? "border-amber-400" : "border-emerald-400"} text-white p-4 rounded-2xl shadow-2xl shadow-black/80 flex items-start justify-between gap-3 animate-bounce`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${newArrivalAlert.status === "Reserved" ? "bg-amber-500 text-slate-950" : "bg-emerald-500 text-slate-950"} flex items-center justify-center font-black shrink-0`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${newArrivalAlert.status === "Reserved" ? "bg-amber-400 text-slate-950" : "bg-emerald-400 text-slate-950"} font-bold uppercase`}>
                  {newArrivalAlert.status === "Reserved" ? "Pre-Arrival Bay Hold" : "Live Sync from Dock"}
                </span>
                <span className="text-xs text-slate-300 font-mono font-bold">{newArrivalAlert.id}</span>
              </div>
              <h4 className="font-bold text-sm text-white mt-1">
                {newArrivalAlert.status === "Reserved"
                  ? `Trailer ${newArrivalAlert.trailerNumber} Reserved ${newArrivalAlert.bayNumber}!`
                  : `Trailer ${newArrivalAlert.trailerNumber} Completed!`}
              </h4>
              <p className="text-xs text-slate-300">
                {newArrivalAlert.carrierName} • {newArrivalAlert.status === "Reserved" ? `ETA: ${newArrivalAlert.eta || "30 Mins"}` : newArrivalAlert.bayNumber}
              </p>
              <div className="text-xs font-mono font-bold text-[#d4af37] mt-1">
                {newArrivalAlert.status === "Reserved" ? `Estimated: $${newArrivalAlert.totalAmount.toFixed(2)}` : `+$${newArrivalAlert.totalAmount.toFixed(2)} Ready to Bill`}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setNewArrivalAlert(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
            {newArrivalAlert.status !== "Reserved" && (
              <button
                onClick={() => {
                  setActiveJob(newArrivalAlert);
                  setNewArrivalAlert(null);
                }}
                className="px-3 py-1 bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold hover:bg-emerald-300 transition"
              >
                View Packet
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-[#0b192c] border-b border-[#233f63] sticky top-0 z-40 px-6 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-[#0b192c] flex items-center justify-center font-black text-lg">
            DE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white">Denver Express Warehousing</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-[#162b45] text-blue-400 border border-[#233f63] font-semibold">
                Office Billing Board
              </span>
            </div>
            <p className="text-xs text-slate-400">Terminal 6030 Washington St, Ste 130 • I-25 & I-70 Hub</p>
          </div>
        </div>

        {/* Live sync & actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live WebSocket / Poll Active (1.5s)
          </div>

          {/* Audio toggle button */}
          <button
            onClick={() => {
              playNotificationChime();
              setAudioEnabled(true);
            }}
            className="text-xs px-2.5 py-1 rounded-lg border border-[#233f63] text-slate-300 hover:text-white bg-[#162b45] flex items-center gap-1.5"
            title="Test audio chime"
          >
            <span>🔊 {audioEnabled ? "Sound Ready" : "Test Chime"}</span>
          </button>

          <Link
            href="/dock"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-[#162b45] hover:bg-[#233f63] text-[#d4af37] border border-[#233f63] text-xs font-bold transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open Phone Dock View</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </header>

      {/* Main Board Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">

        {/* Demo Controller Info Banner */}
        <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block">Live Pitch Setup:</span>
              <span className="text-slate-300">
                Keep this laptop screen visible. On your smartphone, navigate to <code className="text-[#d4af37] font-mono font-bold">/dock</code>. When you tap "Dispatch Certificate" on your phone, this board updates instantly!
              </span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Jobs</span>
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Rework Billing</span>
            <span className="text-3xl font-black text-[#d4af37] mt-1 block font-mono">
              ${totalRevenue.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {jobs.length} trailers serviced today
            </span>
          </div>

          <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Bay Occupancy</span>
            <span className="text-3xl font-black text-white mt-1 block font-mono">
              {activeBaysOccupied} / 6
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Bays 1 & 3 currently available
            </span>
          </div>

          <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Carrier Dispute Rate</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block font-mono">
              0.0%
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              100% digital driver signatures
            </span>
          </div>

          <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Turnaround Time</span>
            <span className="text-3xl font-black text-blue-400 mt-1 block font-mono">
              52 min
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Inbound intake to gate release
            </span>
          </div>

        </div>

        {/* Rework Activity Table */}
        <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Table Header Controls */}
          <div className="p-5 border-b border-[#233f63] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Denver Express Live Operations Log</h3>
              <p className="text-xs text-slate-400">Terminal 6030 Washington St • Verified audit certificates</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-[#162b45] hover:bg-[#233f63] border border-[#233f63] text-xs font-bold text-slate-200 transition flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export QuickBooks CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0b192c] text-xs uppercase text-slate-400 font-semibold border-b border-[#233f63]">
                <tr>
                  <th className="py-3.5 px-4">Job ID</th>
                  <th className="py-3.5 px-4">Trailer / Carrier</th>
                  <th className="py-3.5 px-4">Bay</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Supplies Logged</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Audit Packet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233f63]/60 text-xs sm:text-sm">
                {jobs.map((job, idx) => (
                  <tr
                    key={job.id}
                    className={`hover:bg-[#162b45]/50 transition ${idx === 0 ? "bg-[#162b45]/20" : ""}`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                      {job.id}
                      {idx === 0 && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-bold border border-emerald-500/30">
                          NEWEST
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white font-mono">{job.trailerNumber}</div>
                      <div className="text-xs text-slate-400">{job.carrierName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#0b192c] border border-[#233f63] font-mono text-xs text-slate-200">
                        {job.bayNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {job.serviceType}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {job.palletsCount} Pallets • {job.wrapCount} Wrap • {job.laborHours.toFixed(2)}h Labor
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-base">
                      ${job.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {job.status === "Reserved" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-fit animate-pulse">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Incoming Hold (ETA {job.eta || "30m"})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Signed & Dispatched
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {job.status === "Reserved" ? (
                        <span className="text-xs text-amber-400 font-mono font-semibold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                          Bay Held
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveJob(job)}
                          className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs transition"
                        >
                          View Certificate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* ========================================================= */}
      {/* MODAL: PRINTABLE REWORK CERTIFICATE & EVIDENCE PACKET    */}
      {/* ========================================================= */}
      {activeJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-300">
            
            {/* Modal Non-Print Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-sm">Certificate #{activeJob.id} — Verified Audit Packet</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setActiveJob(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="certificate-print-area" className="p-8 space-y-6 text-slate-900 bg-white">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-black text-sm">
                      DE
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Denver Express</h2>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Warehousing, Cross-Docking & Freight Rework</p>
                  <p className="text-xs text-slate-600">6030 Washington St, Suite 130 • Denver, CO 80216 • (303) 289-4343</p>
                  <p className="text-[11px] text-slate-500">USDOT: 4514095 • MC-1787583 • FDA Food-Grade Certified Facility</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-slate-100 border border-slate-300 rounded px-3 py-1 font-mono text-xs font-bold text-slate-900">
                    CERTIFICATE #{activeJob.id}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Date: {new Date(activeJob.createdAt).toLocaleDateString()} • {new Date(activeJob.createdAt).toLocaleTimeString()} MT
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5">● STATUS: VERIFIED ROAD-READY</div>
                </div>
              </div>

              {/* Load Metadata Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Trailer #</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{activeJob.trailerNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Carrier</span>
                  <span className="font-bold text-sm text-slate-900">{activeJob.carrierName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Assigned Bay</span>
                  <span className="font-bold text-sm text-slate-900">{activeJob.bayNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Driver Name</span>
                  <span className="font-bold text-sm text-slate-900">{activeJob.driverName}</span>
                </div>
              </div>

              {/* Photo Evidence Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                  <span>Photographic Audit Evidence (Before & After)</span>
                  <span className="text-[10px] font-normal text-slate-500">Tamper-Proof GPS & Timestamp Stamped</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="border border-red-200 rounded-lg p-2.5 bg-red-50/40">
                    <div className="flex items-center justify-between text-[11px] font-bold text-red-700 mb-1.5">
                      <span>BEFORE: Inbound Shift Condition</span>
                      <span className="text-[10px] bg-red-200 text-red-800 px-1 rounded">REJECTED</span>
                    </div>
                    {activeJob.beforePhotos?.[0] ? (
                      <img src={activeJob.beforePhotos[0]} className="w-full h-36 object-cover rounded border border-slate-300" alt="Before damage" />
                    ) : (
                      <div className="w-full h-36 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400">No Photo</div>
                    )}
                    <div className="mt-1.5 text-[10px] text-slate-600">
                      <span>Notes: Mountain shift; leaning against trailer wall. Broken runners.</span>
                    </div>
                  </div>

                  {/* After */}
                  <div className="border border-emerald-200 rounded-lg p-2.5 bg-emerald-50/40">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 mb-1.5">
                      <span>AFTER: Restacked & Banded</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1 rounded">ROAD-READY</span>
                    </div>
                    {activeJob.afterPhotos?.[0] ? (
                      <img src={activeJob.afterPhotos[0]} className="w-full h-36 object-cover rounded border border-slate-300" alt="After rework" />
                    ) : (
                      <div className="w-full h-36 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400">No Photo</div>
                    )}
                    <div className="mt-1.5 text-[10px] text-slate-600">
                      <span>Notes: Restacked on GMA-1 pallets, double-banded, shrinkwrapped.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Charges Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Itemized Materials & Labor Invoice</h4>
                <table className="w-full text-left text-xs border border-slate-200 rounded overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="p-2 border-b">Description</th>
                      <th className="p-2 border-b text-center">Qty</th>
                      <th className="p-2 border-b text-right">Unit Price</th>
                      <th className="p-2 border-b text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-medium">New GMA Grade-A Pallets</td>
                      <td className="p-2 text-center">{activeJob.palletsCount}</td>
                      <td className="p-2 text-right">${RATES.pallets.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono">${(activeJob.palletsCount * RATES.pallets).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Heavy Stretch Wrap Rolls (80ga)</td>
                      <td className="p-2 text-center">{activeJob.wrapCount}</td>
                      <td className="p-2 text-right">${RATES.wrap.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono">${(activeJob.wrapCount * RATES.wrap).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Corner Boards (48" protection)</td>
                      <td className="p-2 text-center">{activeJob.cornersCount}</td>
                      <td className="p-2 text-right">${RATES.corners.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono">${(activeJob.cornersCount * RATES.corners).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Forklift Operator & Dock Crew Labor</td>
                      <td className="p-2 text-center">{activeJob.laborHours.toFixed(2)} hrs</td>
                      <td className="p-2 text-right">${RATES.labor.toFixed(2)}/hr</td>
                      <td className="p-2 text-right font-mono">${(activeJob.laborHours * RATES.labor).toFixed(2)}</td>
                    </tr>
                    {activeJob.scaleCheck && (
                      <tr>
                        <td className="p-2 font-medium">Certified Scale Weight Re-Check Ticket</td>
                        <td className="p-2 text-center">1</td>
                        <td className="p-2 text-right">${RATES.scale.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono">${RATES.scale.toFixed(2)}</td>
                      </tr>
                    )}
                    {activeJob.debrisFee && (
                      <tr>
                        <td className="p-2 font-medium">Broken Pallet & Dunnage Disposal Fee</td>
                        <td className="p-2 text-center">1</td>
                        <td className="p-2 text-right">${RATES.debris.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono">${RATES.debris.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="p-2 text-right uppercase text-slate-600">Total Settlement Due:</td>
                      <td className="p-2 text-right text-sm font-mono text-slate-950">${activeJob.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signature Block */}
              <div className="border-t border-slate-300 pt-4 grid grid-cols-2 gap-6 items-end">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Driver Digital Attestation (Signed on Glass)</span>
                  <div className="h-20 bg-slate-50 border border-slate-300 rounded p-1 flex items-center justify-center">
                    {activeJob.signatureData ? (
                      <img src={activeJob.signatureData} className="max-h-full max-w-full" alt="Driver signature" />
                    ) : (
                      <span className="text-xs text-slate-400 italic">Signature on file</span>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>Driver: <strong>{activeJob.driverName}</strong></span>
                    <span>SMS Sent: {activeJob.driverPhone}</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 space-y-1">
                  <p><strong>Denver Express Warehousing & Cross-Docking</strong></p>
                  <p>Dock Superintendent: Craig / Steve Chapman</p>
                  <p className="text-[10px] text-slate-400">System generated via Yorkstead ReworkFlow v1.0</p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between no-print">
              <span className="text-xs text-slate-600 font-medium">
                Receipt SMS & PDF email automatically dispatched to carrier accounting.
              </span>
              <button
                onClick={() => setActiveJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
