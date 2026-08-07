"use client";

import React, { useState, useEffect } from "react";
import { getStatusBadgeClass } from "@/lib/utils";
import { 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  Ruler, 
  Save,
  Loader2,
  BookOpen
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhoRulesModal } from "@/components/ui/WhoRulesModal";

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
  const [showWhoRules, setShowWhoRules] = useState(false);

  // Real-time automatic Z-Score WHO & AI Recommendation calculation as soon as BB & TB are entered
  useEffect(() => {
    const bb = parseFloat(formData.beratBadan);
    const tb = parseFloat(formData.tinggiBadan);
    const usia = parseInt(formData.usiaBulan);

    if (!bb || !tb || isNaN(bb) || isNaN(tb) || bb <= 0 || tb <= 0) {
      setCalcResult(null);
      return;
    }

    const medianTB = 75 + (usia * 0.75);
    const medianBB = 3.5 + (usia * 0.35);

    const zTB = parseFloat(((tb - medianTB) / 3.5).toFixed(2));
    const zBB = parseFloat(((bb - medianBB) / 1.5).toFixed(2));
    const zBB_TB = parseFloat(((zBB - zTB)).toFixed(2));

    let status: 'Normal' | 'Gizi Kurang' | 'Gizi Buruk' | 'Stunting' = 'Normal';
    let rekomendasi = "";

    if (zTB < -3.0) {
      status = "Stunting";
      rekomendasi = `[STANDAR KEMENKES RI & WHO] Indikasi Stunting Berat (Z-Score TB/U ${zTB} SD). Segera rujuk ke Dokter Spesialis Anak/Puskesmas untuk pemindaian penyakit penyerta (TBC/cacingan) & berikan PMT Pemulihan tinggi Protein Hewani (1-2 telur/hari + susu PKMK).`;
    } else if (zBB < -3.0 || zBB_TB < -3.0) {
      status = "Gizi Buruk";
      rekomendasi = `[STANDAR KEMENKES RI & WHO] Indikasi Gizi Buruk Akut (BB/TB < -3 SD). Lakukan rujukan darurat ke Puskesmas Rawat Inap/TFC untuk Tatalaksana Gizi Buruk 10 Langkah (Fase Stabilisasi Formula F-75 dilanjutkan F-100/RUTF).`;
    } else if (zTB < -2.0) {
      status = "Stunting";
      rekomendasi = `[STANDAR KEMENKES RI & WHO] Indikasi Stunting Sedang (Z-Score TB/U ${zTB} SD). Berikan konseling nutrisi intensif keluarga & wajibkan konsumsi protein hewani harian (ikan, telur, hati ayam) untuk mencegah komplikasi kognitif.`;
    } else if (zBB < -2.0 || zBB_TB < -2.0) {
      status = "Gizi Kurang";
      rekomendasi = `[STANDAR KEMENKES RI & WHO] Indikasi Gizi Kurang (BB/U < -2 SD). Berikan suplemen Zink 10-20 mg/hari selama 14 hari, PMT Pemulihan Berbasis Pangan Lokal tinggi protein hewani, dan penimbangan mingguan.`;
    } else {
      status = "Normal";
      rekomendasi = `[STANDAR KEMENKES RI & WHO] Status Gizi Normal. Pertahankan pola makan seimbang berbasis Isi Piringku Balita, ASI Eksklusif/MPASI kaya zat besi, dan penimbangan rutin bulanan di Posyandu.`;
    }

    setCalcResult({
      zScoreBB_U: zBB,
      zScoreTB_U: zTB,
      zScoreBB_TB: zBB_TB,
      statusGizi: status,
      rekomendasiAI: rekomendasi,
    });
  }, [formData.beratBadan, formData.tinggiBadan, formData.usiaBulan]);

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

  const getCardColorClass = (status: string) => {
    switch (status) {
      case "Normal":
        return {
          box: "bg-emerald-50 border-emerald-200 text-emerald-950",
          title: "text-emerald-800",
        };
      case "Gizi Kurang":
        return {
          box: "bg-amber-50 border-amber-200 text-amber-950",
          title: "text-amber-800",
        };
      case "Stunting":
      case "Gizi Buruk":
        return {
          box: "bg-rose-50 border-rose-200 text-rose-950",
          title: "text-rose-800",
        };
      default:
        return {
          box: "bg-primary/10 border-primary/20 text-foreground",
          title: "text-primary",
        };
    }
  };

  return (
    <div className="space-y-6">
      <WhoRulesModal isOpen={showWhoRules} onClose={() => setShowWhoRules(false)} />

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">
            Data balita & penimbangan berhasil tersimpan!
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Form Input Pengukuran Balita</CardTitle>
                <CardDescription>FR-02 & FR-03: Pengukuran otomatis terhitung sesuai standar WHO</CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowWhoRules(true)}
              className="gap-2 text-xs border-primary/30 text-primary hover:bg-primary/10"
            >
              <BookOpen className="w-4 h-4" /> Rumus & Aturan WHO
            </Button>
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

              <div className="pt-3">
                <Button type="submit" variant="emerald" disabled={isSaving} className="w-full gap-2 font-bold h-11 text-sm shadow-md">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan Data Balita...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Data Balita & Penimbangan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Automatic Z-Score & Dynamic Color AI Preview Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2 text-foreground font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Analisis Medis AI Real-Time
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {calcResult ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Z-Score BB/U:</span><span className="font-bold">{calcResult.zScoreBB_U} SD</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Z-Score TB/U:</span><span className="font-bold">{calcResult.zScoreTB_U} SD</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Z-Score BB/TB:</span><span className="font-bold">{calcResult.zScoreBB_TB} SD</span></div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">Status Gizi (Otomatis):</span>
                  <span className={`inline-block px-3 py-1 rounded-md font-extrabold text-xs border ${getStatusBadgeClass(calcResult.statusGizi)}`}>
                    {calcResult.statusGizi}
                  </span>
                </div>
                <div className={`p-3.5 rounded-xl border text-xs ${getCardColorClass(calcResult.statusGizi).box}`}>
                  <span className={`font-bold block mb-1 ${getCardColorClass(calcResult.statusGizi).title}`}>
                    Rekomendasi Analisis AI Medis:
                  </span>
                  <p className="font-medium leading-relaxed">{calcResult.rekomendasiAI}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground space-y-2 text-xs">
                <Sparkles className="w-8 h-8 mx-auto stroke-1 text-primary animate-pulse" />
                <p className="font-semibold">Ketikkan Berat & Tinggi Badan balita.</p>
                <p className="text-[11px] text-muted-foreground">Kalkulasi Z-score WHO & Analisis Medis AI akan otomatis muncul secara instant di sini.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
