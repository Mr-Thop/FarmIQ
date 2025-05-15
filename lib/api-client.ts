const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mr-thop-farmiq.hf.space"

// Types
export type User = {
  id: string
  name: string
  email: string
  role: "farmer" | "customer"
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private token: string | null = null

  constructor() {
    // Initialize token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("farmiq-token")
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("farmiq-token", token)
    console.log("Token set:", token.substring(0, 15) + "...")
  }

  clearToken() {
    this.token = null
    localStorage.removeItem("farmiq-token")
    console.log("Token cleared")
  }

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  async request<T>(endpoint: string, method = "GET", data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      console.log(`API ${method} request to: ${endpoint}`)
      if (data) {
        console.log("Request payload:", data)
      }

      // Check if token is required for this endpoint and is missing
      const requiresAuth = !endpoint.includes("/auth/") && !endpoint.includes("/public/")

      if (requiresAuth && !this.token) {
        console.error("API Error: Token is missing")
        return {
          error: "Authentication required. Please log in.",
          status: 401,
        }
      }

      const response = await fetch(url, {
        method,
        headers: { ...this.getHeaders(), ...customHeaders },
        body: data ? JSON.stringify(data) : undefined,
      })

      // Handle no-content responses
      if (response.status === 204) {
        return { status: response.status, data: undefined }
      }

      // Parse JSON response
      let responseData
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      console.log(`API response (${response.status}):`, responseData)

      if (!response.ok) {
        // Handle error responses (4xx, 5xx)
        const errorMessage = responseData.error || "Something went wrong"
        console.error("API Error:", errorMessage)

        // If it's a 500 error, throw a special error
        if (response.status === 500) {
          const error = new Error("Internal Server Error") as Error & { status?: number }
          error.status = 500
          throw error
        }

        return {
          error: errorMessage,
          status: response.status,
        }
      }

      return {
        data: responseData,
        status: response.status,
      }
    } catch (error) {
      console.error("API request failed:", error)

      // Check if it's our special 500 error
      if ((error as any).status === 500) {
        throw error
      }

      return {
        error: error instanceof Error ? error.message : "Network error",
        status: 0, // Network error or other exception
      }
    }
  }

  async get<T>(endpoint: string, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", undefined, customHeaders)
  }

  async post<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", data, customHeaders)
  }

  async put<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", data, customHeaders)
  }

  async delete<T>(endpoint: string, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE", undefined, customHeaders)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
