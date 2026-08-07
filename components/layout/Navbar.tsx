"use client";

import React, { useState, useEffect } from "react";
import { currentWorker } from "@/lib/dummy-data";
import { Menu, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("userData");
      if (stored) {
        try {
          setUserData(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {}

    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("isAuth");
    }
    router.push("/login");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Dashboard Gizi";
      case "/pencatatan": return "Pencatatan Data Anak";
      case "/rekap": return "Rekap Data Gizi";
      case "/riwayat": return "Riwayat Pemeriksaan";
      case "/export": return "Export Laporan PDF";
      default: return "SimGizi Posyandu";
    }
  };

  const namaPetugas = userData?.nama || currentWorker.nama;
  const posyanduPetugas = userData?.posyandu || currentWorker.posyandu;
  const avatarPetugas = userData?.avatar || currentWorker.avatar;

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <img
            src={avatarPetugas}
            alt={namaPetugas}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold text-foreground block leading-none">
              {namaPetugas}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3 text-primary inline" />
              {posyanduPetugas}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};
