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
  FileSpreadsheet, 
  Settings,
  HelpCircle,
  Stethoscope
} from "lucide-react";

const dockItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pencatatan", href: "/pencatatan", icon: UserPlus },
  { name: "Rekap Gizi", href: "/rekap", icon: ClipboardList },
  { name: "Riwayat", href: "/riwayat", icon: History },
  { name: "Export PDF", href: "/export", icon: FileSpreadsheet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-row lg:flex-col items-center justify-between gap-4 p-2 lg:p-3 bg-slate-100/70 rounded-2xl md:rounded-[28px] border border-slate-200/60 shrink-0">
      {/* Top App Logo Badge */}
      <Link 
        href="/dashboard" 
        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 hover:scale-105 transition-transform"
        title="SimGizi Dashboard"
      >
        <Activity className="w-6 h-6 stroke-[2.5]" />
      </Link>

      {/* Vertical Icon Navigation Dock (Reference Screenshot Style) */}
      <nav className="flex flex-row lg:flex-col items-center gap-2">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 font-bold"
                  : "bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/60 shadow-sm"
              }`}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings & Help Icon */}
      <div className="flex flex-row lg:flex-col items-center gap-2">
        <button
          className="w-11 h-11 rounded-2xl bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-slate-200/60 shadow-sm transition-colors"
          title="Pengaturan"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
