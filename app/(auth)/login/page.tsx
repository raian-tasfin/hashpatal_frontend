"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { useState } from "react";
import AuthCardHeaderComponent from "@/components/shared/auth-card-header";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-input";
import { PasswordField } from "@/components/shared/password-field";
import SubmitButton from "@/components/shared/submit-button";
import AlternateLink from "@/components/shared/alternate-link";
import { sdk } from "@/lib/client/sdk-client";
import { useRouter } from "next/navigation";

/**
 * Component
 */
export default function LoginPage() {
  /**
   * States
   */
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  /**
   * Handlers
   */
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await sdk.mutation({
        user_login: {
          __args: {
            data: {
              email: data.email,
              password: data.password,
            },
          },
          accessToken: true,
          refreshToken: true,
        },
      });

      const { accessToken, refreshToken } = result.user_login;
      console.log({ accessToken, refreshToken });

      // store tokens, then redirect
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      router.push(ROUTES.DASHBOARD);
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.message ?? "Login failed. Please try again.";
      setServerError(message);
    }
  };

  /**
   * Returned Component
   */
  return (
    <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md border-0 shadow-lg">
        {/* Header text */}
        <AuthCardHeaderComponent
          title="Welcome back"
          description="Enter your credentials to access your account"
        />

        {/* Input Card */}
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Email Input */}
            <FormField
              label="Email"
              placeholder="you@example.com"
              type="email"
              {...register("email", { required: true })}
            />

            {/* Password */}
            <PasswordField
              placeholder="Create a password"
              {...register("password", { required: true })}
              error={errors.password?.message}
            />

            {/* Server Error */}
            {serverError && (
              <p className="text-sm text-destructive text-center">
                {serverError}
              </p>
            )}

            {/* Sign in button */}
            <SubmitButton label="Sign In" />

            {/* Sign in button */}
            <SubmitButton label="Sign In" />

            {/* Alternate */}
            <AlternateLink
              prompt="Don't have an account?"
              route={ROUTES.REGISTER}
              label="Create account"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
