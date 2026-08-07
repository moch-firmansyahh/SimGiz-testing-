"use client";

import React, { useState } from "react";
import { childrenData, ChildRecord } from "@/lib/dummy-data";
import { Calendar, Filter, ArrowUpRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { getStatusBadgeClass } from "@/lib/utils";

export default function PlannedInspectionsCard() {
  const [selectedChild, setSelectedChild] = useState<ChildRecord | null>(null);

  const days = [
    { day: "Sen", date: 3 },
    { day: "Sel", date: 4 },
    { day: "Rab", date: 5 },
    { day: "Kam", date: 6 },
    { day: "Jum", date: 7, active: true },
    { day: "Sab", date: 8 },
    { day: "Min", date: 9 },
    { day: "Sen", date: 10 },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
      {/* Header Bar matching Reference Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Jadwal & Status Pemeriksaan Balita
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Matriks penimbangan posyandu minggu ini
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-bold text-slate-700 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>07 Agustus 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-bold text-slate-700 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors">
            <span>Lihat Semua</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Schedule Table Grid matching Reference Screenshot */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3 text-slate-400 font-extrabold uppercase tracking-wider w-56">Balita</th>
              {days.map((d, i) => (
                <th key={i} className="py-2 px-2 text-center">
                  <div className={`p-1.5 rounded-xl flex flex-col items-center ${
                    d.active ? "bg-emerald-600 text-white shadow-md font-bold" : "bg-slate-100/70 text-slate-500 font-medium"
                  }`}>
                    <span className="text-[10px]">{d.day}</span>
                    <span className="text-xs font-bold">{d.date}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {childrenData.slice(0, 5).map((child, idx) => (
              <tr key={child.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Left Profile Info Column */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      child.jenisKelamin === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {child.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{child.nama}</p>
                      <p className="text-[11px] text-slate-400">{child.usiaBulan} Bulan • {child.namaOrangTua}</p>
                    </div>
                  </div>
                </td>

                {/* Timeline Pills Span (Matching reference screenshot purple/green/blue pill tags) */}
                <td colSpan={8} className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    {idx === 0 && (
                      <div className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center justify-between font-bold text-xs">
                        <span>Stunting Berat (TB/U -3.10 SD)</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">Intervensi Rujukan</span>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center justify-between font-bold text-xs">
                        <span>Gizi Buruk (BB/TB -2.80 SD)</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">PMT Pemulihan</span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center justify-between font-bold text-xs">
                        <span>Stunting Sedang (TB/U -2.15 SD)</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">Monitoring KADER</span>
                      </div>
                    )}
                    {idx === 3 && (
                      <div className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center justify-between font-bold text-xs">
                        <span>Gizi Kurang (BB/U -2.10 SD)</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">Edukasi ASI/MPASI</span>
                      </div>
                    )}
                    {idx === 4 && (
                      <div className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center justify-between font-bold text-xs">
                        <span>Status Normal Optimal (+0.25 SD)</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">Lulus Penimbangan</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
