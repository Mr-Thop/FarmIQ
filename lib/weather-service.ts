/**
 * Weather service for weather data
 */

import { apiClient } from "./api-client"

export type CurrentWeather = {
  temperature: number
  humidity: number
  condition: string
  wind_speed: number
}

export type ForecastDay = {
  day: string
  temp: number
  condition: string
}

export type WeatherData = {
  location: {
    lat: string
    lng: string
  }
  current: CurrentWeather
  forecast: ForecastDay[]
}

export type WeatherAlert = {
  title: string
  severity: string
  description: string
  effective: string
  expires: string
}

class WeatherService {
  async getCurrentWeather(lat: string, lng: string): Promise<WeatherData | null> {
    console.log(`Fetching current weather for lat: ${lat}, lng: ${lng}`)
    const response = await apiClient.get<WeatherData>(`/api/weather/current?lat=${lat}&lng=${lng}`)

    return response.data || null
  }

  async getForecast(lat: string, lng: string, days = 7): Promise<ForecastDay[]> {
    console.log(`Fetching ${days}-day forecast for lat: ${lat}, lng: ${lng}`)
    const response = await apiClient.get<{ forecast: ForecastDay[] }>(
      `/api/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`,
    )

    return response.data?.forecast || []
  }

  async getAlerts(lat: string, lng: string): Promise<WeatherAlert[]> {
    console.log(`Fetching weather alerts for lat: ${lat}, lng: ${lng}`)
    const response = await apiClient.get<{ alerts: WeatherAlert[] }>(`/api/weather/alerts?lat=${lat}&lng=${lng}`)

    return response.data?.alerts || []
  }
}

export const weatherService = new WeatherService()
