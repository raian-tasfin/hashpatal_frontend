import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AuthCardLogo } from "./logo";

interface AuthCardHeaderProps {
  title: string;
  description: string;
}

export default function AuthCardHeaderComponent({
  title,
  description,
}: AuthCardHeaderProps) {
  return (
    <CardHeader className="space-y-1 text-center">
      <AuthCardLogo />
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
