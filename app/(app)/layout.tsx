import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "../../lib/api";
import { AppShell } from "./app-shell";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user: { id: string; email: string };
  try {
    const result = await api("/auth/me", { headers: { cookie: (await cookies()).toString() } });
    user = result.user;
  } catch {
    redirect("/login");
  }

  return <AppShell user={user!}>{children}</AppShell>;
}
