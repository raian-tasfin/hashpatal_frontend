"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sdk } from "@/lib/client/sdk-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Stethoscope, User } from "lucide-react";

interface Appointment {
  uuid: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  status: string;
}

function useMyAppointments() {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [cancelled, setCancelled] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("hashpatal_accessToken");
        if (!token) return;
        const result = await sdk.query({
          get_my_appointments: {
            uuid: true,
            date: true,
            shift: true,
            startTime: true,
            endTime: true,
            status: true,
          },
        });
        const all: Appointment[] = result.get_my_appointments || [];
        setUpcoming(
          all
            .filter((a) => a.status === "SCHEDULED")
            .sort((a, b) => {
              const dateCompare = a.date.localeCompare(b.date);
              if (dateCompare !== 0) return dateCompare;
              return a.startTime.localeCompare(b.startTime);
            }),
        );
        setPast(all.filter((a) => a.status === "COMPLETED"));
        setCancelled(all.filter((a) => a.status === "CANCELLED"));
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { upcoming, past, cancelled, isLoading };
}

function formatShift(shift: string) {
  return shift.charAt(0) + shift.slice(1).toLowerCase();
}

export default function AppointmentsPage() {
  const { upcoming, past, cancelled, isLoading } = useMyAppointments();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">My Appointments</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your appointments
          </p>
        </div>
        <Link href="/patient/book-appointment">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading appointments...
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Upcoming Appointments
            </h2>
            {upcoming.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No upcoming appointments
                  </p>
                  <Link href="/patient/book-appointment">
                    <Button variant="link" className="mt-2">
                      Book an appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {upcoming.map((appointment) => (
                  <Card
                    key={appointment.uuid}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">Consultation</h3>
                              <p className="text-sm text-primary">
                                {formatShift(appointment.shift)} Shift
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary shrink-0">
                              Scheduled
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(appointment.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.startTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Past Appointments</h2>
            {past.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {past.map((appointment) => (
                  <Card key={appointment.uuid}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium">Consultation</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatShift(appointment.shift)} Shift
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground shrink-0">
                              Completed
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.startTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Cancelled Appointments
              </h2>
              <div className="space-y-3">
                {cancelled.map((appointment) => (
                  <Card key={appointment.uuid} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <Calendar className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Consultation</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} —{" "}
                            {formatShift(appointment.shift)} Shift
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
                          Cancelled
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
