"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Doctor {
  id: string
  name: string
  specialty: string
  department: string
  avatar?: string
  availableSlots: { date: string; times: string[] }[]
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: "consultation" | "diagnostic"
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
  labTests?: LabTest[]
}

export interface LabTest {
  id: string
  patientId: string
  patientName: string
  testName: string
  status: "pending" | "in_progress" | "completed"
  orderedBy: string
  orderedDate: string
  results?: string
  completedDate?: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  date: string
  doctorName: string
  symptoms: string
  diagnosis: string
  prescription: string
  notes: string
}

interface DataContextType {
  doctors: Doctor[]
  appointments: Appointment[]
  labTests: LabTest[]
  medicalRecords: MedicalRecord[]
  bookAppointment: (appointment: Omit<Appointment, "id" | "status">) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  addLabTest: (test: Omit<LabTest, "id" | "status">) => void
  updateLabTest: (id: string, updates: Partial<LabTest>) => void
  addMedicalRecord: (record: Omit<MedicalRecord, "id">) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    department: "Heart & Vascular",
    availableSlots: [
      { date: "2026-03-30", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { date: "2026-03-31", times: ["09:00", "10:00", "14:00", "16:00"] },
      { date: "2026-04-01", times: ["10:00", "11:00", "15:00"] },
    ],
  },
  {
    id: "5",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    department: "Neurosciences",
    availableSlots: [
      { date: "2026-03-30", times: ["08:00", "09:00", "13:00", "14:00"] },
      { date: "2026-03-31", times: ["10:00", "11:00", "15:00", "16:00"] },
      { date: "2026-04-01", times: ["09:00", "10:00", "14:00"] },
    ],
  },
  {
    id: "6",
    name: "Dr. Emily Williams",
    specialty: "Dermatology",
    department: "Skin Care",
    availableSlots: [
      { date: "2026-03-30", times: ["09:00", "11:00", "14:00"] },
      { date: "2026-03-31", times: ["08:00", "10:00", "13:00", "15:00"] },
      { date: "2026-04-01", times: ["10:00", "11:00", "16:00"] },
    ],
  },
  {
    id: "7",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    department: "Bone & Joint",
    availableSlots: [
      { date: "2026-03-30", times: ["08:00", "10:00", "13:00", "15:00"] },
      { date: "2026-03-31", times: ["09:00", "11:00", "14:00"] },
      { date: "2026-04-01", times: ["08:00", "09:00", "13:00", "14:00", "16:00"] },
    ],
  },
  {
    id: "8",
    name: "Dr. Lisa Anderson",
    specialty: "General Medicine",
    department: "Internal Medicine",
    availableSlots: [
      { date: "2026-03-30", times: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
      { date: "2026-03-31", times: ["08:00", "09:00", "10:00", "14:00", "15:00"] },
      { date: "2026-04-01", times: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"] },
    ],
  },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientId: "3",
    patientName: "John Smith",
    doctorId: "2",
    doctorName: "Dr. Sarah Johnson",
    date: "2026-03-28",
    time: "09:00",
    type: "consultation",
    status: "completed",
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Mild angina",
    prescription: "Nitroglycerin 0.4mg as needed",
    notes: "Follow up in 2 weeks. ECG recommended.",
  },
  {
    id: "2",
    patientId: "3",
    patientName: "John Smith",
    doctorId: "2",
    doctorName: "Dr. Sarah Johnson",
    date: "2026-03-30",
    time: "10:00",
    type: "consultation",
    status: "scheduled",
  },
]

const MOCK_LAB_TESTS: LabTest[] = [
  {
    id: "1",
    patientId: "3",
    patientName: "John Smith",
    testName: "Complete Blood Count (CBC)",
    status: "completed",
    orderedBy: "Dr. Sarah Johnson",
    orderedDate: "2026-03-25",
    results: "All values within normal range",
    completedDate: "2026-03-26",
  },
  {
    id: "2",
    patientId: "3",
    patientName: "John Smith",
    testName: "Lipid Panel",
    status: "pending",
    orderedBy: "Dr. Sarah Johnson",
    orderedDate: "2026-03-28",
  },
]

const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: "1",
    patientId: "3",
    date: "2026-03-28",
    doctorName: "Dr. Sarah Johnson",
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Mild angina",
    prescription: "Nitroglycerin 0.4mg as needed",
    notes: "Patient advised to reduce physical exertion and follow up in 2 weeks.",
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS)
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [labTests, setLabTests] = useState<LabTest[]>(MOCK_LAB_TESTS)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(MOCK_MEDICAL_RECORDS)

  const bookAppointment = (appointment: Omit<Appointment, "id" | "status">) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: String(appointments.length + 1),
      status: "scheduled",
    }
    setAppointments((prev) => [...prev, newAppointment])
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    )
  }

  const addLabTest = (test: Omit<LabTest, "id" | "status">) => {
    const newTest: LabTest = {
      ...test,
      id: String(labTests.length + 1),
      status: "pending",
    }
    setLabTests((prev) => [...prev, newTest])
  }

  const updateLabTest = (id: string, updates: Partial<LabTest>) => {
    setLabTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  const addMedicalRecord = (record: Omit<MedicalRecord, "id">) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: String(medicalRecords.length + 1),
    }
    setMedicalRecords((prev) => [...prev, newRecord])
  }

  return (
    <DataContext.Provider
      value={{
        doctors,
        appointments,
        labTests,
        medicalRecords,
        bookAppointment,
        updateAppointment,
        addLabTest,
        updateLabTest,
        addMedicalRecord,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
