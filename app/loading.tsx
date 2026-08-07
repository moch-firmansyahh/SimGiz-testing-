import React from "react";
import { Activity, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 space-y-4 font-sans animate-in fade-in duration-200">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
          <Activity className="w-7 h-7 animate-pulse stroke-[2.5]" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-sm font-extrabold text-foreground tracking-tight">
          SimGizi Posyandu
        </h3>
        <p className="text-xs text-muted-foreground font-medium">
          Memuat data posyandu...
        </p>
      </div>
    </div>
  );
}
