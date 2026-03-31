import LeftBranding from "@/components/shared/left-branding";

/**
 * Auth Layout Comopnent
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <LeftBranding />
      {children}
    </div>
  );
}
