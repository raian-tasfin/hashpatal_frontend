"use client";

import { useState } from "react";
import { useAuth, type UserRole } from "@/lib/auth-context";
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
  Check,
  Search,
  User,
  UserCog,
  X,
  Shield,
  Stethoscope,
  TestTube,
  Users,
} from "lucide-react";

// Mock users for demo
const MOCK_ALL_USERS = [
  {
    id: "1",
    email: "admin@hashpatal.com",
    fullName: "System Administrator",
    role: "admin" as UserRole,
    department: "Administration",
  },
  {
    id: "2",
    email: "doctor@hashpatal.com",
    fullName: "Dr. Sarah Johnson",
    role: "doctor" as UserRole,
    specialty: "Cardiology",
    department: "Heart & Vascular",
  },
  {
    id: "3",
    email: "patient@hashpatal.com",
    fullName: "John Smith",
    role: "patient" as UserRole,
  },
  {
    id: "4",
    email: "nurse@hashpatal.com",
    fullName: "Emily Davis",
    role: "lab_nurse" as UserRole,
    department: "Laboratory",
  },
  {
    id: "5",
    email: "tech@hashpatal.com",
    fullName: "Mike Wilson",
    role: "lab_technician" as UserRole,
    department: "Laboratory",
  },
  {
    id: "6",
    email: "newuser@example.com",
    fullName: "Jane Doe",
    role: "patient" as UserRole,
  },
];

const SPECIALTIES = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "General Medicine",
  "Pediatrics",
  "Oncology",
  "Psychiatry",
];

const DEPARTMENTS = [
  "Heart & Vascular",
  "Neurosciences",
  "Skin Care",
  "Bone & Joint",
  "Internal Medicine",
  "Children's Health",
  "Cancer Center",
  "Mental Health",
  "Laboratory",
  "Emergency",
];

export default function AdminUsersPage() {
  const { updateUserRole } = useAuth();
  const [users, setUsers] = useState(MOCK_ALL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<
    (typeof MOCK_ALL_USERS)[0] | null
  >(null);
  const [newRole, setNewRole] = useState<UserRole>("patient");
  const [specialty, setSpecialty] = useState("");
  const [department, setDepartment] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return Shield;
      case "doctor":
        return Stethoscope;
      case "lab_nurse":
      case "lab_technician":
        return TestTube;
      default:
        return User;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      patient: "Patient",
      doctor: "Doctor",
      admin: "Administrator",
      lab_nurse: "Lab Nurse",
      lab_technician: "Lab Technician",
    };
    return labels[role];
  };

  const handleSelectUser = (user: (typeof MOCK_ALL_USERS)[0]) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setSpecialty(user.specialty || "");
    setDepartment(user.department || "");
    setIsSuccess(false);
  };

  const handleAssignRole = () => {
    if (!selectedUser) return;

    // Validate doctor role requires specialty
    if (newRole === "doctor" && !specialty) {
      return;
    }

    // Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              role: newRole,
              specialty: newRole === "doctor" ? specialty : undefined,
              department: department || undefined,
            }
          : u,
      ),
    );

    // Update auth context
    updateUserRole(selectedUser.id, newRole, { specialty, department });

    setIsSuccess(true);
    setTimeout(() => {
      setSelectedUser(null);
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Search for users and assign roles
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <Card
                    key={user.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedUser?.id === user.id
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <RoleIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground shrink-0">
                        {getRoleLabel(user.role)}
                      </span>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Role Assignment Panel */}
        <div className="lg:col-span-2">
          {!selectedUser ? (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <UserCog className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a User</h3>
                <p className="text-muted-foreground max-w-sm">
                  Choose a user from the list to view their details and assign a
                  role
                </p>
              </CardContent>
            </Card>
          ) : isSuccess ? (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Role Updated!</h3>
                <p className="text-muted-foreground">
                  {selectedUser.fullName}&apos;s role has been updated to{" "}
                  {getRoleLabel(newRole)}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{selectedUser.fullName}</CardTitle>
                      <CardDescription>{selectedUser.email}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedUser(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Role
                  </p>
                  <p className="font-medium">
                    {getRoleLabel(selectedUser.role)}
                  </p>
                  {selectedUser.specialty && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Specialty: {selectedUser.specialty}
                    </p>
                  )}
                  {selectedUser.department && (
                    <p className="text-sm text-muted-foreground">
                      Department: {selectedUser.department}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Assign New Role</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Administrator</option>
                      <option value="lab_nurse">Lab Nurse</option>
                      <option value="lab_technician">Lab Technician</option>
                    </select>
                  </div>

                  {newRole === "doctor" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Specialty <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select specialty</option>
                        {SPECIALTIES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(newRole === "doctor" ||
                    newRole === "lab_nurse" ||
                    newRole === "lab_technician") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAssignRole}
                    className="flex-1"
                    disabled={newRole === "doctor" && !specialty}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Assign Role
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
