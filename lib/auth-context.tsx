"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "patient" | "doctor" | "admin" | "lab_nurse" | "lab_technician"

export interface User {
  id: string
  email: string
  fullName: string
  birthDate: string
  gender: "male" | "female" | "other"
  role: UserRole
  specialty?: string
  department?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "role" | "createdAt"> & { password: string }) => Promise<boolean>
  logout: () => void
  updateUserRole: (userId: string, role: UserRole, details?: { specialty?: string; department?: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@hashpatal.com",
    password: "admin123",
    fullName: "System Administrator",
    birthDate: "1985-01-15",
    gender: "male",
    role: "admin",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    email: "doctor@hashpatal.com",
    password: "doctor123",
    fullName: "Dr. Sarah Johnson",
    birthDate: "1980-06-20",
    gender: "female",
    role: "doctor",
    specialty: "Cardiology",
    department: "Heart & Vascular",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    email: "patient@hashpatal.com",
    password: "patient123",
    fullName: "John Smith",
    birthDate: "1990-03-10",
    gender: "male",
    role: "patient",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    email: "nurse@hashpatal.com",
    password: "nurse123",
    fullName: "Emily Davis",
    birthDate: "1992-08-25",
    gender: "female",
    role: "lab_nurse",
    department: "Laboratory",
    createdAt: "2024-01-01",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<(User & { password: string })[]>(MOCK_USERS)

  useEffect(() => {
    const savedUser = localStorage.getItem("hashpatal_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("hashpatal_user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (userData: Omit<User, "id" | "role" | "createdAt"> & { password: string }): Promise<boolean> => {
    const existingUser = users.find((u) => u.email === userData.email)
    if (existingUser) {
      return false
    }

    const newUser: User & { password: string } = {
      ...userData,
      id: String(users.length + 1),
      role: "patient",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers((prev) => [...prev, newUser])
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("hashpatal_user", JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hashpatal_user")
  }

  const updateUserRole = (userId: string, role: UserRole, details?: { specialty?: string; department?: string }) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role, specialty: details?.specialty, department: details?.department }
          : u
      )
    )
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getAllUsers(): User[] {
  return MOCK_USERS.map(({ password: _, ...user }) => user)
}
