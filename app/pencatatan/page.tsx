"use client";

import React, { useState } from "react";
import { getStatusBadgeClass } from "@/lib/utils";
import { 
  UserPlus, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  Ruler, 
  User, 
  Save,
  Loader2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PencatatanPage() {
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    usiaBulan: "24",
    jenisKelamin: "L" as "L" | "P",
    namaOrangTua: "",
    alamat: "",
    beratBadan: "",
    tinggiBadan: "",
  });

  const [calcResult, setCalcResult] = useState<{
    zScoreBB_U: number;
    zScoreTB_U: number;
    zScoreBB_TB: number;
    statusGizi: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting';
    rekomendasiAI: string;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const bb = parseFloat(formData.beratBadan);
    const tb = parseFloat(formData.tinggiBadan);
    const usia = parseInt(formData.usiaBulan);

    if (!bb || !tb || isNaN(bb) || isNaN(tb)) return;

    const medianTB = 75 + (usia * 0.75);
    const medianBB = 3.5 + (usia * 0.35);

    const zTB = parseFloat(((tb - medianTB) / 3.5).toFixed(2));
    const zBB = parseFloat(((bb - medianBB) / 1.5).toFixed(2));
    const zBB_TB = parseFloat(((zBB - zTB)).toFixed(2));

    let status: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting' = 'Normal';
    let rekomendasi = "";

    if (zTB < -3.0) {
      status = "Stunting";
      rekomendasi = "Indikasi Stunting Berat (TB/U < -3 SD). Segera rujuk ke Puskesmas & berikan PMT Pemulihan tinggi protein hewani.";
    } else if (zBB < -3.0 || zBB_TB < -3.0) {
      status = "Gizi Buruk";
      rekomendasi = "Indikasi Gizi Buruk (BB/TB < -3 SD). Terapi gizi dan pemantauan ketat.";
    } else if (zTB < -2.0) {
      status = "Stunting";
      rekomendasi = "Indikasi Stunting Sedang (TB/U < -2 SD). Edukasi nutrisi dan pemantauan rutin.";
    } else if (zBB < -2.0 || zBB_TB < -2.0) {
      status = "Gizi Kurang";
      rekomendasi = "Indikasi Gizi Kurang (BB/U < -2 SD). Makanan Tambahan (PMT) lokal.";
    } else {
      status = "Normal";
      rekomendasi = "Status gizi normal ideal WHO. Pertahankan pola makan seimbang.";
    }

    setCalcResult({
      zScoreBB_U: zBB,
      zScoreTB_U: zTB,
      zScoreBB_TB: zBB_TB,
      statusGizi: status,
      rekomendasiAI: rekomendasi
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.nama || !formData.beratBadan || !formData.tinggiBadan) {
      alert("Harap lengkapi Nama, Berat Badan, dan Tinggi Badan!");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/anak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan data.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      setFormData({
        nama: "",
        nik: "",
        usiaBulan: "24",
        jenisKelamin: "L",
        namaOrangTua: "",
        alamat: "",
        beratBadan: "",
        tinggiBadan: "",
      });
      setCalcResult(null);
    } catch (err) {
      const errorObj = err as Error;
      setErrorMessage(errorObj.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">
            Data balita & penimbangan berhasil tersimpan langsung ke Database Supabase!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Form Input Pengukuran Balita</CardTitle>
                <CardDescription>FR-02 & FR-03: Simpan pengukuran ke Supabase & kalkulasi Z-score WHO</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Nama Lengkap Anak *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rayyan"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">NIK Anak / Ortu</label>
                  <input
                    type="text"
                    placeholder="16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Usia (Bulan) *</label>
                  <select
                    value={formData.usiaBulan}
                    onChange={(e) => setFormData({ ...formData, usiaBulan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input text-xs font-medium bg-card"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>{i} Bulan</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Jenis Kelamin *</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as "L" | "P" })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input text-xs font-medium bg-card"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Nama ibu / ayah"
                    value={formData.namaOrangTua}
                    onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                  <label className="block text-xs font-extrabold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-primary" /> Berat Badan (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="10.5"
                    value={formData.beratBadan}
                    onChange={(e) => setFormData({ ...formData, beratBadan: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-emerald-200 text-sm font-bold text-emerald-900"
                  />
                </div>
                <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100">
                  <label className="block text-xs font-extrabold text-teal-900 mb-1 flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-teal-600" /> Tinggi Badan (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="82.0"
                    value={formData.tinggiBadan}
                    onChange={(e) => setFormData({ ...formData, tinggiBadan: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-teal-200 text-sm font-bold text-teal-900"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => handleCalculate()} className="flex-1 gap-2">
                  <Calculator className="w-4 h-4 text-primary" /> Kalkulasi Z-Score WHO
                </Button>
                <Button type="submit" variant="emerald" disabled={isSaving} className="flex-1 gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan ke Supabase...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Simpan ke Supabase
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Z-Score & AI Preview Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2 text-foreground font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-primary" /> Kalkulator & Rekomendasi AI
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {calcResult ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">BB/U:</span><span className="font-bold">{calcResult.zScoreBB_U} SD</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">TB/U:</span><span className="font-bold text-rose-600">{calcResult.zScoreTB_U} SD</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">BB/TB:</span><span className="font-bold">{calcResult.zScoreBB_TB} SD</span></div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">Status Gizi:</span>
                  <span className={`inline-block px-3 py-1 rounded-md font-extrabold text-xs border ${getStatusBadgeClass(calcResult.statusGizi)}`}>
                    {calcResult.statusGizi}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                  <span className="font-bold text-primary block mb-1">Rekomendasi AI Intervensi:</span>
                  <p className="text-foreground font-medium leading-relaxed">{calcResult.rekomendasiAI}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground space-y-2 text-xs">
                <Calculator className="w-8 h-8 mx-auto stroke-1" />
                <p>Masukkan Berat & Tinggi badan lalu klik "Kalkulasi Z-Score WHO".</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
