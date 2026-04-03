"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/client/sdk-client";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { enumRoleType, RoleType } from "@/lib/sdk";
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

interface UserListItem {
  uuid: string;
  name: string;
  email: string;
  roles: RoleType[];
}

function useAllUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) return;
      const result = await sdk.query({
        admin_get_all_users: {
          uuid: true,
          name: true,
          email: true,
          roles: true,
        },
      });
      setUsers((result.admin_get_all_users as UserListItem[]) ?? []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { users, isLoading, refetch };
}

const ROLE_OPTIONS: { value: RoleType; label: string }[] = [
  { value: enumRoleType.PATIENT, label: "Patient" },
  { value: enumRoleType.DOCTOR, label: "Doctor" },
  { value: enumRoleType.ADMIN, label: "Administrator" },
  { value: enumRoleType.LAB_NURSE, label: "Lab Nurse" },
  { value: enumRoleType.LAB_TECHNICIAN, label: "Lab Technician" },
];

const getRoleIcon = (roles: RoleType[]) => {
  if (roles.includes(enumRoleType.ADMIN)) return Shield;
  if (roles.includes(enumRoleType.DOCTOR)) return Stethoscope;
  if (
    roles.includes(enumRoleType.LAB_NURSE) ||
    roles.includes(enumRoleType.LAB_TECHNICIAN)
  )
    return TestTube;
  return User;
};

const getRoleLabel = (roles: RoleType[]) =>
  ROLE_OPTIONS.filter((o) => roles.includes(o.value))
    .map((o) => o.label)
    .join(", ") || "No Role";

export default function AdminUsersPage() {
  const { users, isLoading, refetch } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectUser = (user: UserListItem) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles);
    setIsSuccess(false);
  };

  const toggleRole = (role: RoleType) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await sdk.mutation({
        user_sync_roles: {
          __args: { data: { uuid: selectedUser.uuid, roles: selectedRoles } },
        },
      });
      await refetch();
      setIsSuccess(true);
      setTimeout(() => {
        setSelectedUser(null);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to assign roles:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
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
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.roles);
                return (
                  <Card
                    key={user.uuid}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedUser?.uuid === user.uuid
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
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground shrink-0">
                        {getRoleLabel(user.roles)}
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
                  Choose a user from the list to view their details and assign
                  roles
                </p>
              </CardContent>
            </Card>
          ) : isSuccess ? (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Roles Updated!</h3>
                <p className="text-muted-foreground">
                  {selectedUser.name}&apos;s roles have been updated
                  successfully.
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
                      <CardTitle>{selectedUser.name}</CardTitle>
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
                    Current Roles
                  </p>
                  <p className="font-medium">
                    {getRoleLabel(selectedUser.roles)}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Assign Roles</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((option) => {
                      const isSelected = selectedRoles.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => toggleRole(option.value)}
                          className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-input hover:border-primary/50"
                          }`}
                        >
                          <div
                            className={`h-5 w-5 rounded flex items-center justify-center border ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-input"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAssignRoles}
                    className="flex-1"
                    disabled={isSubmitting || selectedRoles.length === 0}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Roles"}
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
