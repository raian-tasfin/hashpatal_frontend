"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Filter,
  Search,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { sdk } from "@/lib/client/sdk-client";
import { ShiftType } from "@/lib/sdk";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";

type Step = "select-doctor" | "select-slot" | "confirm";

interface Shift {
  date: string;
  shift: string;
  status: boolean;
  start_time: string;
  end_time: string;
}

interface Doctor {
  id: string;
  scheduleUuid: string;
  name: string;
  department: string;
  maxBookingDays: number;
  shifts: Shift[];
}

// Helper function to convert shift names to title case
const formatShiftName = (shift: string): string => {
  return shift
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("select-doctor");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isBooked, setIsBooked] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedResult, setBookedResult] = useState<{
    date: string;
    start_time: string;
  } | null>(null);

  // Fetch departments and doctors from SDK
  useEffect(() => {
    const fetchDepartmentsAndDoctors = async () => {
      try {
        const result = await sdk.query({
          department_fetch_all: {
            uuid: true,
            name: true,
            doctors: {
              uuid: true,
              doctor_profile: {
                doctor_name: true,
                schedule: {
                  uuid: true,
                  max_booking_days: true,
                  available_shifts: {
                    date: true,
                    shift: true,
                    status: true,
                    start_time: true,
                    end_time: true,
                  },
                },
              },
            },
          },
        });

        if (result.department_fetch_all) {
          const deptNames = result.department_fetch_all.map((d) => d.name);
          setDepartments(deptNames);

          // Transform API data to Doctor format
          const doctorsList: Doctor[] = [];
          result.department_fetch_all.forEach((dept) => {
            if (dept.doctors) {
              dept.doctors.forEach((doc) => {
                doctorsList.push({
                  id: doc.uuid,
                  scheduleUuid: doc.doctor_profile?.schedule?.uuid || "",
                  name: doc.doctor_profile?.doctor_name || "Dr. Unknown",
                  department: dept.name,
                  maxBookingDays:
                    doc.doctor_profile?.schedule?.max_booking_days || 30,
                  shifts: doc.doctor_profile?.schedule?.available_shifts || [],
                });
              });
            }
          });
          setDoctors(doctorsList);
        }
      } catch (error) {
        console.error("Error fetching departments and doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentsAndDoctors();
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep("select-slot");
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || doctor.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleSelectSlot = (shift: Shift) => {
    setSelectedDate(shift.date);
    setSelectedShift(shift);
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedShift) return;

    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      const result = await sdk.mutation({
        make_appointment: {
          __args: {
            data: {
              scheduleUuid: selectedDoctor.scheduleUuid,
              date: selectedDate,
              shift: selectedShift.shift as ShiftType,
            },
          },
          date: true,
          start_time: true,
        },
      });

      if (result.make_appointment) {
        setBookedResult(result.make_appointment);
        setIsBooked(true);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  const handleBack = () => {
    if (step === "select-slot") {
      setStep("select-doctor");
      setSelectedDoctor(null);
    } else if (step === "confirm") {
      setStep("select-slot");
      setSelectedDate("");
      setSelectedShift(null);
    }
  };

  if (isBooked) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Appointment Booked!</h1>
          <p className="text-muted-foreground mb-6">
            Your appointment with {selectedDoctor?.name} has been successfully
            scheduled for {bookedResult?.date} at {bookedResult?.start_time}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/patient/appointments")}>
              View My Appointments
            </Button>
            <Button variant="outline" onClick={() => router.push("/patient")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/patient")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Book Appointment</h1>
          <p className="text-muted-foreground">
            Schedule a medical consultation
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Select Doctor", "Choose Time", "Confirm"].map((label, index) => {
          const stepIndex = ["select-doctor", "select-slot", "confirm"].indexOf(
            step,
          );
          const isActive = index <= stepIndex;
          const isCurrent = index === stepIndex;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`hidden sm:block text-sm ${
                  isCurrent ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {index < 2 && (
                <div
                  className={`w-8 h-0.5 ${isActive ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Doctor */}
      {step === "select-doctor" && (
        <div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
              </div>
              <p className="mt-4 text-muted-foreground">
                Loading doctors and departments...
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                    onClick={() => handleSelectDoctor(doctor)}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-primary">
                          {doctor.department}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doctor.maxBookingDays} days available
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No doctors found matching your criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2: Select Time Slot */}
      {step === "select-slot" && selectedDoctor && (
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to doctors
          </Button>

          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedDoctor.name}</h3>
                <p className="text-sm text-primary">
                  {selectedDoctor.department}
                </p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold mb-4">Select Date & Shift</h2>
          <div className="space-y-4">
            {selectedDoctor.shifts && selectedDoctor.shifts.length > 0 ? (
              Object.entries(
                selectedDoctor.shifts.reduce(
                  (acc, shift) => {
                    if (!acc[shift.date]) acc[shift.date] = [];
                    acc[shift.date].push(shift);
                    return acc;
                  },
                  {} as Record<string, Shift[]>,
                ),
              ).map(([date, shiftsForDate]) => (
                <Card key={date}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {shiftsForDate.map((shift) => (
                        <Button
                          key={`${shift.date}-${shift.shift}`}
                          variant={shift.status ? "outline" : "ghost"}
                          disabled={!shift.status}
                          onClick={() => handleSelectSlot(shift)}
                          className={`w-full justify-start ${
                            !shift.status
                              ? "opacity-50 cursor-not-allowed text-muted-foreground"
                              : "hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="font-medium">
                            {formatShiftName(shift.shift)}
                          </span>
                          <span className="text-sm ml-2 text-muted-foreground">
                            ({shift.start_time} - {shift.end_time})
                          </span>
                          {!shift.status && (
                            <span className="ml-auto text-xs">Unavailable</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No available shifts found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === "confirm" && selectedDoctor && (
        <div className="max-w-lg mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to shift selection
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Appointment</CardTitle>
              <CardDescription>
                Please review your appointment details before confirming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedDoctor.name}</h3>
                  <p className="text-sm text-primary">
                    {selectedDoctor.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Shift</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedShift
                      ? formatShiftName(selectedShift.shift)
                      : "N/A"}
                  </p>
                  {selectedShift && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedShift.start_time} - {selectedShift.end_time}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Patient</p>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <Button
                onClick={handleConfirmBooking}
                className="w-full"
                size="lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
