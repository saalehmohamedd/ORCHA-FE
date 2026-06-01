"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Builder } from "../../../../components/builder";
import { api } from "../../../../lib/api";
import type { StoredFlow } from "../../../../lib/flow";
import { useAppUser } from "../../app-context";

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAppUser();
  const [flow, setFlow] = useState<StoredFlow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    setFlow(null);

    api(`/flows/${id}`)
      .then((data) => {
        if (!active) return;
        setFlow(data.flow ?? null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Flow not found");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return <CanvasLoading />;
  }

  if (error || !flow) {
    return <CanvasNotFound message={error ?? "Flow not found"} />;
  }

  return <Builder user={user} onLogout={logout} initialFlow={flow} />;
}

function CanvasLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0F172A] px-6 text-[#F8FAFC]">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl shadow-slate-950/30">
        <div className="mb-6 flex items-center gap-3">
          <Loader2 size={18} className="animate-spin text-[#22D3EE]" />
          <p className="text-sm text-[#94A3B8]">Loading canvas...</p>
        </div>
        <div className="space-y-4">
          <div className="h-10 w-56 rounded-xl bg-white/5" />
          <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)_320px]">
            <div className="h-[520px] rounded-2xl bg-white/5" />
            <div className="h-[520px] rounded-2xl bg-white/5" />
            <div className="h-[520px] rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  );
}

function CanvasNotFound({ message }: { message: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0F172A] px-6 text-[#F8FAFC]">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 text-center shadow-2xl shadow-slate-950/30">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#1E293B] text-[#22D3EE]">
          <ArrowLeft size={18} />
        </div>
        <h1 className="text-2xl font-semibold">Flow not found</h1>
        <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{message}</p>
        <Link
          href="/agents"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          <ArrowLeft size={16} />
          Back to agents
        </Link>
      </div>
    </main>
  );
}
