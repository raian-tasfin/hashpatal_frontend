import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button>Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
