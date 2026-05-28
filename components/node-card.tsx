"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getFunctionDefinition } from "../lib/flow";

export function AgentNode({ data, selected }: NodeProps) {
  const definition = getFunctionDefinition(String(data.functionId ?? ""));
  const Icon = definition.icon;
  const state = String(data.executionState ?? "idle");

  return (
    <div
      className={`w-64 rounded-lg border bg-[#111827]/95 p-4 shadow-2xl backdrop-blur transition ${
        selected ? "border-cyanSoft shadow-focus" : "border-slate-700/70"
      } ${state === "running" ? "border-cyanSoft/80" : ""} ${state === "error" ? "border-red-400/70" : ""}`}
      style={{ boxShadow: state === "running" ? `0 0 0 1px ${definition.accent}55, 0 18px 50px rgba(34, 211, 238, 0.15)` : undefined }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-slate-900" style={{ color: definition.accent }}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-50">{definition.title}</h3>
            <Status state={state} />
          </div>
          <p className="mt-1 text-xs text-slate-400">{definition.category}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-400">{definition.description}</p>
      {data.model ? <p className="mt-3 rounded-md border border-slate-700 bg-slate-950/60 px-2 py-1 text-xs text-cyanSoft">{String(data.model)}</p> : null}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function Status({ state }: { state: string }) {
  if (state === "running") return <Loader2 size={15} className="animate-spin text-cyanSoft" />;
  if (state === "success") return <CheckCircle2 size={15} className="text-emerald-300" />;
  if (state === "error") return <XCircle size={15} className="text-red-300" />;
  return <span className="h-2 w-2 rounded-full bg-slate-600" />;
}
