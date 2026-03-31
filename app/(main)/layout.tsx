import "../globals.css";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

/**
 * Main Layout Comopnent
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
