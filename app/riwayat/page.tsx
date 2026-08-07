"use client";

import React, { useState, useEffect } from "react";
import { History, Calendar, Scale, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { getStatusBadgeClass } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationMeta } from "@/lib/types";

export default function RiwayatPage() {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/riwayat?page=${page}&limit=8`);
      const data = await res.json();
      if (data.success) {
        setHistoryList(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error("Kendala mengambil riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <History className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Riwayat Sesi Pemeriksaan Posyandu</CardTitle>
              <CardDescription>FR-07: Log historis penimbangan dan pengukuran fisik anak dari Supabase</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
              ))}
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-medium">
              Belum ada riwayat pemeriksaan tercatat saat ini.
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-xl font-bold text-xs shrink-0 flex flex-col items-center justify-center w-12 text-center text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary mb-1" />
                      <span>{String((pagination.page - 1) * pagination.limit + index + 1).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {item.anak?.nama || "Balita Posyandu"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Usia {item.anak?.usiaBulan || "-"} Bulan • Tanggal Periksa: <span className="font-semibold text-foreground">{item.tanggalPemeriksaan}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-foreground">
                        <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                          <Scale className="w-3.5 h-3.5 text-primary" />
                          {item.beratBadan} kg
                        </span>
                        <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                          <Ruler className="w-3.5 h-3.5 text-teal-600" />
                          {item.tinggiBadan} cm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right flex flex-col items-start sm:items-end gap-1">
                    <span className={`px-3 py-1 rounded-md text-xs font-extrabold border ${getStatusBadgeClass(item.statusGizi)}`}>
                      {item.statusGizi}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium mt-1">
                      Ortu: {item.anak?.namaOrangTua || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="p-3 bg-card border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium pt-4">
              <span>
                Halaman {pagination.page} dari {pagination.totalPages} ({pagination.totalItems} riwayat)
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchHistory(pagination.page - 1)}
                  className="h-8 px-2.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchHistory(pagination.page + 1)}
                  className="h-8 px-2.5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
