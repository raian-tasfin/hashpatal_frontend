import { Logo } from "./logo";

export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo
            iconClassName="h-6 w-5 text-primary"
            textClassName="font-semibold"
          />
          <p className="text-sm text-muted-foreground">
            © 2026 Hashpatal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
