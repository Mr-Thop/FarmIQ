/**
 * Auth service for handling user authentication
 */

import { apiClient, type User } from "./api-client"

export type AuthResponse = {
  user: User
  token: string
}

export type LoginCredentials = {
  email: string
  password: string
  role: "farmer" | "customer"
}

export type RegisterCredentials = {
  name: string
  email: string
  password: string
  role: "farmer" | "customer"
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse | null> {
    console.log("Registering user:", credentials.email)
    const response = await apiClient.post<AuthResponse>("/api/auth/register", credentials)

    if (response.data && response.data.token) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    return null
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    console.log("Logging in user:", credentials.email)
    const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials)

    if (response.data && response.data.token) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    return null
  }

  async logout(): Promise<boolean> {
    console.log("Logging out user")
    const response = await apiClient.post("/api/auth/logout")

    if (response.status === 200) {
      apiClient.clearToken()
      return true
    }

    return false
  }

  async getCurrentUser(): Promise<User | null> {
    console.log("Fetching current user")
    const response = await apiClient.get<{ user: User }>("/api/auth/me")

    if (response.data && response.data.user) {
      return response.data.user
    }

    return null
  }

  async resetPassword(email: string): Promise<boolean> {
    console.log("Requesting password reset for:", email)
    const response = await apiClient.post("/api/auth/password/reset", { email })

    return response.status === 200
  }

  async updateProfile(userData: Partial<User>): Promise<User | null> {
    console.log("Updating user profile:", userData)
    const response = await apiClient.put<{ user: User }>("/api/auth/me", userData)

    if (response.data && response.data.user) {
      return response.data.user
    }

    return null
  }
}

export const authService = new AuthService()
