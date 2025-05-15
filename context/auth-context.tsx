"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth-service"
import { toast } from "@/components/ui/use-toast"
import { apiClient, type User } from "@/lib/api-client"

type UserRole = "farmer" | "customer" | null

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("farmiq-user")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (error) {
            console.error("Failed to parse stored user:", error)
            localStorage.removeItem("farmiq-user")
          }
        }

        // Validate token if it exists
        if (localStorage.getItem("farmiq-token")) {
          const currentUser = await authService.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
            localStorage.setItem("farmiq-user", JSON.stringify(currentUser))
            console.log("User authenticated from token:", currentUser.email)
          } else {
            // Token invalid
            localStorage.removeItem("farmiq-token")
            localStorage.removeItem("farmiq-user")
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
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
    if (!role) return false

    setIsLoading(true)

    try {
      const response = await authService.login({
        email,
        password,
        role,
      })

      if (response) {
        setUser(response.user)

        // Redirect based on role
        if (response.user.role?.toLowerCase() === "farmer") {
          router.push("/dashboard")
        } else if (response.user.role?.toLowerCase() === "customer") {
          router.push("/customer")
        }

        return true
      }

      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })

      return false
    } catch (error) {
      console.error("Login error:", error)

      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!role) return false

    setIsLoading(true)

    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
      })

      if (response) {
        setUser(response.user)
        const role = response.user.role?.toLowerCase();
        // Redirect based on role
        if (role === "farmer") {
          router.push("/dashboard")
        } else if (role === "customer") {
          router.push("/customer")
        }

        return true
      }

      toast({
        title: "Registration failed",
        description: "Email may already be in use",
        variant: "destructive",
      })

      return false
    } catch (error) {
      console.error("Registration error:", error)

      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Even if the API call fails, clear local state
      setUser(null)
      apiClient.clearToken()
      router.push("/")

      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    }
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
