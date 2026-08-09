"use client";

import React, { useState, useEffect } from "react";
import { currentWorker } from "@/lib/petugas-config";
import { FileSpreadsheet, Printer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChildRecord, SummaryMetric } from "@/lib/types";

export default function ExportPage() {
  const [childrenList, setChildrenList] = useState<ChildRecord[]>([]);
  const [metrics, setMetrics] = useState<SummaryMetric | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resAnak, resSummary] = await Promise.all([
        fetch("/api/anak?limit=50"),
        fetch("/api/summary"),
      ]);
      const dataAnak = await resAnak.json();
      const dataSummary = await resSummary.json();

      if (dataAnak.success) setChildrenList(dataAnak.data);
      if (dataSummary.success) setMetrics(dataSummary.summary);
    } catch (err) {
      console.error("Kendala memuat laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6 print:space-y-0 print:p-0 print:m-0">
      {/* Header bar print-hidden */}
      <Card className="print:hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Cetak Laporan Rekapitulasi Gizi</CardTitle>
              <CardDescription>FR-08: Cetak & simpan PDF laporan gizi bulanan Posyandu</CardDescription>
            </div>
          </div>

          <Button variant="emerald" size="sm" onClick={handlePrint} className="gap-2 font-bold shadow-md">
            <Printer className="w-4 h-4" /> Cetak Laporan
          </Button>
        </CardHeader>
      </Card>

      {/* Printable Report Document Container */}
      <div id="printable-report" className="print-document bg-white p-8 rounded-2xl border border-border shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
            LAPORAN REKAPITULASI GIZI BALITA & DETEKSI STUNTING
          </h2>
          <p className="text-xs font-bold text-slate-600">
            {currentWorker.posyandu} • {currentWorker.kelurahan}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Periode: Agustus 2026 • Petugas: {currentWorker.nama} (NIP: {currentWorker.nip})
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-center text-xs">
          <div><span className="text-slate-500 block font-medium">Total Anak</span><span className="text-base font-extrabold text-slate-900">{metrics?.totalAnak || 36} Anak</span></div>
          <div><span className="text-slate-500 block font-medium">Anak Berisiko</span><span className="text-base font-extrabold text-rose-600">{metrics?.anakBerisiko || 16} Anak</span></div>
          <div><span className="text-slate-500 block font-medium">Pemeriksaan</span><span className="text-base font-extrabold text-slate-900">{metrics?.pemeriksaanBulanIni || 36} Sesi</span></div>
          <div><span className="text-slate-500 block font-medium">Status Normal</span><span className="text-base font-extrabold text-emerald-600">{metrics?.persentaseNormal || 55.6}%</span></div>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse mb-6 print-table">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-300 font-bold text-slate-900">
                <th className="p-2.5 whitespace-nowrap">No</th>
                <th className="p-2.5">Nama Anak</th>
                <th className="p-2.5 whitespace-nowrap">Usia</th>
                <th className="p-2.5 whitespace-nowrap">JK</th>
                <th className="p-2.5">Orang Tua</th>
                <th className="p-2.5 whitespace-nowrap">BB (kg)</th>
                <th className="p-2.5 whitespace-nowrap">TB (cm)</th>
                <th className="p-2.5 whitespace-nowrap">Z-Score TB/U</th>
                <th className="p-2.5 whitespace-nowrap">Status Gizi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {childrenList.map((item, idx) => (
                <tr key={item.id} className="print-row">
                  <td className="p-2.5 whitespace-nowrap">{idx + 1}</td>
                  <td className="p-2.5 font-bold text-slate-900">{item.nama}</td>
                  <td className="p-2.5 whitespace-nowrap">{item.usiaBulan} bln</td>
                  <td className="p-2.5 whitespace-nowrap">{item.jenisKelamin}</td>
                  <td className="p-2.5">{item.namaOrangTua}</td>
                  <td className="p-2.5 whitespace-nowrap">{item.beratBadan}</td>
                  <td className="p-2.5 whitespace-nowrap">{item.tinggiBadan}</td>
                  <td className="p-2.5 font-semibold whitespace-nowrap">{item.zScoreTB_U} SD</td>
                  <td className="p-2.5 font-bold whitespace-nowrap">{item.statusGizi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Signature section wrapped to prevent page break splitting */}
        <div 
          className="print-signature flex justify-between items-end pt-8 text-xs text-slate-900"
          style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
        >
          <div className="print-signature-box">
            <p>Mengetahui,</p>
            <p className="font-bold mt-1">Kepala Puskesmas Pembantu</p>
            <div className="h-16" />
            <p className="font-bold underline">dr. Anita Rahayu, M.Kes</p>
            <p className="text-slate-500">NIP. 19790211 200801 2 009</p>
          </div>

          <div className="print-signature-box text-right">
            <p>Jakarta, 07 Agustus 2026</p>
            <p className="font-bold mt-1">Petugas Kesehatan Posyandu</p>
            <div className="h-16" />
            <p className="font-bold underline">{currentWorker.nama}</p>
            <p className="text-slate-500">NIP. {currentWorker.nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
