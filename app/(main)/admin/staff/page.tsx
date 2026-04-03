"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Stethoscope, TestTube, User, Users } from "lucide-react"

// Mock staff data
const MOCK_STAFF = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@hashpatal.com",
    role: "admin",
    department: "Administration",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    email: "doctor@hashpatal.com",
    role: "doctor",
    specialty: "Cardiology",
    department: "Heart & Vascular",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "nurse@hashpatal.com",
    role: "lab_nurse",
    department: "Laboratory",
  },
  {
    id: "5",
    name: "Dr. Michael Chen",
    email: "mchen@hashpatal.com",
    role: "doctor",
    specialty: "Neurology",
    department: "Neurosciences",
  },
  {
    id: "6",
    name: "Dr. Emily Williams",
    email: "ewilliams@hashpatal.com",
    role: "doctor",
    specialty: "Dermatology",
    department: "Skin Care",
  },
  {
    id: "7",
    name: "Dr. James Wilson",
    email: "jwilson@hashpatal.com",
    role: "doctor",
    specialty: "Orthopedics",
    department: "Bone & Joint",
  },
  {
    id: "8",
    name: "Dr. Lisa Anderson",
    email: "landerson@hashpatal.com",
    role: "doctor",
    specialty: "General Medicine",
    department: "Internal Medicine",
  },
  {
    id: "9",
    name: "Robert Taylor",
    email: "rtaylor@hashpatal.com",
    role: "lab_technician",
    department: "Laboratory",
  },
]

export default function AdminStaffPage() {
  const { doctors } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const departments = [...new Set(MOCK_STAFF.map((s) => s.department))]

  const filteredStaff = MOCK_STAFF.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || staff.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "doctor":
        return Stethoscope
      case "lab_nurse":
      case "lab_technician":
        return TestTube
      default:
        return User
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      doctor: "Doctor",
      lab_nurse: "Lab Nurse",
      lab_technician: "Lab Technician",
    }
    return labels[role] || role
  }

  const groupedStaff = {
    doctors: filteredStaff.filter((s) => s.role === "doctor"),
    labStaff: filteredStaff.filter((s) => s.role === "lab_nurse" || s.role === "lab_technician"),
    admin: filteredStaff.filter((s) => s.role === "admin"),
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Staff Directory</h1>
        <p className="text-muted-foreground mt-1">
          View all medical and administrative staff
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groupedStaff.doctors.length}</p>
                <p className="text-xs text-muted-foreground">Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <TestTube className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groupedStaff.labStaff.length}</p>
                <p className="text-xs text-muted-foreground">Lab Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredStaff.length}</p>
                <p className="text-xs text-muted-foreground">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors */}
      {groupedStaff.doctors.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Doctors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedStaff.doctors.map((staff) => (
              <Card key={staff.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{staff.name}</h3>
                      <p className="text-sm text-primary">{staff.specialty}</p>
                      <p className="text-sm text-muted-foreground">{staff.department}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{staff.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lab Staff */}
      {groupedStaff.labStaff.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Laboratory Staff</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedStaff.labStaff.map((staff) => (
              <Card key={staff.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <TestTube className="h-6 w-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">{getRoleLabel(staff.role)}</p>
                      <p className="text-sm text-muted-foreground">{staff.department}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{staff.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Admin Staff */}
      {groupedStaff.admin.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Administration</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedStaff.admin.map((staff) => (
              <Card key={staff.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">{getRoleLabel(staff.role)}</p>
                      <p className="text-sm text-muted-foreground">{staff.department}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{staff.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No staff members found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
