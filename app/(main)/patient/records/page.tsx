"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { sdk } from "@/lib/client/sdk-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, FileText, Pill, Stethoscope, User } from "lucide-react";

// Define the shape of our mapped medical record
interface MedicalRecord {
  uuid: string;
  date: string;
  doctorName: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
}

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("hashpatal_accessToken");
        if (!token) return;

        const result = await sdk.query({
          get_my_appointments: {
            uuid: true,
            date: true,
            status: true,
            complaints: {
              name: true,
            },
            diagnosis: {
              name: true,
            },
            prescription_items: {
              medication_name: true,
              dose_quantity: true,
              frequency: true,
              duration_value: true,
              duration_unit: true,
            },
          },
        });

        const rawAppointments = (result.get_my_appointments || []) as any[];

        // Filter for completed appointments, map them to our UI interface, and sort by date
        const mappedRecords = rawAppointments
          .filter((a) => a.status === "COMPLETED")
          .map((a) => {
            // Format prescription items into a readable string
            const prescriptionStr = a.prescription_items
              ?.map(
                (p: any) =>
                  `${p.medication_name} (${p.dose_quantity} dose, ${p.frequency.replace(/_/g, " ").toLowerCase()} for ${p.duration_value} ${p.duration_unit.toLowerCase()})`,
              )
              .join(" • ");

            return {
              uuid: a.uuid,
              date: a.date,
              doctorName: a.doctor?.name || "Unknown Doctor",
              symptoms: a.complaints?.map((c: any) => c.name).join(", ") || "",
              diagnosis: a.diagnosis?.map((d: any) => d.name).join(", ") || "",
              prescription: prescriptionStr || "",
            };
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        setRecords(mappedRecords);
      } catch (err) {
        console.error("Failed to fetch medical records:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Medical Records</h1>
        <p className="text-muted-foreground mt-1">
          Your complete medical history and consultation records
        </p>
      </div>

      {/* Patient Info Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span>
                  <strong>DOB:</strong>{" "}
                  {user?.birthDate
                    ? new Date(user.birthDate).toLocaleDateString()
                    : "N/A"}
                </span>
                <span>
                  <strong>Gender:</strong> {"N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Records List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Consultation History</h2>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading medical records...
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No medical records found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.uuid}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Consultation {/* with {record.doctorName} */}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(record.symptoms || record.diagnosis) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {record.symptoms && (
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Symptoms
                          </p>
                          <p className="text-sm">{record.symptoms}</p>
                        </div>
                      )}
                      {record.diagnosis && (
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            Diagnosis
                          </p>
                          <p className="text-sm">{record.diagnosis}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {record.prescription && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        Prescription
                      </p>
                      <p className="text-sm">{record.prescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
