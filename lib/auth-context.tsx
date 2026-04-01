"use client";

import { sdk } from "@/lib/client/sdk-client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { enumRoleType, RoleType } from "./sdk";

/**
 * Types
 */

export interface AuthUser {
  uuid: string;
  email: string;
  name: string;
  birthDate: string;
  user_roles: RoleType[];
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isDoctor: boolean;
  isPatient: boolean;
  isAdmin: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
}

/**
 * Context
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchMe = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await sdk.query({
        me: {
          user: {
            uuid: true,
            email: true,
            name: true,
            birthDate: true,
            user_roles: true,
          },
        },
      });

      const u = result.me?.user;
      if (!u) throw new Error("No user returned");

      setUser({
        uuid: u.uuid,
        email: u.email,
        name: u.name,
        birthDate: u.birthDate,
        user_roles: u.user_roles as RoleType[],
      });
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message ?? "Session expired. Please log in again.";
      setError(message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    await fetchMe();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isDoctor: user?.user_roles?.includes(enumRoleType.DOCTOR) ?? false,
    isPatient: user?.user_roles?.includes(enumRoleType.PATIENT) ?? false,
    isAdmin: user?.user_roles?.includes(enumRoleType.ADMIN) ?? false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
