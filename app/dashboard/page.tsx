"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Leaf,
  ShoppingCart,
  Calendar,
  CloudRain,
  Sprout,
  Settings,
  TrendingUp,
  AlertTriangle,
  Sun,
  Droplets,
  Wind,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { Analytics } from "@vercel/analytics/next"

export default function DashboardPage() {
  const [currentWeather, setCurrentWeather] = useState({
    temp: 72,
    condition: "Sunny",
    humidity: 45,
    wind: 8,
    precipitation: 0,
  })

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "disease",
      message: "Potential early blight detected in tomato plants",
      severity: "warning",
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "weather",
      message: "Frost warning for tonight - protect sensitive crops",
      severity: "high",
      date: "5 hours ago",
    },
    {
      id: 3,
      type: "soil",
      message: "Low nitrogen levels detected in north field",
      severity: "medium",
      date: "Yesterday",
    },
  ])

  const [cropStatus, setCropStatus] = useState([
    { id: 1, name: "Tomatoes", status: "Healthy", progress: 65, harvestDate: "Jul 15" },
    { id: 2, name: "Lettuce", status: "Needs water", progress: 40, harvestDate: "Jun 10" },
    { id: 3, name: "Corn", status: "Healthy", progress: 30, harvestDate: "Aug 20" },
    { id: 4, name: "Carrots", status: "Healthy", progress: 50, harvestDate: "Jul 30" },
  ])

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome back, John! Here's an overview of your farm.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Up 2 from last season
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-gray-500 mt-1">In the marketplace</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Soil Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <p className="text-xs text-gray-500 mt-1">Last checked: 2 days ago</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Up 8% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weather and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-[#d8e6c0] lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2c5d34]">
                  <Sun className="h-5 w-5 mr-2" />
                  Today's Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold mb-2">{currentWeather.temp}°F</div>
                  <div className="text-gray-600 mb-4">{currentWeather.condition}</div>
                  <div className="grid grid-cols-3 w-full gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">{currentWeather.humidity}%</div>
                      <div className="text-xs text-gray-500">Humidity</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wind className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">{currentWeather.wind} mph</div>
                      <div className="text-xs text-gray-500">Wind</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <CloudRain className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">{currentWeather.precipitation}%</div>
                      <div className="text-xs text-gray-500">Rain</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full text-[#2c5d34] border-[#d8e6c0]">
                  <Link href="/dashboard/weather">View Forecast</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-[#d8e6c0] lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2c5d34]">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-md"
                      style={{
                        backgroundColor:
                          alert.severity === "high"
                            ? "rgba(254, 226, 226, 0.5)"
                            : alert.severity === "warning"
                              ? "rgba(254, 243, 199, 0.5)"
                              : "rgba(236, 253, 245, 0.5)",
                        borderLeft: `4px solid ${
                          alert.severity === "high"
                            ? "rgb(220, 38, 38)"
                            : alert.severity === "warning"
                              ? "rgb(245, 158, 11)"
                              : "rgb(5, 150, 105)"
                        }`,
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{alert.message}</p>
                          <span className="text-xs text-gray-500">{alert.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.type === "disease"
                            ? "Disease Alert"
                            : alert.type === "weather"
                              ? "Weather Alert"
                              : "Soil Alert"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-[#2c5d34] border-[#d8e6c0]">
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Crop Status */}
          <Card className="border-[#d8e6c0] mb-8">
            <CardHeader>
              <CardTitle className="text-[#2c5d34]">Crop Status</CardTitle>
              <CardDescription>Current status of your active crops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropStatus.map((crop) => (
                  <div key={crop.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-[#2c5d34]" />
                        <span className="font-medium">{crop.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${crop.status === "Healthy" ? "text-green-600" : "text-amber-600"}`}>
                          {crop.status}
                        </span>
                        <span className="text-sm text-gray-500">Harvest: {crop.harvestDate}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#2c5d34] h-2.5 rounded-full" style={{ width: `${crop.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Planted</span>
                      <span>Growing</span>
                      <span>Ready to harvest</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">Manage Crops</Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="tools" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="tools">Farm Tools</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#2c5d34]">
                      <Sprout className="h-5 w-5 mr-2" />
                      Soil Check
                    </CardTitle>
                    <CardDescription>Upload soil photos for quality analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src="/placeholder.svg?height=150&width=300"
                      alt="Soil analysis"
                      className="rounded-md w-full h-36 object-cover mb-4"
                    />
                    <p className="text-sm text-gray-600">
                      Our AI analyzes your soil photos and provides quality assessment and crop recommendations.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">
                      <Link href="/dashboard/soil-check">Check Soil Now</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#2c5d34]">
                      <Leaf className="h-5 w-5 mr-2" />
                      Leaf Disease Detection
                    </CardTitle>
                    <CardDescription>Identify plant diseases with AI analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src="/placeholder.svg?height=150&width=300"
                      alt="Leaf disease detection"
                      className="rounded-md w-full h-36 object-cover mb-4"
                    />
                    <p className="text-sm text-gray-600">
                      Upload photos of plant leaves to detect diseases early and get treatment recommendations.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">
                      <Link href="/dashboard/leaf-disease">Detect Diseases</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-[#2c5d34] text-base">
                      <Calendar className="h-4 w-4 mr-2" />
                      Planting Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Optimal planting schedules based on your location and crops.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full text-[#2c5d34] border-[#2c5d34]">
                      <Link href="/dashboard/calendar">View Calendar</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-[#2c5d34] text-base">
                      <CloudRain className="h-4 w-4 mr-2" />
                      Weather Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">7-day weather predictions for your farm location.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full text-[#2c5d34] border-[#2c5d34]">
                      <Link href="/dashboard/weather">Check Weather</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-[#2c5d34] text-base">
                      <Settings className="h-4 w-4 mr-2" />
                      Farm Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Manage your farm profile and preferences.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full text-[#2c5d34] border-[#2c5d34]">
                      <Link href="/dashboard/settings">Settings</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card className="border-[#d8e6c0]">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#2c5d34]">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Preharvest Market
                    </CardTitle>
                    <CardDescription>Buy and sell agricultural products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3f24] h-24">
                        <Link href="/market?tab=sell">Sell Products</Link>
                      </Button>
                      <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3f24] h-24">
                        <Link href="/market">Buy Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full text-[#2c5d34] border-[#2c5d34]">
                      <Link href="/market">Go to Marketplace</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader>
                    <CardTitle className="text-[#2c5d34]">Your Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-[#e6f0d8] rounded-md">
                        <div>
                          <p className="font-medium">Organic Tomatoes</p>
                          <p className="text-sm text-gray-600">Available: June 15</p>
                        </div>
                        <p className="font-bold">$3.50/kg</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#e6f0d8] rounded-md">
                        <div>
                          <p className="font-medium">Sweet Corn</p>
                          <p className="text-sm text-gray-600">Available: July 10</p>
                        </div>
                        <p className="font-bold">$2.75/dozen</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#e6f0d8] rounded-md">
                        <div>
                          <p className="font-medium">Fresh Lettuce</p>
                          <p className="text-sm text-gray-600">Available: Now</p>
                        </div>
                        <p className="font-bold">$1.99/head</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card className="border-[#d8e6c0] shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#2c5d34]">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Farm Analytics
                  </CardTitle>
                  <CardDescription>Performance metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-[#e6f0d8] rounded-md mb-6">
                    <p className="text-gray-500">Analytics chart placeholder</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-md border border-[#d8e6c0] shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Yield</p>
                      <p className="text-xl font-bold">+12%</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-[#d8e6c0] shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Revenue</p>
                      <p className="text-xl font-bold">$12,450</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-[#d8e6c0] shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Efficiency</p>
                      <p className="text-xl font-bold">85%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">
                    <Link href="/dashboard/reports">View Detailed Reports</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
