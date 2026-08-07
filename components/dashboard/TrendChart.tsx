"use client";

import React, { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendChartProps {
  chartData?: { kategori: string; jumlah: number; fill: string }[];
  totalAnak?: number;
  loading?: boolean;
}

const defaultChartData = [
  { kategori: "Normal", jumlah: 20, fill: "#10b981" },
  { kategori: "Gizi Kurang", jumlah: 4, fill: "#f59e0b" },
  { kategori: "Gizi Buruk", jumlah: 4, fill: "#ef4444" },
  { kategori: "Stunting", jumlah: 8, fill: "#e11d48" },
];

function TrendChartComponent({ chartData, totalAnak, loading }: TrendChartProps) {
  const data = chartData && chartData.length > 0 ? chartData : defaultChartData;
  const total = totalAnak || data.reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base">Distribusi Status Gizi Balita</CardTitle>
            <CardDescription className="text-xs">Jumlah anak per kategori Z-score WHO</CardDescription>
          </div>
        </div>
        {!loading && (
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md shrink-0">
            {total} Anak
          </span>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {loading ? (
          <div className="h-[220px] sm:h-[260px] w-full flex items-end gap-4 pt-8">
            <Skeleton className="h-full w-full rounded-t-xl" />
            <Skeleton className="h-2/3 w-full rounded-t-xl" />
            <Skeleton className="h-1/3 w-full rounded-t-xl" />
            <Skeleton className="h-1/2 w-full rounded-t-xl" />
          </div>
        ) : (
          <div className="h-[220px] sm:h-[260px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="kategori" 
                  tickLine={false} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-popover text-popover-foreground p-2.5 rounded-xl shadow-md text-xs border border-border">
                          <p className="font-bold">{item.kategori}</p>
                          <p className="text-primary font-extrabold text-xs mt-0.5">
                            {item.jumlah} Anak
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="jumlah" 
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border text-xs">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-muted/40 p-1.5 sm:p-2 rounded-xl border border-border">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <div className="min-w-0">
                  <span className="text-muted-foreground block font-medium truncate text-[11px]">{item.kategori}</span>
                  <span className="font-bold text-foreground text-xs">{item.jumlah} Anak</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(TrendChartComponent);
