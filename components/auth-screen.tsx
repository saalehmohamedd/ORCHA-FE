"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Boxes, CircuitBoard, Play, Shield, Sparkles, Store } from "lucide-react";
import { api } from "../lib/api";

export function AuthScreen({ onAuthed }: { onAuthed: (user: { id: string; email: string }) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("dev@orcha.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = await api(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      onAuthed(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-[minmax(0,1fr)_420px] gap-12 px-8 py-10">
        <div className="flex flex-col justify-between">
          <nav className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyanSoft">ORCHA</p>
              <p className="mt-2 text-sm text-slate-500">Visual AI workflow operating system</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Runtime</span>
              <span>Marketplace</span>
              <span>API</span>
            </div>
          </nav>

          <div className="max-w-3xl py-16">
            <h1 className="text-6xl font-semibold leading-tight tracking-normal">Build AI Systems Visually</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Create intelligent workflows, orchestrate AI functions, and run autonomous pipelines using drag-and-drop execution.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button onClick={() => setMode("register")} className="flex items-center gap-2 rounded-lg bg-indigoMuted px-5 py-3 text-sm font-semibold text-white shadow-focus">
                Start Building
                <ArrowRight size={16} />
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-5 py-3 text-sm font-semibold text-slate-100">
                <Play size={16} />
                Live Demo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Feature icon={CircuitBoard} title="Visual Builder" text="Compose capability nodes on an infinite canvas." />
            <Feature icon={Boxes} title="Runtime Engine" text="Execute typed function pipelines with live state." />
            <Feature icon={Store} title="Marketplace" text="Extend systems with reusable AI functions." />
            <Feature icon={Sparkles} title="Real-Time Execution" text="Watch events, durations, and outputs stream in." />
            <Feature icon={Shield} title="Enterprise Runtime" text="Keep auth, cookies, sockets, and keys protected." />
            <Feature icon={ArrowRight} title="Developer API" text="Expose orchestration through clean backend contracts." />
          </div>
        </div>

        <form onSubmit={submit} className="self-center rounded-lg border border-white/10 bg-[#111827] p-6 shadow-2xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-cyanSoft">Workspace access</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-50">Start orchestrating</h2>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-lg border border-white/10 bg-[#0F172A] p-1">
            <button type="button" onClick={() => setMode("login")} className={tabClass(mode === "login")}>
              Login
            </button>
            <button type="button" onClick={() => setMode("register")} className={tabClass(mode === "register")}>
              Register
            </button>
          </div>

          <label className="mb-3 block text-sm text-slate-300">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2 text-slate-100 outline-none focus:border-cyanSoft" />
          </label>

          <label className="mb-4 block text-sm text-slate-300">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2 text-slate-100 outline-none focus:border-cyanSoft" />
          </label>

          {error ? <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}

          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigoMuted px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-400">
            Continue
            <ArrowRight size={16} />
          </button>
        </form>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Sparkles; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111827] p-4">
      <Icon size={18} className="text-cyanSoft" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function tabClass(active: boolean) {
  return `rounded-md px-3 py-1.5 text-sm transition ${active ? "bg-[#1E293B] text-slate-50" : "text-slate-400 hover:text-slate-200"}`;
}
