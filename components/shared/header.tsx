"use client";

import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <ThemeToggle />

          {!isLoading && !user && (
            <>
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
