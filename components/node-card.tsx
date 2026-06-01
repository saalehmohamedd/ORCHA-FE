"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getFunctionDefinition } from "../lib/flow";

export function AgentNode({ data }: NodeProps) {
  const definition = getFunctionDefinition(String(data.functionId ?? ""));
  const Icon = definition.icon;
  const state = String(data.executionState ?? "idle") as "idle" | "running" | "success" | "error";
  const configEntries = Object.entries(data).filter(([key, value]) => !["functionId", "title", "category", "executionState"].includes(key) && value !== undefined && value !== null);
  const visibleConfig = configEntries.slice(0, 2);
  const shadow = state === "running"
    ? `-2px 0 0 #6366F1, 0 0 12px #6366F133`
    : state === "success"
      ? `-2px 0 0 #22D3EE, 0 0 12px #22D3EE33`
      : state === "error"
        ? `-2px 0 0 #FB7185, 0 0 12px #FB718533`
        : undefined;

  return (
    <div
      className="group relative w-[220px] overflow-hidden rounded-xl border border-white/10 bg-[#1E293B] px-3 py-3 text-[#F8FAFC]"
      style={{ boxShadow: shadow }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-white/20 !bg-[#F8FAFC] !opacity-0 transition-opacity group-hover:!opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-white/20 !bg-[#F8FAFC] !opacity-0 transition-opacity group-hover:!opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
            style={{ backgroundColor: hexToRgba(definition.accent, 0.15), color: definition.accent }}
          >
            <Icon size={15} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-5 text-[#F8FAFC]">{definition.title}</h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">{definition.category}</p>
          </div>
        </div>

        <StatusDot state={state} />
      </div>

      <div className="my-3 h-px bg-white/10" />

      <div className="space-y-2">
        {visibleConfig.length > 0 ? (
          visibleConfig.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[78px_minmax(0,1fr)] gap-2">
              <span className="truncate text-[10px] uppercase tracking-widest text-[#94A3B8]">{labelize(key)}</span>
              <span className="truncate text-xs text-[#F8FAFC]">{formatValue(value)}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-[#94A3B8]">No config</p>
        )}
      </div>
    </div>
  );
}

function StatusDot({ state }: { state: "idle" | "running" | "success" | "error" }) {
  if (state === "running") {
    return (
      <span className="mt-1 flex h-3.5 w-3.5 shrink-0">
        <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-[#6366F1] opacity-40" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#6366F1]" />
      </span>
    );
  }

  if (state === "success") return <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-[#22D3EE]" />;
  if (state === "error") return <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-[#FB7185]" />;
  return <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-slate-500" />;
}

function labelize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return "—";
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const parsed = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const int = Number.parseInt(parsed, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
