"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"
import { weatherService, type WeatherData, type ForecastDay, type WeatherAlert } from "@/lib/weather-service"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

export default function WeatherPage() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)
  const { toast } = useToast()

  // State for weather data
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch weather data on component mount
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!isAuthenticated) return

      setIsLoading(true)
      try {
        // Default farm location (can be updated to use actual farm location)
        const lat = "34.052235"
        const lng = "-118.243683"

        // Fetch current weather
        const weatherData = await weatherService.getCurrentWeather(lat, lng)
        if (weatherData) {
          setCurrentWeather(weatherData)
          console.log("Weather data loaded:", weatherData)
        }

        // Fetch forecast
        const forecastData = await weatherService.getForecast(lat, lng, 7)
        if (forecastData) {
          setForecast(forecastData)
          console.log("Forecast data loaded:", forecastData)
        }

        // Fetch weather alerts
        const alertsData = await weatherService.getAlerts(lat, lng)
        if (alertsData) {
          setAlerts(alertsData)
          console.log("Weather alerts loaded:", alertsData)
        }
      } catch (error) {
        console.error("Error fetching weather data:", error)
        toast({
          title: "Error",
          description: "Failed to load weather data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()
  }, [isAuthenticated, toast])

  // Fallback data for when API data is loading or unavailable
  const fallbackCurrentWeather = {
    temp: 72,
    condition: "Sunny",
    humidity: 45,
    wind: 8,
    precipitation: 0,
    high: 75,
    low: 58,
    feelsLike: 74,
    pressure: 1015,
    visibility: 10,
    uvIndex: 6,
  }

  const fallbackForecast = [
    {
      day: "Today",
      date: "May 8",
      condition: "Sunny",
      icon: Sun,
      high: 75,
      low: 58,
      precipitation: 0,
    },
    {
      day: "Tomorrow",
      date: "May 9",
      condition: "Partly Cloudy",
      icon: Cloud,
      high: 73,
      low: 60,
      precipitation: 10,
    },
    {
      day: "Saturday",
      date: "May 10",
      condition: "Cloudy",
      icon: Cloud,
      high: 70,
      low: 62,
      precipitation: 20,
    },
    {
      day: "Sunday",
      date: "May 11",
      condition: "Rain",
      icon: CloudRain,
      high: 68,
      low: 60,
      precipitation: 80,
    },
    {
      day: "Monday",
      date: "May 12",
      condition: "Partly Cloudy",
      icon: Cloud,
      high: 72,
      low: 59,
      precipitation: 20,
    },
    {
      day: "Tuesday",
      date: "May 13",
      condition: "Sunny",
      icon: Sun,
      high: 76,
      low: 61,
      precipitation: 0,
    },
    {
      day: "Wednesday",
      date: "May 14",
      condition: "Sunny",
      icon: Sun,
      high: 78,
      low: 63,
      precipitation: 0,
    },
  ]

  const hourlyForecast = [
    { time: "Now", temp: 72, icon: Sun, precipitation: 0 },
    { time: "11 AM", temp: 73, icon: Sun, precipitation: 0 },
    { time: "12 PM", temp: 74, icon: Sun, precipitation: 0 },
    { time: "1 PM", temp: 75, icon: Sun, precipitation: 0 },
    { time: "2 PM", temp: 75, icon: Sun, precipitation: 0 },
    { time: "3 PM", temp: 74, icon: Sun, precipitation: 0 },
    { time: "4 PM", temp: 73, icon: Sun, precipitation: 0 },
    { time: "5 PM", temp: 72, icon: Sun, precipitation: 0 },
    { time: "6 PM", temp: 70, icon: Sun, precipitation: 0 },
    { time: "7 PM", temp: 68, icon: Sun, precipitation: 0 },
    { time: "8 PM", temp: 65, icon: Cloud, precipitation: 0 },
    { time: "9 PM", temp: 63, icon: Cloud, precipitation: 0 },
  ]

  // Helper function to get the appropriate icon based on weather condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
      return CloudRain
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return Cloud
    } else {
      return Sun
    }
  }

  // Generate farming tips based on weather data
  const generateFarmingTips = () => {
    if (!currentWeather) return fallbackFarmingTips

    const tips = []

    // Temperature-based tips
    const temp = currentWeather.current.temperature
    if (temp > 85) {
      tips.push("High temperatures today - ensure crops have adequate water.")
    } else if (temp < 50) {
      tips.push("Cool temperatures - protect sensitive crops from potential frost.")
    } else {
      tips.push("Today's temperatures are ideal for most farming activities.")
    }

    // Condition-based tips
    const condition = currentWeather.current.condition.toLowerCase()
    if (condition.includes("rain")) {
      tips.push("Rainy conditions - hold off on spraying pesticides or fertilizers.")
    } else if (condition.includes("sun") || condition.includes("clear")) {
      tips.push("Sunny conditions are ideal for planting warm-season crops.")
    }

    // Wind-based tips
    const wind = currentWeather.current.wind_speed
    if (wind > 15) {
      tips.push("High winds - secure any loose structures and delay spraying operations.")
    }

    // Add a generic tip if we don't have enough
    if (tips.length < 3) {
      tips.push("Consider watering in the early morning to minimize evaporation.")
    }

    return tips
  }

  const fallbackFarmingTips = [
    "Today's conditions are ideal for planting warm-season crops.",
    "Consider watering in the early morning to minimize evaporation.",
    "UV index is high - protect workers and sensitive plants.",
    "No frost risk in the 7-day forecast.",
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            message="You need to login as a farmer to access the Weather feature."
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/dashboard" className="flex items-center text-[#2c5d34] hover:underline mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#2c5d34]">Weather Forecast</h1>
            <p className="text-gray-600">7-day weather forecast for your farm location</p>
          </motion.div>

          {/* Current Weather */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-[#d8e6c0] mb-8">
              <CardHeader>
                <CardTitle className="text-[#2c5d34]">Current Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      {currentWeather ? (
                        React.createElement(getWeatherIcon(currentWeather.current.condition), {
                          className: "h-16 w-16 text-yellow-500 mb-2",
                        })
                      ) : (
                        <Sun className="h-16 w-16 text-yellow-500 mb-2" />
                      )}
                    </motion.div>
                    <div className="text-4xl font-bold mb-1">
                      {currentWeather
                        ? `${Math.round(currentWeather.current.temperature)}°F`
                        : `${fallbackCurrentWeather.temp}°F`}
                    </div>
                    <div className="text-gray-600">
                      {currentWeather?.current.condition || fallbackCurrentWeather.condition}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Feels like{" "}
                      {currentWeather
                        ? `${Math.round(currentWeather.current.temperature)}°F`
                        : `${fallbackCurrentWeather.feelsLike}°F`}
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Thermometer className="h-6 w-6 text-[#2c5d34] mb-1" />
                      <div className="text-sm font-medium">High/Low</div>
                      <div className="text-lg">
                        {forecast.length > 0
                          ? `${Math.round(forecast[0].temp + 5)}°/${Math.round(forecast[0].temp - 5)}°`
                          : `${fallbackCurrentWeather.high}°/${fallbackCurrentWeather.low}°`}
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Droplets className="h-6 w-6 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">Humidity</div>
                      <div className="text-lg">
                        {currentWeather ? `${currentWeather.current.humidity}%` : `${fallbackCurrentWeather.humidity}%`}
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Wind className="h-6 w-6 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">Wind</div>
                      <div className="text-lg">
                        {currentWeather
                          ? `${Math.round(currentWeather.current.wind_speed)} mph`
                          : `${fallbackCurrentWeather.wind} mph`}
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CloudRain className="h-6 w-6 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">Precipitation</div>
                      <div className="text-lg">
                        {forecast.length > 0
                          ? `${forecast[0].precipitation || 0}%`
                          : `${fallbackCurrentWeather.precipitation}%`}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="bg-[#e6f0d8] p-4 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="font-medium text-[#2c5d34] mb-3">Farming Tips</h3>
                    <ul className="space-y-2 text-sm">
                      {(currentWeather ? generateFarmingTips() : fallbackFarmingTips).map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <span className="inline-flex items-center justify-center rounded-full bg-[#2c5d34] text-white h-4 w-4 text-xs mr-2 mt-0.5">
                            •
                          </span>
                          {tip}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hourly Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-[#d8e6c0] mb-8">
              <CardHeader>
                <CardTitle className="text-[#2c5d34]">Hourly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="flex space-x-6 min-w-max pb-2">
                    {hourlyForecast.map((hour, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center"
                      >
                        <div className="text-sm font-medium">{hour.time}</div>
                        <hour.icon className="h-8 w-8 my-2 text-yellow-500" />
                        <div className="text-sm font-bold">{hour.temp}°</div>
                        <div className="text-xs text-gray-500">{hour.precipitation}%</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 7-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-[#d8e6c0] mb-8">
              <CardHeader>
                <CardTitle className="text-[#2c5d34]">7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {(forecast.length > 0 ? forecast : fallbackForecast).map((day, index) => {
                    // For API data, create a compatible format
                    const displayDay = {
                      day: day.day || `Day ${index + 1}`,
                      date: day.date || new Date().toLocaleDateString(),
                      condition: day.condition || "Unknown",
                      icon: getWeatherIcon(day.condition || ""),
                      high: typeof day.temp === "number" ? Math.round(day.temp + 5) : 75,
                      low: typeof day.temp === "number" ? Math.round(day.temp - 5) : 60,
                      precipitation: day.precipitation || 0,
                    }

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-3 rounded-md border border-[#d8e6c0] shadow-sm flex flex-col items-center"
                      >
                        <div className="font-medium">{displayDay.day}</div>
                        <div className="text-xs text-gray-500 mb-2">{displayDay.date}</div>
                        {React.createElement(displayDay.icon, {
                          className: "h-8 w-8 mb-2 text-yellow-500",
                        })}
                        <div className="text-sm">{displayDay.condition}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="font-bold">{displayDay.high}°</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-500">{displayDay.low}°</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <CloudRain className="h-3 w-3 inline mr-1" />
                          {displayDay.precipitation}%
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weather Alerts */}
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-[#d8e6c0] mb-8 border-red-300">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Weather Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="p-4 rounded-md bg-red-50 border-l-4 border-red-500"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-red-700">{alert.title}</h3>
                          <span className="text-xs text-red-600 font-medium px-2 py-1 bg-red-100 rounded-full">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{alert.description}</p>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Effective: {new Date(alert.effective).toLocaleString()}</span>
                          <span>Expires: {new Date(alert.expires).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
