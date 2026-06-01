import { cookies } from "next/headers";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Github,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { api } from "../lib/api";
import { functionLibrary } from "../lib/flow";

const navLinks = ["Features", "Pricing", "Docs", "Enterprise", "GitHub"];

const features = [
  {
    title: "Visual Workflow Builder",
    description:
      "Design AI systems on a drag-and-drop canvas powered by React Flow.",
    icon: Sparkles,
  },
  {
    title: "Real-Time Execution Engine",
    description:
      "Stream runtime events over sockets with per-node execution state.",
    icon: Zap,
  },
  {
    title: "Function Library",
    description:
      "Start with 16+ modular AI, logic, file, and communication functions.",
    icon: Check,
  },
  {
    title: "Observability",
    description:
      "Inspect execution logs, node timings, runtime events, and failures.",
    icon: ChevronDown,
  },
  {
    title: "Provider-Agnostic",
    description:
      "Run Gemini today, then route any LLM provider through one abstraction.",
    icon: Sparkles,
  },
  {
    title: "Enterprise Orchestration",
    description:
      "Role-based access, encrypted credentials, secure sockets, and audit-ready foundations.",
    icon: Shield,
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    description: "For testing workflows and learning the system.",
    features: ["3 agents", "100 runs/month", "Core function library"],
  },
  {
    name: "Pro",
    price: "$29/mo",
    description: "For builders shipping production AI workflows.",
    features: ["Unlimited agents", "10k runs/month", "Priority execution"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams running ORCHA as AI infrastructure.",
    features: ["SLA", "SSO", "Dedicated support"],
  },
];

const faqs = [
  {
    question: "What is ORCHA?",
    answer:
      "ORCHA is a visual AI workflow operating system for composing executable functions into production-ready AI pipelines.",
  },
  {
    question: "Do users need to engineer prompts manually?",
    answer:
      "No. Functions ship with sensible behavior and visual configuration. Advanced prompt control can be exposed later when needed.",
  },
  {
    question: "Which LLM providers are supported?",
    answer:
      "The current runtime uses Gemini, with a provider abstraction designed for OpenAI-compatible APIs, local models, and custom endpoints.",
  },
  {
    question: "Can I observe executions in real time?",
    answer:
      "Yes. ORCHA streams execution events, node status, logs, and runtime output through sockets.",
  },
  {
    question: "Is ORCHA built for teams?",
    answer:
      "Yes. The architecture keeps authentication, encrypted credentials, RBAC-ready roles, and enterprise orchestration in mind.",
  },
];

export default async function LandingPage() {
  const authenticated = await isAuthenticated();

  return (
    <main className="min-h-screen scroll-smooth bg-[#0F172A] text-[#F8FAFC]">
      <Navbar authenticated={authenticated} />
      <section className="relative isolate overflow-hidden px-6 pb-24 pt-32">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
        >
          <source src="/bg-video.mov" type="video/mp4" />
        </video>

        <div className="absolute inset-0 -z-10 bg-[#0F172A]/40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6366F1]/20 blur-3xl" />

        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#22D3EE]">
            Visual AI workflow OS
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-normal md:text-7xl">
            Build AI Systems Visually
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#94A3B8] md:text-lg">
            Design intelligent AI workflows using drag-and-drop execution,
            real-time orchestration, and modular AI functions.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-950/40 transition hover:bg-indigo-500"
            >
              Start Building
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#111827]/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#22D3EE]/50"
            >
              Watch Demo
            </Link>
          </div>

        </div>
      </section>
      <NodeGraph />

      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Capabilities"
            title="Everything needed to orchestrate AI workflows"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-slate-950/20"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#1E293B] text-[#22D3EE]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Function marketplace"
            title="Composable functions for real AI systems"
          />
          <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
            {functionLibrary.map((definition) => {
              const Icon = definition.icon;
              return (
                <article
                  key={definition.id}
                  className="min-w-72 snap-start rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#1E293B]"
                      style={{ color: definition.accent }}
                    >
                      <Icon size={19} />
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-[#94A3B8]">
                      {definition.category}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold">
                    {definition.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                    {definition.description}
                  </p>
                  <div className="mt-5 h-1 rounded-full bg-[#1E293B]">
                    <div
                      className="h-1 w-1/2 rounded-full"
                      style={{ backgroundColor: definition.accent }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Start small, scale into infrastructure"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pricing.map((tier) => (
              <article
                key={tier.name}
                className={`rounded-2xl border p-6 shadow-2xl shadow-slate-950/20 ${tier.name === "Pro" ? "border-[#6366F1]/60 bg-[#1E293B]" : "border-white/10 bg-[#111827]"}`}
              >
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-4 text-3xl font-semibold">{tier.price}</p>
                <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-200"
                    >
                      <Check size={15} className="text-[#22D3EE]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions before orchestration"
            centered
          />
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-[#111827] p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                  {faq.question}
                  <ChevronDown
                    size={16}
                    className="text-[#94A3B8] transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-4 text-sm leading-6 text-[#94A3B8]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#111827] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[0.28em]">ORCHA</p>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Visual AI workflow operating system.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-[#94A3B8]">
            <Link href="#features">Product</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/company">Company</Link>
            <Link
              href="https://github.com"
              className="inline-flex items-center gap-2"
            >
              <Github size={15} />
              GitHub
            </Link>
          </div>
          <p className="text-sm text-[#94A3B8]">
            © 2026 ORCHES. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}


async function isAuthenticated() {
  try {
    await api("/auth/me", {
      headers: { cookie: (await cookies()).toString() },
    });
    return true;
  } catch {
    return false;
  }
}

function Navbar({ authenticated }: { authenticated: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/75 px-6 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.28em] text-[#F8FAFC]"
        >
          ORCHES
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={
                item === "Pricing"
                  ? "#pricing"
                  : item === "Features"
                    ? "#features"
                    : `/${item.toLowerCase()}`
              }
              className="text-sm text-[#94A3B8] transition hover:text-[#F8FAFC]"
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {authenticated ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-[#94A3B8] transition hover:text-[#F8FAFC] sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NodeGraph() {
  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/10 bg-[#111827]/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <svg
        viewBox="0 0 860 260"
        role="img"
        aria-label="Connected AI workflow nodes"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="orcha-edge" x1="0" x2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d="M150 92 C245 42 290 42 385 92"
          stroke="url(#orcha-edge)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse [animation-duration:4s]"
        />
        <path
          d="M150 168 C245 218 290 218 385 168"
          stroke="url(#orcha-edge)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse [animation-duration:4.5s]"
        />
        <path
          d="M475 130 C560 130 590 92 670 92"
          stroke="url(#orcha-edge)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse [animation-duration:5s]"
        />
        <path
          d="M475 130 C560 130 590 168 670 168"
          stroke="url(#orcha-edge)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse [animation-duration:5.5s]"
        />
        <GraphNode x={40} y={62} title="Input" muted="Context" />
        <GraphNode x={335} y={100} title="Summarize" muted="AI" active />
        <GraphNode x={660} y={62} title="Email" muted="Generate" />
        <GraphNode x={660} y={138} title="JSON" muted="Extract" />
        <GraphNode x={40} y={138} title="Webhook" muted="API" />
      </svg>
    </div>
  );
}

function GraphNode({
  x,
  y,
  title,
  muted,
  active = false,
}: {
  x: number;
  y: number;
  title: string;
  muted: string;
  active?: boolean;
}) {
  return (
    <g className={active ? "animate-pulse [animation-duration:3s]" : undefined}>
      <rect
        x={x}
        y={y}
        width="160"
        height="60"
        rx="16"
        fill={active ? "#1E293B" : "#111827"}
        stroke={active ? "#22D3EE" : "rgba(255,255,255,0.12)"}
      />
      <circle
        cx={x + 25}
        cy={y + 30}
        r="8"
        fill={active ? "#22D3EE" : "#6366F1"}
        opacity="0.85"
      />
      <text x={x + 45} y={y + 27} fill="#F8FAFC" fontSize="14" fontWeight="600">
        {title}
      </text>
      <text x={x + 45} y={y + 45} fill="#94A3B8" fontSize="11">
        {muted}
      </text>
    </g>
  );
}

function SectionHeading({
  eyebrow,
  title,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#22D3EE]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
