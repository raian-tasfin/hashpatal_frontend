"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: Record<UserRole, NavItem[]> = {
  patient: [
    { label: "Dashboard", href: "/patient", icon: LayoutDashboard },
    { label: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "Medical Records", href: "/patient/records", icon: FileText },
    { label: "Lab Results", href: "/patient/lab-results", icon: TestTube },
  ],
  doctor: [
    { label: "Dashboard", href: "/doctor", icon: LayoutDashboard },
    { label: "My Patients", href: "/doctor/patients", icon: Users },
    { label: "Appointments", href: "/doctor/appointments", icon: Calendar },
    { label: "Consultations", href: "/doctor/consultations", icon: Stethoscope },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: UserCog },
    { label: "Staff", href: "/admin/staff", icon: Users },
    { label: "Reports", href: "/admin/reports", icon: ClipboardList },
  ],
  lab_nurse: [
    { label: "Dashboard", href: "/lab", icon: LayoutDashboard },
    { label: "Pending Tests", href: "/lab/pending", icon: TestTube },
    { label: "Completed Tests", href: "/lab/completed", icon: FileText },
    { label: "Patients", href: "/lab/patients", icon: Users },
  ],
  lab_technician: [
    { label: "Dashboard", href: "/lab", icon: LayoutDashboard },
    { label: "Pending Tests", href: "/lab/pending", icon: TestTube },
    { label: "Completed Tests", href: "/lab/completed", icon: FileText },
    { label: "Patients", href: "/lab/patients", icon: Users },
  ],
}

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (!user) return null

  const items = navItems[user.role] || navItems.patient

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      patient: "Patient",
      doctor: "Doctor",
      admin: "Administrator",
      lab_nurse: "Lab Nurse",
      lab_technician: "Lab Technician",
    }
    return labels[role]
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Activity className="h-6 w-6 text-sidebar-primary" />
        <span className="text-xl font-bold">Hashpatal</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{user.fullName}</p>
          <p className="text-xs text-sidebar-foreground/60">{getRoleLabel(user.role)}</p>
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
  )
}
