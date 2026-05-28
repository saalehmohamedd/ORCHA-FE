"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export interface AppUser {
  id: string;
  email: string;
}

const AppUserContext = createContext<AppUser | null>(null);

export function AppUserProvider({ user, children }: { user: AppUser; children: ReactNode }) {
  return <AppUserContext.Provider value={user}>{children}</AppUserContext.Provider>;
}

export function useAppUser() {
  const user = useContext(AppUserContext);
  if (!user) {
    throw new Error("useAppUser must be used inside AppUserProvider");
  }
  return user;
}
