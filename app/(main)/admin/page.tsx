"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { sdk } from "@/lib/client/sdk-client";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCog,
  Calendar,
  TestTube,
  Activity,
  ArrowRight,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { AdminDashboardOutput } from "@/lib/sdk";

function useAdminDashboard() {
  const [data, setData] = useState<{
    count_active_doctors: number;
    count_scheduled_appointments: number;
    count_completed_appointments_today: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token) return;
        const result = await sdk.query({
          admin_dashboard: {
            count_active_doctors: true,
            count_scheduled_appointments: true,
            count_completed_appointments_today: true,
          },
        });
        setData(result.admin_dashboard);
      } catch (err) {
        console.error("Failed to fetch admin dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, isLoading };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here&apos;s your system overview.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isLoading ? "—" : (data?.count_active_doctors ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">Active Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isLoading ? "—" : (data?.count_scheduled_appointments ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Scheduled Appointments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <UserCog className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users and assign roles
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
