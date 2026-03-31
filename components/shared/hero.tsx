import { ROUTES } from "@/lib/routes";
import { ArrowRight as ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-balance max-w-4xl mx-auto">
          Your Complete Healthcare Management Solution
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
          Book appointments, access medical records, and connect with healthcare
          professionals - all in one secure platform.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" className="h-12 px-8 text-base">
              Create Free Account
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href={ROUTES.LOGIN}>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
