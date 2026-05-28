import type { Edge, Node } from "@xyflow/react";
import {
  Activity as ActivityIcon,
  Bot,
  Braces,
  Clock3,
  Code2,
  FileText,
  GitBranch,
  Globe2,
  Languages,
  Mail,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Table2
} from "lucide-react";

export type FunctionCategory = "AI" | "Files" | "Communication" | "Logic" | "Developer";

export interface FunctionDefinition {
  id: string;
  title: string;
  category: FunctionCategory;
  description: string;
  icon: typeof Sparkles;
  accent: string;
  defaultConfig: Record<string, unknown>;
  fields: Array<{ key: string; label: string; type: "text" | "textarea" | "select"; options?: string[] }>;
}

export const geminiModels = [
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" }
];

export const functionLibrary: FunctionDefinition[] = [
  {
    id: "ai.summarize-text",
    title: "Summarize Text",
    category: "AI",
    description: "Condense content into a clean executive summary.",
    icon: Sparkles,
    accent: "#6366F1",
    defaultConfig: { model: "gemini-2.5-flash-lite", style: "concise", temperature: 0.2 },
    fields: [
      { key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) },
      { key: "style", label: "Style", type: "select", options: ["concise", "detailed", "bullet points", "executive"] }
    ]
  },
  {
    id: "ai.translate-text",
    title: "Translate",
    category: "AI",
    description: "Translate text while preserving intent.",
    icon: Languages,
    accent: "#22D3EE",
    defaultConfig: { model: "gemini-2.5-flash-lite", targetLanguage: "English", temperature: 0.1 },
    fields: [
      { key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) },
      { key: "targetLanguage", label: "Target language", type: "text" }
    ]
  },
  {
    id: "ai.generate-blog",
    title: "Generate Blog",
    category: "AI",
    description: "Turn notes into a structured blog draft.",
    icon: Bot,
    accent: "#6366F1",
    defaultConfig: { model: "gemini-2.5-flash-lite", temperature: 0.3 },
    fields: [{ key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) }]
  },
  {
    id: "ai.extract-keywords",
    title: "Extract Keywords",
    category: "AI",
    description: "Find high-signal concepts in content.",
    icon: Search,
    accent: "#22D3EE",
    defaultConfig: { model: "gemini-2.5-flash-lite", temperature: 0 },
    fields: [{ key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) }]
  },
  {
    id: "ai.analyze-sentiment",
    title: "Analyze Sentiment",
    category: "AI",
    description: "Classify tone, confidence, and rationale.",
    icon: ActivityIcon,
    accent: "#22D3EE",
    defaultConfig: { model: "gemini-2.5-flash-lite", temperature: 0 },
    fields: [{ key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) }]
  },
  {
    id: "communication.generate-email",
    title: "Generate Email",
    category: "Communication",
    description: "Draft polished outreach or support emails.",
    icon: Mail,
    accent: "#A78BFA",
    defaultConfig: { model: "gemini-2.5-flash-lite", tone: "professional", audience: "customer", temperature: 0.4 },
    fields: [
      { key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) },
      { key: "tone", label: "Tone", type: "select", options: ["professional", "warm", "direct", "executive"] },
      { key: "audience", label: "Audience", type: "text" }
    ]
  },
  {
    id: "developer.extract-json",
    title: "Extract JSON",
    category: "Developer",
    description: "Transform messy text into structured JSON.",
    icon: Braces,
    accent: "#38BDF8",
    defaultConfig: { model: "gemini-2.5-flash-lite", schemaHint: "{ \"summary\": string, \"items\": string[] }", temperature: 0 },
    fields: [
      { key: "model", label: "Model", type: "select", options: geminiModels.map((model) => model.id) },
      { key: "schemaHint", label: "Schema hint", type: "textarea" }
    ]
  },
  {
    id: "developer.http-request",
    title: "HTTP Request",
    category: "Developer",
    description: "Send output to an HTTPS API endpoint.",
    icon: Globe2,
    accent: "#60A5FA",
    defaultConfig: { method: "POST", url: "https://example.com/webhook" },
    fields: [
      { key: "method", label: "Method", type: "select", options: ["POST", "PUT", "PATCH"] },
      { key: "url", label: "URL", type: "text" }
    ]
  },
  {
    id: "logic.condition",
    title: "Condition",
    category: "Logic",
    description: "Branch based on whether content contains a value.",
    icon: GitBranch,
    accent: "#F59E0B",
    defaultConfig: { contains: "" },
    fields: [{ key: "contains", label: "Contains", type: "text" }]
  },
  { id: "files.parse-pdf", title: "Parse PDF", category: "Files", description: "Extract text from PDF documents.", icon: FileText, accent: "#94A3B8", defaultConfig: {}, fields: [] },
  { id: "files.read-csv", title: "Read CSV", category: "Files", description: "Load tabular CSV data.", icon: Table2, accent: "#94A3B8", defaultConfig: {}, fields: [] },
  { id: "files.extract-docx", title: "Extract DOCX", category: "Files", description: "Extract text from Word documents.", icon: FileText, accent: "#94A3B8", defaultConfig: {}, fields: [] },
  { id: "communication.slack-message", title: "Slack Message", category: "Communication", description: "Send a Slack notification.", icon: MessageSquare, accent: "#A78BFA", defaultConfig: {}, fields: [] },
  { id: "communication.discord-webhook", title: "Discord Webhook", category: "Communication", description: "Post to a Discord webhook.", icon: Send, accent: "#A78BFA", defaultConfig: {}, fields: [] },
  { id: "logic.delay", title: "Delay", category: "Logic", description: "Wait before continuing.", icon: Clock3, accent: "#F59E0B", defaultConfig: { seconds: 5 }, fields: [{ key: "seconds", label: "Seconds", type: "text" }] },
  { id: "developer.sql-generator", title: "SQL Generator", category: "Developer", description: "Generate SQL from a request.", icon: Code2, accent: "#38BDF8", defaultConfig: {}, fields: [] },
  { id: "ai.search-web", title: "Search Web", category: "AI", description: "Search the web as part of a workflow.", icon: Search, accent: "#6366F1", defaultConfig: {}, fields: [] }
];

export interface StoredFlow {
  id: string;
  name: string;
  graph: FlowGraph;
  updatedAt: string;
}

export interface FlowGraph {
  nodes: Array<{ id: string; type: string; functionId?: string; data: Record<string, unknown>; position?: { x: number; y: number } }>;
  edges: Array<{ id?: string; source: string; target: string }>;
}

export function getFunctionDefinition(functionId?: string) {
  return functionLibrary.find((definition) => definition.id === functionId) ?? functionLibrary[0];
}

export function toGraph(nodes: Node[], edges: Edge[]): FlowGraph {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: "function",
      functionId: String(node.data.functionId ?? node.type ?? functionLibrary[0].id),
      data: node.data as Record<string, unknown>,
      position: node.position
    })),
    edges: edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target }))
  };
}

export function fromGraph(graph: FlowGraph): { nodes: Node[]; edges: Edge[] } {
  return {
    nodes: graph.nodes.map((node, index) => {
      const functionId = node.functionId ?? legacyFunctionId(node.type);
      const definition = getFunctionDefinition(functionId);
      return {
        id: node.id,
        type: "function",
        data: { ...definition.defaultConfig, ...node.data, functionId, title: definition.title, category: definition.category },
        position: node.position ?? { x: 180 + index * 300, y: 180 }
      };
    }),
    edges: graph.edges.map((edge) => ({ id: edge.id ?? `${edge.source}-${edge.target}`, source: edge.source, target: edge.target, animated: false }))
  };
}

export const starterGraph: FlowGraph = {
  nodes: [],
  edges: []
};

function legacyFunctionId(type: string) {
  if (type === "llm") return "ai.summarize-text";
  if (type === "output") return "developer.extract-json";
  return "ai.summarize-text";
}
