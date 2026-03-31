"use client";

import AlternateLink from "@/components/shared/alternate-link";
import AuthCardHeaderComponent from "@/components/shared/auth-card-header";
import { FormField } from "@/components/shared/form-input";
import { PasswordField } from "@/components/shared/password-field";
import SubmitButton from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { useForm } from "react-hook-form";

/**
 * Component
 */
export default function RegisterComponent() {
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
      name: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      gender: "",
    },
  });

  /**
   * Handlers
   */
  const onSubmit = async (data) => {
    console.log(data);
  };

  /**
   * Main Component
   */
  return (
    <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md border-0 shadow-lg">
        {/* Header */}
        <AuthCardHeaderComponent
          title="Create an account"
          description="Enter your details to get started"
        />

        {/* Input Card */}
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Name */}
            <FormField
              label="Name"
              type="text"
              placeholder="John Doe"
              {...register("name", { required: true })}
            />

            {/* Email */}
            <FormField
              label="Email"
              placeholder="you@example.com"
              type="email"
              {...register("email", { required: true })}
            />

            {/* BirthDate */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                containerClass="space-y-2"
                label="Birth Date"
                type="date"
                {...register("birthDate", { required: true })}
              />

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender", { required: true })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <PasswordField
              label="Password"
              placeholder="Create a password"
              {...register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />
            <PasswordField
              label="Confirm Password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
              error={errors.confirmPassword?.message}
            />

            {/* Submit */}
            <SubmitButton label="Create Account" />

            {/* Alternate */}
            <AlternateLink
              prompt="Already have an account?"
              route={ROUTES.LOGIN}
              label="Sign in"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
