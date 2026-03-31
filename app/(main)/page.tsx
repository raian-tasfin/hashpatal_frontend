"use client";

import Hero from "@/components/shared/hero";
import Features from "@/components/shared/features";
import Cta from "@/components/shared/cta";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <Cta />
    </div>
  );
}
