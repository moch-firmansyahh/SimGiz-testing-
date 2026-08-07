"use client";

import React, { memo } from "react";
import { 
  Users, 
  AlertTriangle, 
  CalendarCheck, 
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryMetric } from "@/lib/types";

interface SummaryCardProps {
  metrics?: SummaryMetric | null;
  loading?: boolean;
}

function SummaryCardComponent({ metrics, loading }: SummaryCardProps) {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-3.5 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-3 w-28" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Anak",
      value: metrics.totalAnak,
      unit: "Anak",
      change: metrics.perubahanTotalAnak,
      icon: Users,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Anak Berisiko",
      value: metrics.anakBerisiko,
      unit: "Anak",
      change: metrics.perubahanBerisiko,
      icon: AlertTriangle,
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Pemeriksaan",
      value: metrics.pemeriksaanBulanIni,
      unit: "Sesi",
      change: metrics.perubahanPemeriksaan,
      icon: CalendarCheck,
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      title: "Gizi Normal",
      value: `${metrics.persentaseNormal}%`,
      unit: "Cakupan",
      change: metrics.perubahanPersentase,
      icon: CheckCircle2,
      iconBg: "bg-teal-50 text-teal-600 border-teal-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-3.5 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`p-1.5 sm:p-2.5 rounded-xl border shrink-0 ${card.iconBg}`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="mt-2 sm:mt-4 flex items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {card.value}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">
                {card.unit}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-primary truncate">
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span className="truncate">{card.change}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default memo(SummaryCardComponent);
