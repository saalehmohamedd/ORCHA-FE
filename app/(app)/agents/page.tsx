"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronRight, Copy, Loader2, MoreVertical, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { api } from "../../../lib/api";
import type { StoredFlow } from "../../../lib/flow";

type MenuState = {
  id: string;
  open: boolean;
};

export default function AgentsPage() {
  const router = useRouter();
  const [flows, setFlows] = useState<StoredFlow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenu(null);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filteredFlows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return flows;
    return flows.filter((flow) => flow.name.toLowerCase().includes(normalized));
  }, [flows, query]);

  async function createAgent() {
    const data = await api("/flows", {
      method: "POST",
      body: JSON.stringify({ name: "Untitled agent", graph: { nodes: [], edges: [] } })
    });
    setFlows((current) => [data.flow, ...current]);
    router.push(`/canvas/${data.flow.id}`);
  }

  async function renameFlow(id: string, name: string) {
    const previous = flows;
    setFlows((current) => current.map((flow) => (flow.id === id ? { ...flow, name } : flow)));
    try {
      const data = await api(`/flows/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name })
      });
      setFlows((current) => current.map((flow) => (flow.id === id ? data.flow : flow)));
    } catch (error) {
      setFlows(previous);
      throw error;
    }
  }

  async function duplicateFlow(flow: StoredFlow) {
    const data = await api("/flows", {
      method: "POST",
      body: JSON.stringify({
        name: `${flow.name} copy`,
        graph: flow.graph
      })
    });
    setFlows((current) => [data.flow, ...current]);
  }

  async function deleteFlow(flow: StoredFlow) {
    const confirmed = window.confirm(`Delete "${flow.name}"? This cannot be undone.`);
    if (!confirmed) return;

    const previous = flows;
    setFlows((current) => current.filter((item) => item.id !== flow.id));
    try {
      await api(`/flows/${flow.id}`, { method: "DELETE" });
    } catch (error) {
      setFlows(previous);
      throw error;
    }
  }

  function beginRename(flow: StoredFlow) {
    setEditingId(flow.id);
    setDraftName(flow.name);
    setMenu(null);
  }

  function finishRename(flow: StoredFlow) {
    const next = draftName.trim();
    setEditingId(null);
    if (!next || next === flow.name) return;
    void renameFlow(flow.id, next);
  }

  return (
    <main className="min-h-screen bg-[#0F172A] p-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Agents</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">Manage and organize your workflow systems.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search agents"
                className="w-full rounded-xl border border-white/10 bg-[#111827] py-3 pl-9 pr-4 text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#22D3EE]/50 sm:w-72"
              />
            </label>
            <button onClick={createAgent} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
              <Plus size={16} />
              New Agent
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid place-items-center py-24 text-sm text-[#94A3B8]">
            <Loader2 size={18} className="mb-3 animate-spin text-[#22D3EE]" />
            Loading agents
          </div>
        ) : filteredFlows.length === 0 ? (
          <EmptyState
            title={query.trim() ? "No matching agents" : "No agents yet"}
            description={
              query.trim()
                ? "Try a different search term, or clear the filter to see your full list."
                : "Create your first agent to start orchestrating visual AI workflows."
            }
            actionLabel={query.trim() ? "Create new agent" : "Create your first agent"}
            onCreate={createAgent}
          />
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <CreateCard onCreate={createAgent} />
            {filteredFlows.map((flow) => (
              <article key={flow.id} className="rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-slate-950/20">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#1E293B] text-[#6366F1]">
                    <Bot size={18} />
                  </div>

                  <div ref={menu?.id === flow.id ? menuRef : undefined} className="relative">
                    <button
                      onClick={() => setMenu((current) => (current?.id === flow.id ? null : { id: flow.id, open: true }))}
                      className="rounded-lg border border-transparent p-2 text-[#94A3B8] transition hover:border-white/10 hover:bg-white/5 hover:text-[#F8FAFC]"
                      aria-label="Open actions"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {menu?.id === flow.id ? (
                      <div className="absolute right-0 top-10 z-20 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#0F172A] shadow-2xl">
                        <MenuItem
                          onClick={() => {
                            setMenu(null);
                            router.push(`/canvas/${flow.id}`);
                          }}
                        >
                          Open Canvas
                        </MenuItem>
                        <MenuItem onClick={() => beginRename(flow)}>
                          <SquarePen size={14} />
                          Rename
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setMenu(null);
                            void duplicateFlow(flow);
                          }}
                        >
                          <Copy size={14} />
                          Duplicate
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setMenu(null);
                            void deleteFlow(flow);
                          }}
                          danger
                        >
                          <Trash2 size={14} />
                          Delete
                        </MenuItem>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-3">
                  {editingId === flow.id ? (
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      onBlur={() => finishRename(flow)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") finishRename(flow);
                        if (event.key === "Escape") setEditingId(null);
                      }}
                      className="w-full rounded-xl border border-[#22D3EE]/40 bg-[#0F172A] px-3 py-2 text-base font-semibold text-[#F8FAFC] outline-none"
                    />
                  ) : (
                    <button
                      onDoubleClick={() => beginRename(flow)}
                      className="w-full text-left text-base font-semibold transition hover:text-[#22D3EE]"
                      title="Double-click to rename"
                    >
                      {flow.name}
                    </button>
                  )}

                  <p className="text-sm text-[#94A3B8]">{formatRelativeTime(flow.updatedAt)}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[#94A3B8]">{flow.graph.nodes.length} nodes</span>
                    <span className="rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-2.5 py-1 text-[#22D3EE]">Draft</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Link href={`/canvas/${flow.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-[#22D3EE] transition hover:text-cyan-300">
                    Open
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function CreateCard({ onCreate }: { onCreate: () => void }) {
  return (
    <button
      onClick={onCreate}
      className="flex min-h-[232px] flex-col justify-between rounded-2xl border border-dashed border-white/10 bg-[#111827] p-5 text-left shadow-2xl shadow-slate-950/20 transition hover:border-[#22D3EE]/50 hover:bg-[#1E293B]"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#0F172A] text-[#22D3EE]">
        <Plus size={18} />
      </div>
      <div>
        <p className="text-base font-semibold">New Agent</p>
        <p className="mt-2 text-sm text-[#94A3B8]">Create a fresh workflow from scratch.</p>
      </div>
    </button>
  );
}

function EmptyState({
  onCreate,
  title,
  description,
  actionLabel
}: {
  onCreate: () => void;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <section className="grid place-items-center rounded-2xl border border-white/10 bg-[#111827] px-6 py-20 text-center shadow-2xl shadow-slate-950/20">
      <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-[#0F172A] text-[#22D3EE]">
        <Bot size={30} />
      </div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#94A3B8]">{description}</p>
      <button onClick={onCreate} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
        <Plus size={16} />
        {actionLabel}
      </button>
    </section>
  );
}

function MenuItem({
  children,
  onClick,
  danger = false
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition ${
        danger ? "text-rose-200 hover:bg-rose-500/10" : "text-[#F8FAFC] hover:bg-white/5"
      }`}
    >
      {children}
    </button>
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
