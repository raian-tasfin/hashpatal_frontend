import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight as ArrowRightIcon } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function Cta() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="bg-primary rounded-2xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4 text-balance">
            Ready to Take Control of Your Healthcare?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Join thousands of patients and healthcare providers who trust
            Hashpatal for their healthcare management needs.
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Get Started for Free
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
