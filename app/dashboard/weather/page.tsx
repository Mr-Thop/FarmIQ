"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sun, Cloud, CloudRain, Wind, Droplets, Thermometer } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"
import { Analytics } from "@vercel/analytics/next"

export default function WeatherPage() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)

  const currentWeather = {
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

  const forecast = [
    { day: "Today", date: "May 8", condition: "Sunny", icon: Sun, high: 75, low: 58, precipitation: 0 },
    { day: "Tomorrow", date: "May 9", condition: "Partly Cloudy", icon: Cloud, high: 73, low: 60, precipitation: 10 },
    { day: "Saturday", date: "May 10", condition: "Cloudy", icon: Cloud, high: 70, low: 62, precipitation: 20 },
    { day: "Sunday", date: "May 11", condition: "Rain", icon: CloudRain, high: 68, low: 60, precipitation: 80 },
    { day: "Monday", date: "May 12", condition: "Partly Cloudy", icon: Cloud, high: 72, low: 59, precipitation: 20 },
    { day: "Tuesday", date: "May 13", condition: "Sunny", icon: Sun, high: 76, low: 61, precipitation: 0 },
    { day: "Wednesday", date: "May 14", condition: "Sunny", icon: Sun, high: 78, low: 63, precipitation: 0 },
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

  const farmingTips = [
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
      <Analytics/>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <Link href="/dashboard" className="flex items-center text-[#2c5d34] hover:underline mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#2c5d34]">Weather Forecast</h1>
            <p className="text-gray-600">7-day weather forecast for Green Valley Farm</p>
          </motion.div>

          {/* Current Weather */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-[#d8e6c0] mb-8">
              <CardHeader>
                <CardTitle className="text-[#2c5d34]">Current Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div className="flex flex-col items-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                      <Sun className="h-16 w-16 text-yellow-500 mb-2" />
                    </motion.div>
                    <div className="text-4xl font-bold mb-1">{currentWeather.temp}°F</div>
                    <div className="text-gray-600">{currentWeather.condition}</div>
                    <div className="text-sm text-gray-500 mt-2">Feels like {currentWeather.feelsLike}°F</div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div className="flex flex-col items-center" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Thermometer className="h-6 w-6 text-[#2c5d34] mb-1" />
                      <div className="text-sm font-medium">High/Low</div>
                      <div className="text-lg">{currentWeather.high}°/{currentWeather.low}°</div>
                    </motion.div>
                    <motion.div className="flex flex-col items-center" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Droplets className="h-6 w-6 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">Humidity</div>
                      <div className="text-lg">{currentWeather.humidity}%</div>
                    </motion.div>
                    <motion.div className="flex flex-col items-center" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Wind className="h-6 w-6 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">Wind</div>
                      <div className="text-lg">{currentWeather.wind} mph</div>
                    </motion.div>
                    <motion.div className="flex flex-col items-center" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <CloudRain className="h-6 w-6 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">Precipitation</div>
                      <div className="text-lg">{currentWeather.precipitation}%</div>
                    </motion.div>
                  </div>

                  <motion.div className="bg-[#e6f0d8] p-4 rounded-lg" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <h3 className="font-medium text-[#2c5d34] mb-3">Farming Tips</h3>
                    <ul className="space-y-2 text-sm">
                      {farmingTips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <span className="inline-flex items-center justify-center rounded-full bg-[#2c5d34] text-white h-4 w-4 text-xs mr-2 mt-0.5">•</span>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
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
                        <hour.icon className="h-6 w-6 text-yellow-500 mb-1" />
                        <div className="text-sm font-medium">{hour.time}</div>
                        <div className="text-lg">{hour.temp}°F</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
