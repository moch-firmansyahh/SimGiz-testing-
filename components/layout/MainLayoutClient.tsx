"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

export const MainLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const isLoginPage = pathname === "/login";
    const isAuth =
      typeof window !== "undefined" &&
      (sessionStorage.getItem("isAuth") || localStorage.getItem("isAuth"));

    if (!isAuth && !isLoginPage) {
      router.push("/login");
    }
  }, [pathname, router]);

  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen relative bg-background font-sans print:bg-white print:block print:min-h-0 print:h-auto print:static">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-screen transition-[margin] duration-300 ease-in-out print:ml-0 print:p-0 print:m-0 print:block print:min-h-0 print:h-auto",
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden print:overflow-visible print:p-0 print:m-0 print:block print:max-w-none print:w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
