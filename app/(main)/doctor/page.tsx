"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { sdk } from "@/lib/client/sdk-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  Stethoscope,
  ArrowRight,
  User,
  CheckCircle,
} from "lucide-react";

interface Appointment {
  uuid: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface DoctorProfileData {
  today_appointment_count: number;
  total_patients: number;
  completed_consultations: number;
  today_appointments: Appointment[];
}

export function useMyDoctorProfile() {
  const [data, setData] = useState<DoctorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("hashpatal_accessToken");
        if (!token) return;
        const result = await sdk.query({
          my_doctor_profile: {
            today_appointment_count: true,
            total_patients: true,
            completed_consultations: true,
            today_appointments: {
              uuid: true,
              date: true,
              shift: true,
              startTime: true,
              endTime: true,
              status: true,
            },
          },
        });
        setData(result.my_doctor_profile as DoctorProfileData);
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, isLoading };
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useMyDoctorProfile();

  const greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 18
        ? "Afternoon"
        : "Evening";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">
          Good {greeting}, Dr. {user?.name?.split(" ").slice(1).join(" ")}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your schedule and patients
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isLoading ? "—" : (data?.today_appointment_count ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Today&apos;s Appointments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isLoading ? "—" : (data?.total_patients ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isLoading ? "—" : (data?.completed_consultations ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Consultations Done
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/doctor/consultations">
          <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <Stethoscope className="h-7 w-7 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Start Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Begin a patient consultation
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
              <CardDescription>Appointments for today</CardDescription>
            </div>
            <Link href="/doctor/appointments">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : !data?.today_appointments?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.today_appointments.slice(0, 4).map((appointment) => (
                  <div
                    key={appointment.uuid}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">Patient</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {appointment.shift?.toLowerCase()} shift
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{appointment.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.startTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
