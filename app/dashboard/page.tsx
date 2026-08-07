"use client";

import React, { useState, useEffect } from "react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import AlertList from "@/components/dashboard/AlertList";
import TrendChart from "@/components/dashboard/TrendChart";
import { UserPlus, FileSpreadsheet, Sparkles, Calendar, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SummaryMetric, ChildRecord } from "@/lib/types";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<SummaryMetric | null>(null);
  const [highRiskList, setHighRiskList] = useState<ChildRecord[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/summary");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.summary);
        setHighRiskList(data.highRiskList || []);
        if (data.chartData) {
          setChartData(data.chartData);
        }
      }
    } catch (err) {
      console.error("Kendala mengambil data ringkasan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              {currentDate}
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              <HeartPulse className="w-3 h-3 text-primary" /> Pemantauan Posyandu
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Selamat Datang di SimGizi 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 max-w-xl">
            Sistem informasi gizi balita & deteksi dini stunting terintegrasi standar WHO 2006.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/pencatatan">
            <Button variant="emerald" className="gap-2 text-xs sm:text-sm">
              <UserPlus className="w-4 h-4" />
              Tambah Data Anak
            </Button>
          </Link>
          <Link href="/export">
            <Button variant="outline" className="gap-2 text-xs sm:text-sm">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              Laporan PDF
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Ringkasan Indikator Kesehatan
        </h2>
        <SummaryCard metrics={metrics} loading={loading} />
      </div>

      {/* Main Grid: Alert List + Dynamic Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertList highRiskList={highRiskList} loading={loading} />
        <TrendChart chartData={chartData} totalAnak={metrics?.totalAnak || 0} loading={loading} />
      </div>

      {/* AI Recommendation Feature Showcase Card */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Rekomendasi Intervensi Gizi AI
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              SimGizi secara otomatis mengkalkulasi Z-score BB/U, TB/U, dan BB/TB lalu merekomendasikan skema intervensi (PMT Pemulihan, Rujukan Puskesmas, Konseling ASI/MPASI).
            </p>
          </div>
        </div>
        <Link href="/rekap">
          <Button variant="outline" size="sm" className="shrink-0 text-xs">
            Lihat Rekap Seluruh Balita
          </Button>
        </Link>
      </div>
    </div>
  );
}
