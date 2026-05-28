"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "../../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Account creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] px-6 py-6 text-[#F8FAFC]">
      <Link href="/" className="inline-flex items-center text-sm text-[#94A3B8] transition hover:text-[#F8FAFC]">
        <span className="mr-2">←</span> Home
      </Link>

      <div className="grid min-h-[calc(100vh-3rem)] place-items-center">
        <section className="auth-card w-full max-w-md rounded-2xl border border-white/5 bg-[#111827] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold tracking-[0.28em] text-[#F8FAFC]">ORCHA</p>
            <p className="mt-2 text-sm text-[#94A3B8]">Create your workspace account</p>
          </div>

          {error ? <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-slate-500 focus:border-[#22D3EE]/60"
                placeholder="you@company.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-slate-500 focus:border-[#22D3EE]/60"
                placeholder="Create a password"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-slate-500 focus:border-[#22D3EE]/60"
                placeholder="Confirm your password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#22D3EE] transition hover:text-cyan-300">
              Log in -&gt;
            </Link>
          </p>
        </section>
      </div>

      <style jsx global>{`
        .auth-card {
          animation: authFadeIn 420ms ease-out both;
        }

        @keyframes authFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
