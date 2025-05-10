"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "farmer" | "customer" | null
type User = {
  id: string
  name: string
  email: string
  role: UserRole
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("farmiq-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("farmiq-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("farmiq-user")
    }
  }, [user])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      if (email && password) {
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          name: email.split("@")[0], // Use part of email as name for demo
          email,
          role,
        }
        setUser(newUser)
        setIsLoading(false)

        // Redirect based on role
        if (role === "farmer") {
          router.push("/dashboard")
        } else if (role === "customer") {
          router.push("/customer")
        }

        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      if (name && email && password && role) {
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          role,
        }
        setUser(newUser)
        setIsLoading(false)

        // Redirect based on role
        if (role === "farmer") {
          router.push("/dashboard")
        } else if (role === "customer") {
          router.push("/customer")
        }

        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
