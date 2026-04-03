"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/client/sdk-client";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Stethoscope, Check, ChevronDown } from "lucide-react";

interface Department {
  uuid: string;
  name: string;
}

interface Doctor {
  uuid: string;
  name: string;
  email: string;
  department_uuid: string | null;
  department_name: string | null;
}

function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    try {
      const result = await sdk.query({
        department_fetch_all: { uuid: true, name: true },
      });
      setDepartments((result.department_fetch_all as Department[]) ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);
  return { departments, isLoading, refetch };
}

function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) return;
      const result = await sdk.query({
        admin_get_all_doctors: {
          uuid: true,
          name: true,
          email: true,
          department_uuid: true,
          department_name: true,
        },
      });
      setDoctors((result.admin_get_all_doctors as Doctor[]) ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);
  return { doctors, isLoading, refetch };
}

function DoctorDeptAssign({
  doctor,
  departments,
  onAssign,
  isAssigning,
}: {
  doctor: Doctor;
  departments: Department[];
  onAssign: (
    doctorUuid: string,
    departmentUuid: string | null,
  ) => Promise<void>;
  isAssigning: boolean;
}) {
  const [selected, setSelected] = useState(doctor.department_uuid ?? "");

  const isDirty = selected !== (doctor.department_uuid ?? "");

  return (
    <div className="flex gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        disabled={isAssigning}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <option value="">No department</option>
        {departments.map((dept) => (
          <option key={dept.uuid} value={dept.uuid}>
            {dept.name}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        disabled={!isDirty || isAssigning}
        onClick={() => onAssign(doctor.uuid, selected || null)}
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function AdminDepartmentsPage() {
  const {
    departments,
    isLoading: deptLoading,
    refetch: refetchDepts,
  } = useDepartments();
  const {
    doctors,
    isLoading: docLoading,
    refetch: refetchDoctors,
  } = useDoctors();

  const [newDeptName, setNewDeptName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [assigningDoctor, setAssigningDoctor] = useState<string | null>(null);

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return;
    setIsAdding(true);
    try {
      await sdk.mutation({
        department_add: {
          __args: { data: { name: newDeptName.trim() } },
        },
      });
      setNewDeptName("");
      await refetchDepts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAssignDepartment = async (
    doctorUuid: string,
    departmentUuid: string | null,
  ) => {
    setAssigningDoctor(doctorUuid);
    try {
      await sdk.mutation({
        admin_assign_doctor_department: {
          __args: { doctorUuid, departmentUuid },
        },
      });
      await refetchDoctors();
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningDoctor(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Departments</h1>
        <p className="text-muted-foreground mt-1">
          Manage departments and assign doctors
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Departments */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Department</CardTitle>
              <CardDescription>Create a new department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Department name..."
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDepartment()}
                />
                <Button
                  onClick={handleAddDepartment}
                  disabled={isAdding || !newDeptName.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Departments</CardTitle>
            </CardHeader>
            <CardContent>
              {deptLoading ? (
                <p className="text-center text-muted-foreground py-4">
                  Loading...
                </p>
              ) : departments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No departments yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <div
                      key={dept.uuid}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-medium">{dept.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assign Departments to Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assign Departments</CardTitle>
            <CardDescription>Set department for each doctor</CardDescription>
          </CardHeader>
          <CardContent>
            {docLoading ? (
              <p className="text-center text-muted-foreground py-4">
                Loading...
              </p>
            ) : doctors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No doctors found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div key={doctor.uuid} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {doctor.email}
                        </p>
                      </div>
                      {assigningDoctor === doctor.uuid && (
                        <span className="text-xs text-muted-foreground">
                          Saving...
                        </span>
                      )}
                    </div>
                    <DoctorDeptAssign
                      doctor={doctor}
                      departments={departments}
                      onAssign={handleAssignDepartment}
                      isAssigning={assigningDoctor === doctor.uuid}
                    />
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
