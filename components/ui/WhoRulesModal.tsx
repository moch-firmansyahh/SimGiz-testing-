"use client";

import React from "react";
import { X, BookOpen, Calculator, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhoRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhoRulesModal({ isOpen, onClose }: WhoRulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-border pb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground">
              Panduan Kalkulasi & Aturan Standar WHO
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Metodologi Antropometri Kementerian Kesehatan RI & WHO Child Growth Standards
            </p>
          </div>
        </div>

        {/* Content Section 1: Formulas */}
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-sm">
              <Calculator className="w-4 h-4 text-primary" /> 1. Rumus Matematika Z-Score WHO
            </div>
            <div className="space-y-1.5 font-mono text-[11px] bg-white/80 p-3 rounded-lg border border-emerald-100">
              <p>• <strong>Median TB</strong> = 75 + (UsiaBulan × 0.75) cm</p>
              <p>• <strong>Z-Score TB/U (Stunting)</strong> = (TB - Median TB) / 3.5 SD</p>
              <p>• <strong>Median BB</strong> = 3.5 + (UsiaBulan × 0.35) kg</p>
              <p>• <strong>Z-Score BB/U (Gizi)</strong> = (BB - Median BB) / 1.5 SD</p>
              <p>• <strong>Z-Score BB/TB (Wasting)</strong> = Z-Score BB/U - Z-Score TB/U</p>
            </div>
          </div>

          {/* Content Section 2: Matrix Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> 2. Matriks Penilaian Status Gizi WHO & Risk Level
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
                  <tr>
                    <th className="p-2.5">Range Z-Score</th>
                    <th className="p-2.5">Status Gizi</th>
                    <th className="p-2.5">Level Risiko</th>
                    <th className="p-2.5">Protokol Intervensi Medis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-rose-50/50">
                    <td className="p-2.5 font-bold text-rose-700">&lt; -3.0 SD</td>
                    <td className="p-2.5 font-bold text-rose-800">Stunting Berat / Gizi Buruk</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-extrabold text-[10px]">KRITIS</span></td>
                    <td className="p-2.5 text-rose-900">Rujukan darurat Puskesmas, evaluasi TBC/cacingan, & PMT 2 telur/hari.</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="p-2.5 font-bold text-amber-700">-3.0 s/d -2.0 SD</td>
                    <td className="p-2.5 font-bold text-amber-800">Stunting Sedang / Gizi Kurang</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold text-[10px]">SEDANG</span></td>
                    <td className="p-2.5 text-amber-900">Konseling nutrisi keluarga, PMT pangan lokal protein hewani.</td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="p-2.5 font-bold text-emerald-700">-2.0 s/d +2.0 SD</td>
                    <td className="p-2.5 font-bold text-emerald-800">Normal</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-extrabold text-[10px]">RENDAH</span></td>
                    <td className="p-2.5 text-emerald-900">Pertahankan asupan gizi seimbang dan penimbangan rutin bulanan.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Section 3: Gemini AI Role */}
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
            <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-primary block mb-0.5">Analisis Kritis Google Gemini AI:</span>
              <p className="text-foreground text-[11px] leading-relaxed">
                Setiap data balita yang diukur akan diproses oleh <strong>Google Gemini 1.5 Flash AI</strong> untuk mengevaluasi dampak kognitif jangka panjang dan menghasilkan rekomendasi medis klinis yang disesuaikan secara individual.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} variant="emerald" className="w-full mt-5 font-bold">
          Mengerti & Tutup Panduan
        </Button>
      </div>
    </div>
  );
}
