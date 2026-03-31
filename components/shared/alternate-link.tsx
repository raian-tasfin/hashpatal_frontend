import Link from "next/link";

interface AlternateLinkProps {
  prompt: string;
  route: string;
  label: string;
}

export default function AlternateLink({
  prompt,
  route,
  label,
}: AlternateLinkProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link href={route} className="text-primary hover:underline font-medium">
        {label}
      </Link>
    </p>
  );
}
