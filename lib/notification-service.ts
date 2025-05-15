import { apiClient } from "./api-client"

export type Notification = {
  id: number
  title: string
  message: string
  read: boolean
  time: string
  severity: "high" | "warning" | "info"
  type: "disease" | "weather" | "soil" | "system"
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<{ notifications: any[] }>("/api/notifications")

      // Check if there was an error in the response
      if (response.error) {
        console.error("Error fetching notifications:", response.error)
        throw new Error(response.error)
      }

      if (!response.data?.notifications) {
        return []
      }

      // Convert API response to our notification format
      return response.data.notifications.map((notification) => ({
        id: Number.parseInt(notification.id),
        title: notification.title,
        message: notification.message,
        read: notification.is_read,
        time: new Date(notification.created_at).toLocaleTimeString(),
        severity: this.getSeverity(notification),
        type: this.getType(notification),
      }))
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error // Re-throw to allow handling in the component
    }
  }

  async markAsRead(id: number): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/notifications/${id}/read`, {})
      return response.status === 200
    } catch (error) {
      console.error("Error marking notification as read:", error)
      return false
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await apiClient.put("/api/notifications/read-all", {})
      return response.status === 200
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      return false
    }
  }

  // Helper method to determine severity based on notification content
  private getSeverity(notification: any): "high" | "warning" | "info" {
    const title = notification.title.toLowerCase()
    if (title.includes("alert") || title.includes("critical") || title.includes("urgent")) {
      return "high"
    } else if (title.includes("warning") || title.includes("attention")) {
      return "warning"
    }
    return "info"
  }

  // Helper method to determine type based on notification content
  private getType(notification: any): "disease" | "weather" | "soil" | "system" {
    const title = notification.title.toLowerCase()
    if (title.includes("disease") || title.includes("pest")) {
      return "disease"
    } else if (title.includes("weather") || title.includes("temperature") || title.includes("rain")) {
      return "weather"
    } else if (title.includes("soil") || title.includes("nutrient")) {
      return "soil"
    }
    return "system"
  }
}

export const notificationService = new NotificationService()
