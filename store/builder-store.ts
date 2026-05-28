import { create } from "zustand";
import type { Edge, Node } from "@xyflow/react";
import { fromGraph, starterGraph, type StoredFlow } from "../lib/flow";

interface BuilderState {
  flows: StoredFlow[];
  activeFlowId: string | null;
  nodes: Node[];
  edges: Edge[];
  logs: ExecutionLog[];
  setFlows: (flows: StoredFlow[]) => void;
  selectFlow: (flow: StoredFlow) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  appendLog: (log: ExecutionLog) => void;
  clearLogs: () => void;
}

export interface ExecutionLog {
  type: string;
  message: string;
  timestamp: string;
  nodeId?: string;
  payload?: unknown;
}

const initial = fromGraph(starterGraph);

export const useBuilderStore = create<BuilderState>((set) => ({
  flows: [],
  activeFlowId: null,
  nodes: initial.nodes,
  edges: initial.edges,
  logs: [],
  setFlows: (flows) => set({ flows }),
  selectFlow: (flow) => {
    const graph = fromGraph(flow.graph);
    set({ activeFlowId: flow.id, nodes: graph.nodes, edges: graph.edges, logs: [] });
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  appendLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 80) })),
  clearLogs: () => set({ logs: [] })
}));
