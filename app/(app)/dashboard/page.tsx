"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, ChevronRight, Plus, Sparkles } from "lucide-react";
import { api } from "../../../lib/api";
import { useAppUser } from "../app-context";

type Flow = {
  id: string;
  name: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppUser();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api("/flows")
      .then((data) => {
        if (mounted) setFlows(data.flows ?? []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function createAgent() {
    const data = await api("/flows", {
      method: "POST",
      body: JSON.stringify({ name: "Untitled agent", graph: { nodes: [], edges: [] } })
    });
    router.push(`/canvas/${data.flow.id}`);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  const displayName = useMemo(() => user.email.split("@")[0] || user.email, [user.email]);
  const recentAgents = flows.slice(0, 6);

  return (
    <main className="min-h-screen overflow-y-auto bg-[#0F172A] p-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-3xl font-semibold tracking-normal">Good morning, {displayName}</p>
          <p className="mt-2 text-sm text-[#94A3B8]">Here's your workspace overview</p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total Agents" value={loading ? "..." : String(flows.length)} />
          <StatCard label="Executions this week" value="—" />
          <StatCard label="Functions available" value="16" />
          <StatCard label="Active deployments" value="—" />
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Agents</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">Your latest workflows and a quick path to new work.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <button
              onClick={createAgent}
              className="group flex min-h-44 flex-col justify-between rounded-2xl border border-dashed border-white/10 bg-[#111827] p-5 text-left transition hover:border-[#22D3EE]/50 hover:bg-[#1E293B]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#0F172A] text-[#22D3EE] transition group-hover:border-[#22D3EE]/50">
                <Plus size={18} />
              </div>
              <div>
                <p className="text-base font-semibold">New agent</p>
                <p className="mt-2 text-sm text-[#94A3B8]">Start a fresh workflow canvas.</p>
              </div>
            </button>

            {recentAgents.map((flow) => (
              <article key={flow.id} className="rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-slate-950/20">
                <div className="mb-10 flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#1E293B] text-[#6366F1]">
                    <Bot size={18} />
                  </div>
                  <span className="text-xs text-[#94A3B8]">{formatRelativeTime(flow.updatedAt)}</span>
                </div>
                <h3 className="text-base font-semibold">{flow.name}</h3>
                <div className="mt-5">
                  <Link href={`/canvas/${flow.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-[#22D3EE] transition hover:text-cyan-300">
                    Open
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Common workspace actions for building fast.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={createAgent} className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
              <Plus size={16} />
              New Agent
            </button>
            <button
              onClick={() => showToast("Templates are coming soon.")}
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm font-semibold text-[#94A3B8] opacity-80"
              title="Coming soon"
            >
              Browse Templates
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {toast ? (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-[#F8FAFC] shadow-2xl">
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-slate-950/20">
      <p className="text-sm text-[#94A3B8]">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-normal">{value}</p>
    </article>
  );
}

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMinutes) < 60) {
    return relativeLabel(diffMinutes, "minute");
  }
  if (Math.abs(diffHours) < 24) {
    return relativeLabel(diffHours, "hour");
  }
  return relativeLabel(diffDays, "day");
}

function relativeLabel(amount: number, unit: "minute" | "hour" | "day") {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return formatter.format(amount, unit);
}
