"use client";

import React, { useState, useEffect } from "react";
import { getStatusBadgeClass } from "@/lib/utils";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Printer, 
  Eye, 
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChildRecord, PaginationMeta } from "@/lib/types";

export default function RekapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [childrenList, setChildrenList] = useState<ChildRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<ChildRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChildRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userNotification, setUserNotification] = useState<string | null>(null);

  const fetchChildren = async (page = 1) => {
    setLoading(true);
    try {
      const url = `/api/anak?search=${encodeURIComponent(searchQuery)}&status=${encodeURIComponent(statusFilter)}&page=${page}&limit=8`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setChildrenList(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error("Kendala mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren(1);
  }, [searchQuery, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const targetNama = deleteTarget.nama;

    setIsDeleting(true);

    // INSTANTLY remove from local screen state for 100% immediate UI response
    setChildrenList((prev) => prev.filter((c) => c.id !== targetId && c.nik !== deleteTarget.nik));
    setDeleteTarget(null);
    setUserNotification(`Data ${targetNama} telah berhasil dihapus.`);
    setTimeout(() => setUserNotification(null), 4000);

    try {
      await fetch(`/api/anak/${targetId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Kendala menghapus data API:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {userNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
          {userNotification}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Rekapitulasi Data Gizi Balita</CardTitle>
              <CardDescription>FR-05 & FR-06: Daftar seluruh balita terdaftar dan status risiko WHO</CardDescription>
            </div>
          </div>
          <Link href="/export">
            <Button variant="emerald" size="sm" className="gap-2 font-bold shadow-sm">
              <Printer className="w-4 h-4" /> Cetak Laporan
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama anak, NIK, atau ortu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold border border-input rounded-xl bg-card focus:outline-none"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Normal">Normal</option>
                <option value="Gizi Kurang">Gizi Kurang</option>
                <option value="Gizi Buruk">Gizi Buruk</option>
                <option value="Stunting">Stunting</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs relative">
                <thead className="bg-muted/95 backdrop-blur-sm text-muted-foreground font-bold border-b border-border uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3.5">Anak & NIK</th>
                    <th className="p-3.5">Usia / JK</th>
                    <th className="p-3.5">BB / TB</th>
                    <th className="p-3.5">Z-Score TB/U</th>
                    <th className="p-3.5">Status Gizi</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium text-foreground">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="p-3.5"><Skeleton className="h-4 w-28 mb-1" /><Skeleton className="h-3 w-20" /></td>
                        <td className="p-3.5"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-3.5"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-3.5"><Skeleton className="h-4 w-12" /></td>
                        <td className="p-3.5"><Skeleton className="h-6 w-20 rounded-md" /></td>
                        <td className="p-3.5 text-right"><Skeleton className="h-7 w-16 rounded-md inline-block" /></td>
                      </tr>
                    ))
                  ) : (
                    childrenList.map((child) => (
                      <tr key={child.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-foreground">{child.nama}</div>
                          <div className="text-[11px] text-muted-foreground">NIK: {child.nik}</div>
                        </td>
                        <td className="p-3.5">{child.usiaBulan} Bulan ({child.jenisKelamin})</td>
                        <td className="p-3.5">{child.beratBadan} kg / {child.tinggiBadan} cm</td>
                        <td className="p-3.5 font-bold">{child.zScoreTB_U} SD</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusBadgeClass(child.statusGizi)}`}>
                            {child.statusGizi}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedChild(child)}
                            className="gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10 border-primary/20 h-7 px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(child)}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 w-7 p-0"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {!loading && childrenList.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-xs font-medium">
                  Belum ada data balita yang sesuai dengan filter pencarian.
                </div>
              )}
            </div>

            {/* Pagination Controls Bar */}
            {!loading && pagination.totalPages > 1 && (
              <div className="p-3 bg-card border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>
                  Halaman {pagination.page} dari {pagination.totalPages} ({pagination.totalItems} balita)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchChildren(pagination.page - 1)}
                    className="h-8 px-2.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchChildren(pagination.page + 1)}
                    className="h-8 px-2.5"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blurred Backdrop Detail Modal */}
      {selectedChild && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border relative z-10 animate-in zoom-in-95">
            <button
              onClick={() => setSelectedChild(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-foreground mb-1">{selectedChild.nama}</h3>
            <p className="text-xs text-muted-foreground mb-4">NIK: {selectedChild.nik} • Usia {selectedChild.usiaBulan} bulan</p>

            <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 text-xs text-foreground mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground">BB / TB:</span><span className="font-bold">{selectedChild.beratBadan} kg / {selectedChild.tinggiBadan} cm</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Z-Score BB/U:</span><span className="font-bold">{selectedChild.zScoreBB_U} SD</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Z-Score TB/U:</span><span className="font-bold text-rose-600">{selectedChild.zScoreTB_U} SD</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Z-Score BB/TB:</span><span className="font-bold">{selectedChild.zScoreBB_TB} SD</span></div>
            </div>

            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs mb-4">
              <span className="font-bold text-primary block mb-1">Rekomendasi Intervensi:</span>
              <p className="text-foreground font-medium leading-relaxed">{selectedChild.rekomendasiAI}</p>
            </div>

            <Button onClick={() => setSelectedChild(null)} variant="emerald" className="w-full">
              Tutup Ringkasan
            </Button>
          </div>
        </div>
      )}

      {/* Blurred Backdrop Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-border space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Konfirmasi Penghapusan</h4>
                <p className="text-xs text-muted-foreground">Hapus data balita {deleteTarget.nama}?</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Batal
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
