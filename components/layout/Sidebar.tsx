"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  LayoutDashboard, 
  UserPlus, 
  ClipboardList, 
  History, 
  FileSpreadsheet 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pencatatan Data Anak", href: "/pencatatan", icon: UserPlus },
  { name: "Rekap Data Gizi", href: "/rekap", icon: ClipboardList },
  { name: "Riwayat Pemeriksaan", href: "/riwayat", icon: History },
  { name: "Export Laporan", href: "/export", icon: FileSpreadsheet },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col h-screen fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out w-64 shadow-md",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-foreground tracking-tight block leading-none">
              SimGizi
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Posyandu Digital
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 768) setIsOpen(false);
              }}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground font-medium text-center">
        SimGizi v1.0 • Standar WHO
      </div>
    </aside>
  );
};
