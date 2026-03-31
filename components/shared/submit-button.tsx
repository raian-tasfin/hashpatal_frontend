import { Button } from "../ui/button";

interface SubmitProps {
  label: string;
}

export default function SubmitButton({ label }: SubmitProps) {
  return (
    <Button type="submit" className="w-full h-11">
      {label}
    </Button>
  );
}
