"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Readex_Pro } from "next/font/google";
import { useAuth } from "@/lib/auth-context";


const readexPro = Readex_Pro({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, user, router]);

  return (
    <div className={`${readexPro.className} min-h-screen bg-black text-white`}>
      <Header />

      <div className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="mb-10">
          <h1 className={`${readexPro.className} text-4xl md:text-5xl font-bold mb-2 mt-10`}>Settings</h1>
          <p className="text-white/60 text-lg">Manage your account and billing</p>
        </div>

        {/* Sidebar + Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="space-y-1">
              <Link
                href="/settings/account"
                className={`${
                  pathname?.startsWith("/settings/account") ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/5"
                } block px-4 py-2 rounded-md transition-colors`}
              >
                Account
              </Link>
              <Link
                href="/settings/billing"
                className={`${
                  pathname?.startsWith("/settings/billing") ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/5"
                } block px-4 py-2 rounded-md transition-colors`}
              >
                Billing
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
