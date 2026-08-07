"use client";

import React, { useState, memo } from "react";
import { getStatusBadgeClass } from "@/lib/utils";
import { 
  AlertOctagon, 
  ChevronRight, 
  Sparkles, 
  X, 
  Scale, 
  Ruler, 
  AlertTriangle 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChildRecord } from "@/lib/types";

interface AlertListProps {
  highRiskList?: ChildRecord[];
  loading?: boolean;
}

function AlertListComponent({ highRiskList = [], loading }: AlertListProps) {
  const [selectedChild, setSelectedChild] = useState<ChildRecord | null>(null);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base">Peringatan Dini Gizi & Stunting</CardTitle>
            <CardDescription className="text-xs">Balita yang memerlukan tindakan intervensi</CardDescription>
          </div>
        </div>
        {!loading && (
          <Badge variant="destructive" className="shrink-0">
            {highRiskList.length} Alert
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : highRiskList.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground font-medium">
            Tidak ada balita yang memerlukan perhatian khusus saat ini.
          </div>
        ) : (
          highRiskList.map((child) => {
            const badgeClass = getStatusBadgeClass(child.statusGizi);
            
            return (
              <div
                key={child.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-all gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    child.jenisKelamin === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {child.nama.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-foreground">
                        {child.nama}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        ({child.usiaBulan} bln, {child.jenisKelamin})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                        {child.statusGizi}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Ortu: {child.namaOrangTua}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedChild(child)}
                  className="self-end sm:self-center gap-1 text-[11px] h-7 px-2.5 text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
                >
                  Detail
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })
        )}
      </CardContent>

      {/* Clean Floating Card AI Recommendation Modal (No partial dark overlay) */}
      {selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setSelectedChild(null)} />

          <div className="bg-card rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-border relative z-10 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedChild(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {selectedChild.nama}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  NIK: {selectedChild.nik} • Usia {selectedChild.usiaBulan} bulan ({selectedChild.jenisKelamin})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 p-3 bg-muted/40 rounded-xl border border-border mb-3 text-center text-xs">
              <div>
                <span className="text-muted-foreground font-semibold block text-[11px]">Berat Badan</span>
                <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Scale className="w-3.5 h-3.5 text-primary" /> {selectedChild.beratBadan} kg
                </span>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold block text-[11px]">Tinggi Badan</span>
                <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Ruler className="w-3.5 h-3.5 text-teal-600" /> {selectedChild.tinggiBadan} cm
                </span>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold block text-[11px]">Status Gizi</span>
                <span className={`font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 border text-[10px] ${getStatusBadgeClass(selectedChild.statusGizi)}`}>
                  {selectedChild.statusGizi}
                </span>
              </div>
            </div>

            <div className="space-y-1 mb-4 text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border">
              <div className="flex justify-between"><span>Z-Score BB/U:</span><span className="font-bold text-foreground">{selectedChild.zScoreBB_U} SD</span></div>
              <div className="flex justify-between"><span>Z-Score TB/U:</span><span className="font-bold text-rose-600">{selectedChild.zScoreTB_U} SD</span></div>
              <div className="flex justify-between"><span>Z-Score BB/TB:</span><span className="font-bold text-foreground">{selectedChild.zScoreBB_TB} SD</span></div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3.5 mb-4">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4" /> Rekomendasi Intervensi AI
              </div>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {selectedChild.rekomendasiAI}
              </p>
            </div>

            <Button onClick={() => setSelectedChild(null)} variant="emerald" className="w-full h-9 text-xs font-bold">
              Tutup Ringkasan
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default memo(AlertListComponent);
