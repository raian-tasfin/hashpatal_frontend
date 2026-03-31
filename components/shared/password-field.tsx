import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

/**
 * Props Interface
 */
interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClass?: string;
}

/**
 * Main Component
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, containerClass, ...props }, ref) => {
    /* States */
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={containerClass ?? "space-y-2"}>
        <Label className="text-sm font-medium">{label ?? "Password"}</Label>
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            {...props}
            className={`h-11 pr-10 ${error ? "border-destructive" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";
