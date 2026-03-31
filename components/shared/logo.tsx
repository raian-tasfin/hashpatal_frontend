import { ROUTES } from "@/lib/routes";
import { Activity as ActivityIcon } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  containerClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({
  containerClassName,
  iconClassName,
  textClassName,
}: LogoProps) {
  return (
    <Link href={ROUTES.HOME}>
      <div className={containerClassName ?? "flex items-center gap-2"}>
        <ActivityIcon className={iconClassName ?? "h-7 w-7 text-primary"} />
        <span className={textClassName ?? "text-xl font-bold"}>Hashpatal</span>
      </div>
    </Link>
  );
}
