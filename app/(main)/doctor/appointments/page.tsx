"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/client/sdk-client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

interface Appointment {
  uuid: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  status: string;
  patient?: { name: string; uuid: string } | null;
}

function useMyAppointments() {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
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
            patient: { name: true, uuid: true },
          },
        });
        const all: Appointment[] = result.get_my_appointments || [];
        setUpcoming(
          all
            .filter((a) => a.status === "SCHEDULED")
            .sort((a, b) => {
              const d = a.date.localeCompare(b.date);
              return d !== 0 ? d : a.startTime.localeCompare(b.startTime);
            }),
        );
        setPast(all.filter((a) => a.status === "COMPLETED"));
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { upcoming, past, isLoading };
}

export default function DoctorAppointmentsPage() {
  const { upcoming, past, isLoading } = useMyAppointments();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">My Appointments</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your appointment schedule
        </p>
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
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((appointment) => (
                  <Card
                    key={appointment.uuid}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {appointment.patient?.name || "Patient"}
                          </h3>
                          <p className="text-sm text-primary mt-1 capitalize">
                            {appointment.shift?.toLowerCase()} shift
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {appointment.startTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          <div>
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
                              <h3 className="font-medium">
                                {appointment.patient?.name || "Patient"}
                              </h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {appointment.shift?.toLowerCase()} shift
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground shrink-0">
                              Completed
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {appointment.date}
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
        </>
      )}
    </div>
  );
}
