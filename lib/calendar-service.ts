import { apiClient } from "./api-client"

interface CalendarEvent {
  id: string
  title: string
  start: Date | string
  end: Date | string
  description?: string
  completed?: boolean
  type?: string
}

interface CustomCalendar {
  name: string
  cropType: string
  plantingDate: string
  harvestDate: string
  notes: string
}

class CalendarService {
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get<{ events: CalendarEvent[] }>("/api/calendar/events")
      return response.data?.events || []
    } catch (error) {
      console.error("Error fetching calendar events:", error)
      return []
    }
  }

  async addCalendarEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const response = await apiClient.post<{ event: CalendarEvent }>("/api/calendar/events", event)
      return response.data?.event || null
    } catch (error) {
      console.error("Error adding calendar event:", error)
      return null
    }
  }

  async completeCalendarEvent(eventId: string): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/calendar/events/${eventId}/complete`)
      return response.status === 200
    } catch (error) {
      console.error("Error completing calendar event:", error)
      return false
    }
  }

  async createCustomCalendar(calendar: CustomCalendar): Promise<any> {
    try {
      const response = await apiClient.post("/api/calendar/custom", calendar)
      return response.data
    } catch (error) {
      console.error("Error creating custom calendar:", error)
      return null
    }
  }
}

export const calendarService = new CalendarService()
