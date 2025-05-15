import { apiClient } from "./api-client"

interface ChatResponse {
  message: string
  suggestions?: string[]
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await apiClient.post("/api/chat", { message })
    return response.data
  } catch (error) {
    console.error("Error in chat service:", error)
    // Fallback response if API is not available
    return {
      message: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
      suggestions: ["Check weather forecast", "View crop calendar", "Soil health tips"],
    }
  }
}

export async function getChatHistory(): Promise<any[]> {
  try {
    const response = await apiClient.get("/api/chat/history")
    return response.data
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return []
  }
}
