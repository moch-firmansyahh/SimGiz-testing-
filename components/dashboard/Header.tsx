"use client";

import React, { useState } from "react";
import { currentWorker } from "@/lib/dummy-data";
import { 
  Activity, 
  Search, 
  Bell, 
  LogOut, 
  Plus, 
  LayoutDashboard, 
  UserPlus, 
  ClipboardList, 
  History, 
  FileSpreadsheet,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navTabs = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pencatatan", href: "/pencatatan", icon: UserPlus },
  { name: "Rekap Gizi", href: "/rekap", icon: ClipboardList },
  { name: "Riwayat", href: "/riwayat", icon: History },
  { name: "Export PDF", href: "/export", icon: FileSpreadsheet },
];

export default function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 mb-2 border-b border-slate-200/60">
      {/* Navigation Pills (Middle/Left like reference) */}
      <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 overflow-x-auto max-w-full">
        {navTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Search Input Bar (Pill style like reference) */}
      <div className="relative hidden xl:block w-52">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          placeholder="Cari balita / NIK..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 border border-slate-200/60 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Right Controls: Kader Avatars, Add Button, Profile */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Kader Avatars Stack */}
        <div className="hidden lg:flex items-center -space-x-2 mr-1">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
            alt="Kader 1"
            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
            alt="Kader 2"
            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <img
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100"
            alt="Kader 3"
            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-slate-600">
            +4
          </div>
        </div>

        {/* Add Child Pill Button */}
        <Link
          href="/pencatatan"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>Tambah Data</span>
        </Link>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
          <img
            src={currentWorker.avatar}
            alt={currentWorker.nama}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
          />
          <button
            onClick={() => setNotifications(0)}
            className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
          <Link
            href="/login"
            className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors ml-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
