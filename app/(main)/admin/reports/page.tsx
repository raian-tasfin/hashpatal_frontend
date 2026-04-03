"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Stethoscope, 
  TestTube, 
  TrendingUp, 
  Users 
} from "lucide-react"

export default function AdminReportsPage() {
  const { appointments, labTests, doctors } = useData()

  const scheduledAppointments = appointments.filter((a) => a.status === "scheduled")
  const completedAppointments = appointments.filter((a) => a.status === "completed")
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled")

  const pendingLabTests = labTests.filter((t) => t.status === "pending")
  const inProgressLabTests = labTests.filter((t) => t.status === "in_progress")
  const completedLabTests = labTests.filter((t) => t.status === "completed")

  // Calculate appointment distribution by type
  const consultations = appointments.filter((a) => a.type === "consultation").length
  const diagnostics = appointments.filter((a) => a.type === "diagnostic").length

  // Calculate completion rate
  const completionRate = appointments.length > 0
    ? Math.round((completedAppointments.length / appointments.length) * 100)
    : 0

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold lg:text-3xl">System Reports</h1>
        <p className="text-muted-foreground mt-1">
          Overview of system statistics and metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-xs text-muted-foreground">Total Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <TestTube className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{labTests.length}</p>
                <p className="text-xs text-muted-foreground">Total Lab Tests</p>
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
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-xs text-muted-foreground">Active Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointment Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Statistics
            </CardTitle>
            <CardDescription>Breakdown of appointment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Scheduled</span>
                </div>
                <span className="text-2xl font-bold">{scheduledAppointments.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Completed</span>
                </div>
                <span className="text-2xl font-bold">{completedAppointments.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-destructive" />
                  <span className="font-medium">Cancelled</span>
                </div>
                <span className="text-2xl font-bold">{cancelledAppointments.length}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">By Type</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Stethoscope className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{consultations}</p>
                  <p className="text-xs text-muted-foreground">Consultations</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <TestTube className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{diagnostics}</p>
                  <p className="text-xs text-muted-foreground">Diagnostics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lab Test Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Lab Test Statistics
            </CardTitle>
            <CardDescription>Breakdown of lab test statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Pending</span>
                </div>
                <span className="text-2xl font-bold">{pendingLabTests.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span className="font-medium">In Progress</span>
                </div>
                <span className="text-2xl font-bold">{inProgressLabTests.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">Completed</span>
                </div>
                <span className="text-2xl font-bold">{completedLabTests.length}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Processing Status</h4>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                {labTests.length > 0 && (
                  <div className="h-full flex">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${(completedLabTests.length / labTests.length) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-accent h-full"
                      style={{
                        width: `${(inProgressLabTests.length / labTests.length) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>
                  {labTests.length > 0
                    ? Math.round((completedLabTests.length / labTests.length) * 100)
                    : 0}
                  % completed
                </span>
                <span>
                  {labTests.length > 0
                    ? Math.round((inProgressLabTests.length / labTests.length) * 100)
                    : 0}
                  % in progress
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Doctor Activity
            </CardTitle>
            <CardDescription>Appointment distribution by doctor</CardDescription>
          </CardHeader>
          <CardContent>
            {doctors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No doctor data available</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor) => {
                  const doctorAppointments = appointments.filter((a) => a.doctorId === doctor.id)
                  const doctorCompleted = doctorAppointments.filter(
                    (a) => a.status === "completed"
                  ).length
                  return (
                    <div key={doctor.id} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 rounded bg-background text-center">
                          <p className="text-lg font-bold">{doctorAppointments.length}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="p-2 rounded bg-background text-center">
                          <p className="text-lg font-bold">{doctorCompleted}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
