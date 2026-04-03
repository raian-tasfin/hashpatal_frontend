"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Stethoscope,
  User,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import { enumRoleType, RoleType } from "@/lib/sdk";

const roleCards = [
  {
    role: enumRoleType.PATIENT,
    label: "Patient Portal",
    description: "Book appointments, view records, lab results",
    icon: User,
    route: "/patient",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    role: enumRoleType.DOCTOR,
    label: "Doctor Portal",
    description: "Manage appointments and consultations",
    icon: Stethoscope,
    route: "/doctor",
    color: "bg-green-500/10 text-green-500",
  },
  {
    role: enumRoleType.ADMIN,
    label: "Admin Portal",
    description: "Manage users, staff, and reports",
    icon: ShieldCheck,
    route: "/admin",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    role: enumRoleType.LAB_NURSE,
    label: "Lab Portal",
    description: "Manage lab tests and results",
    icon: FlaskConical,
    route: "/lab",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    role: enumRoleType.LAB_TECHNICIAN,
    label: "Lab Portal",
    description: "Process and upload lab results",
    icon: FlaskConical,
    route: "/lab",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  console.log("dashboard render:", { isLoading, user: user?.email });
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  const visibleCards = roleCards.filter((card) =>
    user.user_roles?.includes(card.role as RoleType),
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mt-6 mb-1">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mb-8">
          Select a portal to continue
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.role}
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                onClick={() => router.push(card.route)}
              >
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">{card.label}</h2>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
