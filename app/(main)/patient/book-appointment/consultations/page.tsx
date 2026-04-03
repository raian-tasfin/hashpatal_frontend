"use client";

import { useState, useEffect } from "react";
import { sdk as client } from "@/lib/client/sdk-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Check,
  Clock,
  FileText,
  Pill,
  Stethoscope,
  User,
  X,
} from "lucide-react";

interface Appointment {
  uuid: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  status: string;
  patient?: { uuid: string; name: string } | null;
}

interface Item {
  uuid: string;
  name: string;
}

interface Medication extends Item {
  dose_unit: string;
}

interface PrescriptionItem {
  medication_uuid: string;
  medication_name: string;
  dose_quantity: number;
  frequency: string;
  duration_value: number;
  duration_unit: string;
}

function FuzzySelect({
  label,
  icon: Icon,
  items,
  selected,
  onToggle,
  placeholder,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Item[];
  selected: string[];
  onToggle: (uuid: string) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedItems = items.filter((i) => selected.includes(i.uuid));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </label>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <span
              key={item.uuid}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {item.name}
              <button
                onClick={() => onToggle(item.uuid)}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="h-10"
        />
        {open && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.uuid}
                onMouseDown={() => {
                  onToggle(item.uuid);
                  setQuery("");
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                  selected.includes(item.uuid)
                    ? "bg-primary/5 text-primary"
                    : ""
                }`}
              >
                {item.name}
                {selected.includes(item.uuid) && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MedicationSearch({
  medications,
  prescriptionItems,
  onAdd,
}: {
  medications: Medication[];
  prescriptionItems: PrescriptionItem[];
  onAdd: (med: Medication) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = medications.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) &&
      !prescriptionItems.some((p) => p.medication_uuid === m.uuid),
  );

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search medications to add..."
        className="h-10"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((med) => (
            <button
              key={med.uuid}
              onMouseDown={() => {
                onAdd(med);
                setQuery("");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between"
            >
              <span>{med.name}</span>
              <span className="text-xs text-muted-foreground">
                {med.dose_unit}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DoctorConsultationsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [complaints, setComplaints] = useState<Item[]>([]);
  const [diagnosisList, setDiagnosisList] = useState<Item[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>([]);
  const [prescriptionItems, setPrescriptionItems] = useState<
    PrescriptionItem[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("hashpatal_accessToken");
        if (!token) return;

        const [apptResult, complaintsResult, diagnosisResult, medResult] =
          await Promise.all([
            client.query({
              get_my_appointments: {
                uuid: true,
                date: true,
                shift: true,
                startTime: true,
                endTime: true,
                status: true,
                patient: { uuid: true, name: true },
              },
            }),
            client.query({ get_all_complaints: { uuid: true, name: true } }),
            client.query({ get_all_diagnosis: { uuid: true, name: true } }),
            client.query({
              get_all_medication: { uuid: true, name: true, dose_unit: true },
            }),
          ]);

        const rawAppointments = (apptResult.get_my_appointments || []) as any[];
        setAppointments(
          rawAppointments
            .filter((a) => a.status === "SCHEDULED")
            .sort((a, b) => {
              const d = a.date.localeCompare(b.date);
              return d !== 0 ? d : a.startTime.localeCompare(b.startTime);
            }),
        );
        setComplaints(complaintsResult.get_all_complaints || []);
        setDiagnosisList(diagnosisResult.get_all_diagnosis || []);
        setMedications(medResult.get_all_medication || []);
      } catch (err) {
        console.error("Failed to fetch consultation data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartConsultation = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedComplaints([]);
    setSelectedDiagnosis([]);
    setPrescriptionItems([]);
    setIsCompleted(false);
  };

  const toggleComplaint = (uuid: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(uuid) ? prev.filter((c) => c !== uuid) : [...prev, uuid],
    );
  };

  const toggleDiagnosis = (uuid: string) => {
    setSelectedDiagnosis((prev) =>
      prev.includes(uuid) ? prev.filter((d) => d !== uuid) : [...prev, uuid],
    );
  };

  const addPrescriptionItem = (med: Medication) => {
    if (prescriptionItems.find((p) => p.medication_uuid === med.uuid)) return;
    setPrescriptionItems((prev) => [
      ...prev,
      {
        medication_uuid: med.uuid,
        medication_name: med.name,
        dose_quantity: 1,
        frequency: "ONCE_DAILY",
        duration_value: 7,
        duration_unit: "DAYS",
      },
    ]);
  };

  const removePrescriptionItem = (uuid: string) => {
    setPrescriptionItems((prev) =>
      prev.filter((p) => p.medication_uuid !== uuid),
    );
  };

  const handleCompleteConsultation = async () => {
    if (!selectedAppointment) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("hashpatal_accessToken");
      const client = sdk(token || undefined);
      await client.mutation({
        complete_consultation: {
          __args: {
            data: {
              appointment_uuid: selectedAppointment.uuid,
              complaint_uuids: selectedComplaints,
              diagnosis_uuids: selectedDiagnosis,
              prescription_items: prescriptionItems.map(
                ({ medication_name: _, ...rest }) => ({
                  ...rest,
                  frequency: rest.frequency as any,
                  duration_unit: rest.duration_unit as any,
                }),
              ),
            },
          },
        },
      });
      setIsCompleted(true);
    } catch (err) {
      console.error("Failed to complete consultation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setIsCompleted(false);
  };

  if (isCompleted && selectedAppointment) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Consultation Completed</h1>
          <p className="text-muted-foreground mb-6">
            The consultation has been successfully recorded.
          </p>
          <Button onClick={handleClose}>Back to Consultations</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Consultations</h1>
        <p className="text-muted-foreground mt-1">
          Manage patient consultations and medical records
        </p>
      </div>

      {!selectedAppointment ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Pending Consultations</h2>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No pending consultations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                <Card
                  key={appointment.uuid}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {appointment.patient?.name || "Patient"}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {appointment.shift?.toLowerCase()} shift
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.startTime}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleStartConsultation(appointment)}
                    >
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Start Consultation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>
                      {selectedAppointment.patient?.name || "Patient"}
                    </CardTitle>
                    <CardDescription>
                      {selectedAppointment.date} at{" "}
                      {selectedAppointment.startTime}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FuzzySelect
                label="Chief Complaints"
                icon={FileText}
                items={complaints}
                selected={selectedComplaints}
                onToggle={toggleComplaint}
                placeholder="Search complaints..."
              />

              <FuzzySelect
                label="Diagnosis"
                icon={Stethoscope}
                items={diagnosisList}
                selected={selectedDiagnosis}
                onToggle={toggleDiagnosis}
                placeholder="Search diagnosis..."
              />

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Prescription
                </label>
                <MedicationSearch
                  medications={medications}
                  prescriptionItems={prescriptionItems}
                  onAdd={addPrescriptionItem}
                />
                {prescriptionItems.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {prescriptionItems.map((item) => (
                      <div
                        key={item.medication_uuid}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 flex-wrap"
                      >
                        <span className="font-medium text-sm flex-1 min-w-[100px]">
                          {item.medication_name}
                        </span>
                        <Input
                          type="number"
                          value={item.dose_quantity}
                          onChange={(e) =>
                            setPrescriptionItems((prev) =>
                              prev.map((p) =>
                                p.medication_uuid === item.medication_uuid
                                  ? {
                                      ...p,
                                      dose_quantity: Number(e.target.value),
                                    }
                                  : p,
                              ),
                            )
                          }
                          className="w-16 h-8 text-sm"
                          min={0.5}
                          step={0.5}
                        />
                        <select
                          value={item.frequency}
                          onChange={(e) =>
                            setPrescriptionItems((prev) =>
                              prev.map((p) =>
                                p.medication_uuid === item.medication_uuid
                                  ? { ...p, frequency: e.target.value }
                                  : p,
                              ),
                            )
                          }
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="ONCE_DAILY">Once Daily</option>
                          <option value="TWICE_DAILY">Twice Daily</option>
                          <option value="THREE_TIMES_DAILY">3x Daily</option>
                          <option value="FOUR_TIMES_DAILY">4x Daily</option>
                          <option value="EVERY_6_HOURS">Every 6h</option>
                          <option value="EVERY_8_HOURS">Every 8h</option>
                        </select>
                        <Input
                          type="number"
                          value={item.duration_value}
                          onChange={(e) =>
                            setPrescriptionItems((prev) =>
                              prev.map((p) =>
                                p.medication_uuid === item.medication_uuid
                                  ? {
                                      ...p,
                                      duration_value: Number(e.target.value),
                                    }
                                  : p,
                              ),
                            )
                          }
                          className="w-16 h-8 text-sm"
                          min={1}
                        />
                        <select
                          value={item.duration_unit}
                          onChange={(e) =>
                            setPrescriptionItems((prev) =>
                              prev.map((p) =>
                                p.medication_uuid === item.medication_uuid
                                  ? { ...p, duration_unit: e.target.value }
                                  : p,
                              ),
                            )
                          }
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="DAYS">Days</option>
                          <option value="WEEKS">Weeks</option>
                        </select>
                        <button
                          onClick={() =>
                            removePrescriptionItem(item.medication_uuid)
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCompleteConsultation}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Completing..." : "Complete Consultation"}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
