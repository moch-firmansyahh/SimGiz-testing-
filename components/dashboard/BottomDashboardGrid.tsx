"use client";

import React, { useState } from "react";
import { highRiskChildren, childrenData } from "@/lib/dummy-data";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Send, 
  Paperclip, 
  Mic, 
  UserCheck, 
  AlertTriangle,
  FileText
} from "lucide-react";

export default function BottomDashboardGrid() {
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;

    setChatResponse(
      `Berdasarkan data WHO, rekomendasi untuk "${chatPrompt}": Berikan Makanan Tambahan (PMT) tinggi protein hewani (seperti telur & ikan) dan pantau kenaikan BB balita dalam 14 hari.`
    );
    setChatPrompt("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Column 1: Future Events / Peringatan Dini (Yellow Card matching screenshot) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            Agenda & Alert Terdekat
          </h3>
          <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900">
            <span>Lihat Semua</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Alert Banner (Warm Yellow Card like Tech Innovations Summit in screenshot) */}
        <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 rounded-2xl p-4 text-slate-900 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm tracking-tight">
              Sesi PMT & Kunjungan Rumah
            </span>
            <span className="bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-900">
              Dalam 30 menit
            </span>
          </div>
          <p className="text-xs text-amber-950/80 font-medium">
            Pendampingan gizi buruk untuk 3 balita di RT 04 Cilandak Barat.
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs font-bold text-amber-950">
            <span className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" /> 14:00 - 15:30
            </span>
            <span className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5" /> Hari Ini
            </span>
          </div>
        </div>

        {/* Second Event Item */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">
              Penimbangan Bulanan Posyandu
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Besok</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Target 45 anak balita untuk pemeriksaan Z-Score lengkap.
          </p>
        </div>
      </div>

      {/* Column 2: Onboarding Grid / Status Balita Berisiko (2x2 Cards like screenshot) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            Prioritas Pendampingan
          </h3>
          <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900">
            <span>Lihat Semua</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {childrenData.slice(0, 4).map((child) => (
            <div
              key={child.id}
              className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-100 transition-colors flex flex-col items-center text-center space-y-2"
            >
              <img
                src={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100`}
                alt={child.nama}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <p className="font-bold text-xs text-slate-900 truncate max-w-[110px]">
                  {child.nama}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {child.statusGizi}
                </p>
              </div>
              <div className="w-full bg-white px-2 py-1 rounded-lg border border-slate-200/60 text-[10px] font-bold text-slate-600">
                5/10 tindakan selesai
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: AI Assistant Box (Matching Welcome, Emily card with Orb in screenshot) */}
      <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          {/* Top 3D-like Sphere Graphic Badge */}
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 via-teal-300 to-emerald-400 shadow-xl shadow-teal-500/20 flex items-center justify-center text-white animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base font-black text-slate-900">
              Selamat Datang, Bidan Sri!
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ada yang bisa AI Posyandu bantu hari ini?
            </p>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full hover:bg-slate-50">
              <UserCheck className="w-3 h-3 text-emerald-600" /> Cek Z-Score
            </button>
            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full hover:bg-slate-50">
              <FileText className="w-3 h-3 text-sky-600" /> Buat Laporan
            </button>
            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full hover:bg-slate-50">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> Alert Stunting
            </button>
          </div>

          {chatResponse && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium animate-in fade-in">
              {chatResponse}
            </div>
          )}
        </div>

        {/* Chat Input Prompt Box matching reference screenshot bottom input */}
        <form onSubmit={handleAskAI} className="relative mt-2">
          <input
            type="text"
            placeholder="Tanyakan sesuatu pada AI..."
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
            className="w-full pl-3.5 pr-20 py-2.5 bg-slate-100/90 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <button
              type="submit"
              className="w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
