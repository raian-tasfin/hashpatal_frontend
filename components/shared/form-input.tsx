import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClass?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, containerClass, type = "text", ...props }, ref) => {
    return (
      <div className={containerClass ?? "space-y-2 w-full"}>
        <Label className="text-sm font-medium">{label}</Label>
        <Input
          ref={ref}
          type={type}
          {...props}
          className={`h-11 ${error ? "border-destructive" : ""}`}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

FormField.displayName = "FormField";
