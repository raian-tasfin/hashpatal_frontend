"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { AuthCardLogo, Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/routes";
import { useState } from "react";
import AuthCardHeaderComponent from "@/components/shared/auth-card-header";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-input";
import { PasswordField } from "@/components/shared/password-field";
import SubmitButton from "@/components/shared/submit-button";
import AlternateLink from "@/components/shared/alternate-link";

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

  /**
   * Handlers
   */
  const onSubmit = async (data) => {
    console.log(data);
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
