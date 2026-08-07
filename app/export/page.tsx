"use client";

import React, { useState, useEffect } from "react";
import { currentWorker } from "@/lib/dummy-data";
import { FileSpreadsheet, Printer, Download, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChildRecord, SummaryMetric } from "@/lib/types";

export default function ExportPage() {
  const [childrenList, setChildrenList] = useState<ChildRecord[]>([]);
  const [metrics, setMetrics] = useState<SummaryMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

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
    window.print();
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header bar print-hidden */}
      <Card className="print:hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Export Laporan Rekapitulasi Gizi</CardTitle>
              <CardDescription>FR-08: Unduh atau cetak laporan gizi & stunting bulanan Posyandu</CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4 text-muted-foreground" /> Cetak Laporan
            </Button>
            <Button variant="emerald" size="sm" onClick={handleDownloadPDF} disabled={downloading} className="gap-2">
              <Download className="w-4 h-4" />
              {downloading ? "Memproses PDF..." : "Unduh PDF"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 print:hidden animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold">
            Laporan rekapitulasi gizi bulanan berhasil disiapkan!
          </span>
        </div>
      )}

      {/* Printable Report Document Card */}
      <Card className="p-8 print:shadow-none print:border-none print:p-0">
        <div className="border-b-2 border-foreground pb-4 mb-6 text-center">
          <h2 className="text-lg font-black text-foreground uppercase tracking-wide">
            LAPORAN REKAPITULASI GIZI BALITA & DETEKSI STUNTING
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            {currentWorker.posyandu} • {currentWorker.kelurahan}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Periode: Agustus 2026 • Petugas: {currentWorker.nama} (NIP: {currentWorker.nip})
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/40 rounded-xl border border-border mb-6 text-center text-xs">
          <div><span className="text-muted-foreground block font-medium">Total Anak</span><span className="text-base font-extrabold text-foreground">{metrics?.totalAnak || 0} Anak</span></div>
          <div><span className="text-muted-foreground block font-medium">Anak Berisiko</span><span className="text-base font-extrabold text-rose-600">{metrics?.anakBerisiko || 0} Anak</span></div>
          <div><span className="text-muted-foreground block font-medium">Pemeriksaan</span><span className="text-base font-extrabold text-foreground">{metrics?.pemeriksaanBulanIni || 0} Sesi</span></div>
          <div><span className="text-muted-foreground block font-medium">Status Normal</span><span className="text-base font-extrabold text-primary">{metrics?.persentaseNormal || 0}%</span></div>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse mb-6">
            <thead>
              <tr className="bg-muted border-y border-border font-bold text-foreground">
                <th className="p-2.5">No</th>
                <th className="p-2.5">Nama Anak</th>
                <th className="p-2.5">Usia</th>
                <th className="p-2.5">JK</th>
                <th className="p-2.5">Orang Tua</th>
                <th className="p-2.5">BB (kg)</th>
                <th className="p-2.5">TB (cm)</th>
                <th className="p-2.5">Z-Score TB/U</th>
                <th className="p-2.5">Status Gizi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {childrenList.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2.5">{idx + 1}</td>
                  <td className="p-2.5 font-bold text-foreground">{item.nama}</td>
                  <td className="p-2.5">{item.usiaBulan} bln</td>
                  <td className="p-2.5">{item.jenisKelamin}</td>
                  <td className="p-2.5">{item.namaOrangTua}</td>
                  <td className="p-2.5">{item.beratBadan}</td>
                  <td className="p-2.5">{item.tinggiBadan}</td>
                  <td className="p-2.5 font-semibold">{item.zScoreTB_U} SD</td>
                  <td className="p-2.5 font-bold">{item.statusGizi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-end pt-8 text-xs text-foreground">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold mt-1">Kepala Puskesmas Pembantu</p>
            <div className="h-16" />
            <p className="font-bold underline">dr. Anita Rahayu, M.Kes</p>
            <p className="text-muted-foreground">NIP. 19790211 200801 2 009</p>
          </div>

          <div className="text-right">
            <p>Jakarta, 07 Agustus 2026</p>
            <p className="font-bold mt-1">Petugas Kesehatan Posyandu</p>
            <div className="h-16" />
            <p className="font-bold underline">{currentWorker.nama}</p>
            <p className="text-muted-foreground">NIP. {currentWorker.nip}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
