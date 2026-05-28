"use client";

import { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance
} from "@xyflow/react";
import { Activity, Boxes, Clock3, Layers3, Play, Plus, Save, Trash2 } from "lucide-react";
import { io } from "socket.io-client";
import { api, API_URL } from "../lib/api";
import { functionLibrary, getFunctionDefinition, starterGraph, toGraph, type FunctionCategory, type FunctionDefinition, type StoredFlow } from "../lib/flow";
import { useBuilderStore, type ExecutionLog } from "../store/builder-store";
import { AgentNode } from "./node-card";

const nodeTypes = { function: AgentNode };
const categories: FunctionCategory[] = ["AI", "Files", "Communication", "Logic", "Developer"];

export function Builder({ user, onLogout }: { user: { id: string; email: string }; onLogout: () => void }) {
  const { flows, activeFlowId, nodes, edges, logs, setFlows, selectFlow, setNodes, setEdges, appendLog, clearLogs } = useBuilderStore();
  const [runInput, setRunInput] = useState("Turn these notes into a concise customer update.");
  const [busy, setBusy] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [reactFlow, setReactFlow] = useState<ReactFlowInstance | null>(null);
  const activeFlow = flows.find((flow) => flow.id === activeFlowId);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];

  useEffect(() => {
    api("/flows").then((data) => {
      setFlows(data.flows);
      if (data.flows[0]) selectFlow(data.flows[0]);
    });
  }, [selectFlow, setFlows]);

  useEffect(() => {
    const socket = io(API_URL, { withCredentials: true });
    socket.on("execution:event", appendLog);
    return () => {
      socket.disconnect();
    };
  }, [appendLog]);

  useEffect(() => {
    const latest = logs[0];
    if (!latest?.nodeId) return;
    const executionState = latest.type === "node.started" ? "running" : latest.type === "node.finished" ? "success" : latest.type === "node.error" ? "error" : undefined;
    if (!executionState) return;
    setNodes(nodes.map((node) => (node.id === latest.nodeId ? { ...node, data: { ...node.data, executionState } } : node)));
  }, [logs, nodes, setNodes]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)), [nodes, setNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)), [edges, setEdges]);
  const onConnect = useCallback((connection: Connection) => setEdges(addEdge({ ...connection, animated: busy }, edges)), [busy, edges, setEdges]);

  async function createFlow() {
    const data = await api("/flows", {
      method: "POST",
      body: JSON.stringify({ name: "Untitled system", graph: starterGraph })
    });
    setFlows([data.flow, ...flows]);
    selectFlow(data.flow);
  }

  async function saveFlow() {
    const graph = toGraph(nodes, edges);
    if (!activeFlowId) {
      const data = await api("/flows", {
        method: "POST",
        body: JSON.stringify({ name: "Untitled system", graph })
      });
      setFlows([data.flow, ...flows]);
      selectFlow(data.flow);
      return data.flow.id as string;
    }

    const data = await api(`/flows/${activeFlowId}`, {
      method: "PATCH",
      body: JSON.stringify({ graph })
    });
    setFlows(flows.map((flow) => (flow.id === data.flow.id ? data.flow : flow)));
    return activeFlowId;
  }

  async function runFlow() {
    const flowId = await saveFlow();
    if (!flowId) return;
    setBusy(true);
    clearLogs();
    setEdges(edges.map((edge) => ({ ...edge, animated: true })));
    setNodes(nodes.map((node) => ({ ...node, data: { ...node.data, executionState: "idle" } })));
    try {
      await api(`/flows/${flowId}/run`, {
        method: "POST",
        body: JSON.stringify({ input: runInput })
      });
    } finally {
      setBusy(false);
      setEdges(useBuilderStore.getState().edges.map((edge) => ({ ...edge, animated: false })));
    }
  }

  async function deleteActive() {
    if (!activeFlowId) return;
    await api(`/flows/${activeFlowId}`, { method: "DELETE" });
    const remaining = flows.filter((flow) => flow.id !== activeFlowId);
    setFlows(remaining);
    if (remaining[0]) selectFlow(remaining[0]);
  }

  function addFunction(definition: FunctionDefinition, position = { x: 260 + nodes.length * 30, y: 180 + nodes.length * 24 }) {
    const node: Node = {
      id: `${definition.id}-${crypto.randomUUID().slice(0, 8)}`,
      type: "function",
      position,
      data: {
        ...definition.defaultConfig,
        functionId: definition.id,
        title: definition.title,
        category: definition.category,
        executionState: "idle"
      }
    };
    setNodes([...nodes, node]);
    setSelectedNodeId(node.id);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const functionId = event.dataTransfer.getData("application/orcha-function");
    const definition = getFunctionDefinition(functionId);
    const position = reactFlow?.screenToFlowPosition({ x: event.clientX, y: event.clientY }) ?? { x: 240, y: 180 };
    addFunction(definition, position);
  }

  function updateSelectedNodeData(data: Record<string, unknown>) {
    if (!selectedNode) return;
    setNodes(nodes.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, ...data } } : node)));
  }

  const grouped = useMemo(
    () => categories.map((category) => ({ category, functions: functionLibrary.filter((definition) => definition.category === category) })),
    []
  );
  const lastOutput = logs.find((log) => log.type === "flow.finished")?.payload;

  return (
    <main className="grid h-screen grid-cols-[300px_minmax(0,1fr)_360px] grid-rows-[minmax(0,1fr)_230px] bg-[#0F172A] text-[#F8FAFC]">
      <aside className="row-span-2 border-r border-white/10 bg-[#111827] p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyanSoft">ORCHA</p>
            <h1 className="mt-2 text-xl font-semibold">Function Library</h1>
          </div>
          <button title="New system" onClick={createFlow} className="rounded-lg border border-white/10 bg-[#1E293B] p-2 text-slate-200 hover:border-cyanSoft">
            <Plus size={16} />
          </button>
        </div>

        <div className="mb-6 space-y-2">
          {flows.map((flow: StoredFlow) => (
            <button key={flow.id} onClick={() => selectFlow(flow)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${flow.id === activeFlowId ? "border-indigoMuted bg-[#1E293B] text-white" : "border-white/10 text-slate-400 hover:text-slate-100"}`}>
              {flow.name}
            </button>
          ))}
        </div>

        <div className="h-[calc(100vh-250px)] space-y-5 overflow-auto pr-1">
          {grouped.map((group) => (
            <section key={group.category}>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">{group.category}</p>
              <div className="space-y-2">
                {group.functions.map((definition) => (
                  <FunctionButton key={definition.id} definition={definition} onClick={() => addFunction(definition)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>

      <section className="min-w-0 border-b border-white/10">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0F172A]/95 px-5">
          <div>
            <h2 className="text-sm font-semibold">{activeFlow?.name ?? "Unsaved AI system"}</h2>
            <p className="text-xs text-slate-500">{nodes.length} functions / {edges.length} pipelines</p>
          </div>
          <div className="flex items-center gap-2">
            <button title="Delete system" onClick={deleteActive} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-red-300">
              <Trash2 size={16} />
            </button>
            <button title="Save system" onClick={saveFlow} className="rounded-lg border border-white/10 p-2 text-slate-300 hover:border-cyanSoft">
              <Save size={16} />
            </button>
            <button onClick={runFlow} disabled={busy} className="flex items-center gap-2 rounded-lg bg-indigoMuted px-4 py-2 text-sm font-medium text-white shadow-focus disabled:opacity-60">
              <Play size={15} />
              {busy ? "Running" : "Run"}
            </button>
          </div>
        </header>

        <div className="h-[calc(100%-4rem)]" onDrop={onDrop} onDragOver={(event) => event.preventDefault()}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setReactFlow}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_event, node) => setSelectedNodeId(node.id)}
            fitView
          >
            <Background color="#334155" gap={26} />
            <Controls />
          </ReactFlow>
        </div>
      </section>

      <aside className="row-span-2 flex min-h-0 flex-col border-l border-white/10 bg-[#111827]">
        <div className="border-b border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers3 size={16} className="text-cyanSoft" />
              <h2 className="text-sm font-semibold">Function Config</h2>
            </div>
            <button onClick={async () => { await api("/auth/logout", { method: "POST" }); onLogout(); }} className="text-xs text-slate-500 hover:text-slate-200">
              Logout
            </button>
          </div>
          <FunctionConfig selectedNode={selectedNode} onChange={updateSelectedNodeData} />
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Boxes size={16} className="text-indigoMuted" />
            <h2 className="text-sm font-semibold">Run Input</h2>
          </div>
          <textarea value={runInput} onChange={(event) => setRunInput(event.target.value)} className="h-28 w-full resize-none rounded-lg border border-white/10 bg-[#0F172A] p-3 text-sm leading-6 text-slate-100 outline-none focus:border-cyanSoft" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500">Final Output</p>
          <div className="rounded-lg border border-white/10 bg-[#0F172A] p-3 text-sm leading-6 text-slate-300">
            {lastOutput ? formatPayload(lastOutput) : "Run a system to inspect the result."}
          </div>
        </div>
      </aside>

      <section className="col-start-2 border-r border-white/10 bg-[#111827] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyanSoft" />
            <h2 className="text-sm font-semibold">Runtime Timeline</h2>
          </div>
          <span className="text-xs text-slate-500">{logs.length} events</span>
        </div>
        <div className="grid h-[170px] grid-cols-3 gap-3 overflow-auto">
          {logs.map((log, index) => (
            <TimelineEvent key={`${log.timestamp}-${index}`} log={log} />
          ))}
        </div>
      </section>
    </main>
  );
}

function FunctionButton({ definition, onClick }: { definition: FunctionDefinition; onClick: () => void }) {
  const Icon = definition.icon;
  return (
    <button
      draggable
      onDragStart={(event) => event.dataTransfer.setData("application/orcha-function", definition.id)}
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-[#0F172A] p-3 text-left transition hover:border-cyanSoft hover:bg-[#1E293B]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#111827]" style={{ color: definition.accent }}>
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-100">{definition.title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{definition.description}</span>
      </span>
    </button>
  );
}

function FunctionConfig({ selectedNode, onChange }: { selectedNode?: Node; onChange: (data: Record<string, unknown>) => void }) {
  if (!selectedNode) return <p className="text-sm text-slate-400">Select a function to configure its behavior.</p>;
  const definition = getFunctionDefinition(String(selectedNode.data.functionId ?? ""));

  return (
    <div>
      <div className="mb-5 rounded-lg border border-white/10 bg-[#0F172A] p-3">
        <p className="text-sm font-semibold">{definition.title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{definition.description}</p>
      </div>
      <div className="space-y-4">
        {definition.fields.length === 0 ? <p className="text-sm leading-6 text-slate-400">This function is registered but not executable in the MVP runtime yet.</p> : null}
        {definition.fields.map((field) => (
          <label key={field.key} className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {field.label}
            {field.type === "textarea" ? (
              <textarea value={String(selectedNode.data[field.key] ?? "")} onChange={(event) => onChange({ [field.key]: event.target.value })} className="mt-2 h-24 w-full resize-none rounded-lg border border-white/10 bg-[#0F172A] p-3 text-sm normal-case leading-6 tracking-normal text-slate-100 outline-none focus:border-cyanSoft" />
            ) : field.type === "select" ? (
              <select value={String(selectedNode.data[field.key] ?? field.options?.[0] ?? "")} onChange={(event) => onChange({ [field.key]: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-cyanSoft">
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input value={String(selectedNode.data[field.key] ?? "")} onChange={(event) => onChange({ [field.key]: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-cyanSoft" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function TimelineEvent({ log }: { log: ExecutionLog }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0F172A] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-slate-200">{log.message}</p>
        <Clock3 size={13} className="shrink-0 text-slate-500" />
      </div>
      <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
      {log.nodeId ? <p className="mt-2 truncate text-xs text-cyanSoft">{log.nodeId}</p> : null}
      {log.payload && typeof log.payload === "object" && "functionId" in log.payload ? <p className="mt-1 truncate text-xs text-indigo-300">{String(log.payload.functionId)}</p> : null}
    </div>
  );
}

function formatPayload(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "output" in value) return formatPayload(value.output);
  return JSON.stringify(value, null, 2);
}
