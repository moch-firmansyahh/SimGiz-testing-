import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZScore(value: number): string {
  if (value > 0) return `+${value.toFixed(2)} SD`;
  return `${value.toFixed(2)} SD`;
}

export function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "gizi baik (normal)":
    case "normal":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    case "gizi kurang":
    case "risiko gizi kurang":
      return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
    case "gizi buruk":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
    case "stunting":
    case "severely stunted":
      return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
