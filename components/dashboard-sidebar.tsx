"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Stethoscope,
  TestTube,
  UserCog,
  ClipboardList,
  Activity,
  Building2,
} from "lucide-react";
import { RoleType as enumRoleType, RoleType } from "@/lib/sdk";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: Record<enumRoleType, NavItem[]> = {
  PATIENT: [
    { label: "Dashboard", href: "/patient", icon: LayoutDashboard },
    { label: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "Medical Records", href: "/patient/records", icon: FileText },
  ],
  DOCTOR: [
    { label: "Dashboard", href: "/doctor", icon: LayoutDashboard },
    { label: "Appointments", href: "/doctor/appointments", icon: Calendar },
    /* {
     *   label: "Consultations",
     *   href: "/doctor/consultations",
     *   icon: Stethoscope,
     * } */
    ,
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: UserCog },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
  ],
  LAB_NURSE: [
    { label: "Dashboard", href: "/lab", icon: LayoutDashboard },
    { label: "Pending Tests", href: "/lab/pending", icon: TestTube },
    { label: "Completed Tests", href: "/lab/completed", icon: FileText },
    { label: "Patients", href: "/lab/patients", icon: Users },
  ],
  LAB_TECHNICIAN: [
    { label: "Dashboard", href: "/lab", icon: LayoutDashboard },
    { label: "Pending Tests", href: "/lab/pending", icon: TestTube },
    { label: "Completed Tests", href: "/lab/completed", icon: FileText },
    { label: "Patients", href: "/lab/patients", icon: Users },
  ],
};

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const getActiveRole = (): RoleType => {
    if (pathname.startsWith("/doctor")) return "DOCTOR";
    if (pathname.startsWith("/admin")) return "ADMIN";
    if (pathname.startsWith("/lab-nurse")) return "LAB_NURSE";
    if (pathname.startsWith("/lab-tech")) return "LAB_TECHNICIAN";
    if (pathname.startsWith("/patient")) return "PATIENT";

    return Array.isArray(user.user_roles)
      ? user.user_roles[0]
      : user.user_roles;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getRoleLabel = (role: RoleType) => {
    const labels: Record<RoleType, string> = {
      PATIENT: "Patient",
      DOCTOR: "Doctor",
      ADMIN: "Administrator",
      LAB_NURSE: "Lab Nurse",
      LAB_TECHNICIAN: "Lab Technician",
    };
    return labels[role];
  };

  const items = navItems[getActiveRole()];

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-sidebar-foreground/60">
            {getRoleLabel(getActiveRole())}
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
