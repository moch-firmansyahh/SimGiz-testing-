"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedEmail");
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    } else {
      setEmail("petugas@posyandu.go.id");
    }
    setPassword("password123");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Email atau kata sandi belum sesuai.");
      }

      sessionStorage.setItem("isAuth", "true");
      sessionStorage.setItem("userData", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("isAuth");
        localStorage.removeItem("savedEmail");
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
    } catch (err) {
      const errorObj = err as Error;
      let msg = errorObj.message;
      if (msg.includes("Unexpected token") || msg.includes("JSON")) {
        msg = "Email atau kata sandi belum sesuai.";
      }
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] relative overflow-hidden font-sans">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-[400px] p-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-black/5 overflow-hidden">
          <div className="p-6 pt-8 space-y-5">
            {/* Logo & Brand */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mx-auto shadow-md">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                SimGizi Posyandu
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Sistem Informasi Gizi Anak & Deteksi Dini Stunting
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-zinc-700 font-medium text-xs block">
                  Email Petugas / NIP
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="nama@posyandu.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-700 font-medium text-xs block">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-10 rounded-lg border border-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-0.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary accent-[#16a34a] cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-zinc-600 text-xs cursor-pointer select-none font-medium"
                >
                  Ingat Saya
                </label>
              </div>

              {error && (
                <div className="text-xs font-bold text-red-500 text-center bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="emerald"
                disabled={isLoading}
                className="w-full h-11 text-xs font-bold shadow-md"
              >
                {isLoading ? "Memproses..." : "Masuk ke Sistem"}
              </Button>
            </form>

            <div className="pt-3 border-t border-zinc-100 text-center text-[11px] text-zinc-400 font-medium">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Sistem Terverifikasi Posyandu Official
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
