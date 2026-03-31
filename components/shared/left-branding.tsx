import { Logo } from "./logo";

export default function LeftBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
      <div className="max-w-md text-primary-foreground">
        <Logo
          containerClassName="flex items-center gap-3 mb-8"
          iconClassName="h-12 w-12"
          textClassName="text-4xl font-bold"
        />
        <h1 className="text-3xl font-bold mb-4 text-balance">
          Your Health, Our Priority
        </h1>
        <p className="text-lg opacity-90 leading-relaxed">
          Access your complete healthcare journey in one place. Book
          appointments, view medical records, and connect with healthcare
          professionals seamlessly.
        </p>
      </div>
    </div>
  );
}
