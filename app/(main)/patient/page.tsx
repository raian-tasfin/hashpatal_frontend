"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
/* import { useMe } from "@/hooks/use-me"; */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  /*   const { data, isLoading } = useMe(); */

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">
          Welcome back,{" "}
          {/*           {data?.user?.name?.split(" ")[0] ?? user?.name?.split(" ")[0]}! */}
        </h1>
        <p className="text-muted-foreground mt-1">
          What would you like to do today?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/patient/book-appointment">
          <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Stethoscope className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Medical Consult</h3>
                <p className="text-sm text-muted-foreground">
                  Book an appointment with a doctor
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
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
                  {/*                   {isLoading ? "—" : (data?.upcoming_appointments ?? 0)} */}
                </p>
                <p className="text-xs text-muted-foreground">
                  Upcoming Appointments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {/*                   {isLoading ? "—" : (data?.past_visits ?? 0)} */}
                </p>
                <p className="text-xs text-muted-foreground">Past Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </div>
            <Link href="/patient/appointments">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {/* {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                Loading...
                </div>
                ) : !data?.upcoming_appointment_list?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
                <Link href="/patient/book-appointment">
                <Button variant="link" className="mt-2">
                Book an appointment
                </Button>
                </Link>
                </div>
                ) : (
                <div className="space-y-3">
                {data.upcoming_appointment_list
                .slice(0, 3)
                .map((appointment: any) => (
                <div
                key={appointment.uuid}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Consultation</p>
                <p className="text-sm text-muted-foreground capitalize">
                {appointment.shift?.toLowerCase()}
                </p>
                </div>
                <div className="text-right">
                <p className="text-sm font-medium">
                {appointment.date}
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                {appointment.startTime}
                </p>
                </div>
                </div>
                ))}
                </div>
                )} */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
