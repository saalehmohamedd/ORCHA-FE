"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, CreditCard, LayoutDashboard, Layers, LogOut, Rocket, Settings } from "lucide-react";
import { api } from "../../lib/api";
import { AppUserProvider, type AppUser } from "./app-context";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
  { href: "/agents", label: "Agents", icon: Bot, disabled: false },
  { href: "#", label: "Templates", icon: Layers, disabled: true, hint: "Coming soon" },
  { href: "#", label: "Deployments", icon: Rocket, disabled: true, hint: "Coming soon" },
  { href: "#", label: "Billing", icon: CreditCard, disabled: true, hint: "Coming soon" },
  { href: "/settings", label: "Settings", icon: Settings, disabled: false }
] as const;

export function AppShell({ user, children }: { user: AppUser; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <AppUserProvider user={user}>
      <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
        <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-white/10 bg-[#111827]/95 px-4 py-5 backdrop-blur-xl">
          <Link href="/" className="px-2 text-sm font-bold tracking-[0.28em] text-[#F8FAFC]">
            ORCHA
          </Link>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = !item.disabled && pathname === item.href;

              if (item.disabled) {
                return (
                  <button
                    key={item.label}
                    disabled
                    title={item.hint}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-500 opacity-70"
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active ? "bg-[#1E293B] text-white" : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 pt-4">
            <p className="truncate px-2 text-sm text-slate-300">{user.email}</p>
            <button
              onClick={logout}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2 text-sm text-slate-300 transition hover:border-[#22D3EE]/40 hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <div className="pl-60">{children}</div>
      </div>
    </AppUserProvider>
  );
}
