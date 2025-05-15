"use client"

import { useState, useEffect } from "react"
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
  TrendingUp,
  AlertTriangle,
  Sun,
  Droplets,
  Wind,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { weatherService, type WeatherData } from "@/lib/weather-service"
import { farmService, type FarmStats, type Crop } from "@/lib/farm-service"
import { notificationService, type Notification } from "@/lib/notification-service"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import ErrorBoundary from "@/components/error-boundary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State for data
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [alerts, setAlerts] = useState<Notification[]>([])
  const [farmStats, setFarmStats] = useState<FarmStats | null>(null)
  const [cropStatus, setCropStatus] = useState<Crop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State for manage crops dialog
  const [isManageCropsOpen, setIsManageCropsOpen] = useState(false)
  const [isAddCropOpen, setIsAddCropOpen] = useState(false)
  const [isEditCropOpen, setIsEditCropOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [newCrop, setNewCrop] = useState<Omit<Crop, "id">>({
    name: "",
    status: "Planted",
    progress: 10,
    harvestDate: new Date().toISOString().split("T")[0],
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch weather data (using default farm location)
        const weatherData = await weatherService.getCurrentWeather("34.052235", "-118.243683")
        if (weatherData) {
          setCurrentWeather(weatherData)
          console.log("Weather data loaded:", weatherData)
        }

        // Fetch farm stats
        const stats = await farmService.getFarmStats()
        if (stats) {
          setFarmStats(stats)
          console.log("Farm stats loaded:", stats)
        }

        // Fetch crop status
        const crops = await farmService.getCrops()
        if (crops) {
          setCropStatus(crops)
          console.log("Crop status loaded:", crops)
        }

        // Fetch alerts/notifications
        const notifications = await notificationService.getNotifications()
        if (notifications) {
          setAlerts(notifications)
          console.log("Notifications loaded:", notifications)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  // Handle marking notification as read
  const handleMarkAsRead = async (id: number) => {
    try {
      const success = await notificationService.markAsRead(id)
      if (success) {
        // Update local state to reflect the change
        setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
        console.log(`Notification ${id} marked as read`)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Handle adding a new crop
  const handleAddCrop = async () => {
    try {
      const result = await farmService.addCrop(newCrop)
      if (result.success) {
        setCropStatus([...cropStatus, result.crop])
        setIsAddCropOpen(false)
        setNewCrop({
          name: "",
          status: "Planted",
          progress: 10,
          harvestDate: new Date().toISOString().split("T")[0],
        })
        toast({
          title: "Success",
          description: "Crop added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding crop:", error)
      toast({
        title: "Error",
        description: "Failed to add crop",
        variant: "destructive",
      })
    }
  }

  // Handle updating a crop
  const handleUpdateCrop = async () => {
    if (!selectedCrop) return

    try {
      const success = await farmService.updateCrop(selectedCrop.id, newCrop)
      if (success) {
        setCropStatus(cropStatus.map((crop) => (crop.id === selectedCrop.id ? { ...crop, ...newCrop } : crop)))
        setIsEditCropOpen(false)
        setSelectedCrop(null)
        toast({
          title: "Success",
          description: "Crop updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating crop:", error)
      toast({
        title: "Error",
        description: "Failed to update crop",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a crop
  const handleDeleteCrop = async (cropId: number) => {
    try {
      const success = await farmService.deleteCrop(cropId)
      if (success) {
        setCropStatus(cropStatus.filter((crop) => crop.id !== cropId))
        toast({
          title: "Success",
          description: "Crop deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting crop:", error)
      toast({
        title: "Error",
        description: "Failed to delete crop",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || "Farmer"}! Here's an overview of your farm.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmStats?.totalCrops || "..."}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {farmStats?.cropChange
                    ? `${farmStats.cropChange > 0 ? "Up" : "Down"} ${Math.abs(farmStats.cropChange)} from last season`
                    : "Loading..."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmStats?.activeListings || "..."}</div>
                <p className="text-xs text-gray-500 mt-1">In the marketplace</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Soil Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{farmStats?.soilHealth || "..."}</div>
                <p className="text-xs text-gray-500 mt-1">Last checked: {farmStats?.lastSoilCheck || "..."}</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${farmStats?.revenue?.toLocaleString() || "..."}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {farmStats?.revenueChange
                    ? `${farmStats.revenueChange > 0 ? "Up" : "Down"} ${Math.abs(farmStats.revenueChange)}% from last month`
                    : "Loading..."}
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
                  <div className="text-4xl font-bold mb-2">
                    {currentWeather
                      ? `${Math.round(currentWeather.current.temperature)}°F`
                      : isLoading
                        ? "Loading..."
                        : "N/A"}
                  </div>
                  <div className="text-gray-600 mb-4">
                    {currentWeather?.current.condition || (isLoading ? "Loading..." : "No data")}
                  </div>
                  <div className="grid grid-cols-3 w-full gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">
                        {currentWeather ? `${currentWeather.current.humidity}%` : isLoading ? "..." : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">Humidity</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wind className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">
                        {currentWeather
                          ? `${Math.round(currentWeather.current.wind_speed)} mph`
                          : isLoading
                            ? "..."
                            : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">Wind</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <CloudRain className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-sm font-medium">
                        {currentWeather?.forecast?.[0]?.precipitation || (isLoading ? "..." : "0%")}
                      </div>
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
                  {isLoading ? (
                    <div className="text-center py-4 text-gray-500">Loading alerts...</div>
                  ) : alerts && alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-3 rounded-md cursor-pointer"
                        onClick={() => handleMarkAsRead(alert.id)}
                        style={{
                          backgroundColor: !alert.read
                            ? alert.severity === "high"
                              ? "rgba(254, 226, 226, 0.5)"
                              : alert.severity === "warning"
                                ? "rgba(254, 243, 199, 0.5)"
                                : "rgba(236, 253, 245, 0.5)"
                            : "rgba(243, 244, 246, 0.5)",
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
                            <p className={`font-medium ${!alert.read ? "text-gray-900" : "text-gray-600"}`}>
                              {alert.title}
                            </p>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.type === "disease"
                              ? "Disease Alert"
                              : alert.type === "weather"
                                ? "Weather Alert"
                                : "Soil Alert"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No alerts at this time</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full text-[#2c5d34] border-[#d8e6c0]"
                  onClick={async () => {
                    try {
                      await notificationService.markAllAsRead()
                      setAlerts(alerts.map((alert) => ({ ...alert, read: true })))
                      toast({
                        title: "Success",
                        description: "All notifications marked as read",
                      })
                    } catch (error) {
                      console.error("Error marking all as read:", error)
                      toast({
                        title: "Error",
                        description: "Failed to mark notifications as read",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  Mark All as Read
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
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">Loading crop status...</div>
              ) : cropStatus && cropStatus.length > 0 ? (
                <div className="space-y-4">
                  {cropStatus.map((crop) => (
                    <div key={crop.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-[#2c5d34]" />
                          <span className="font-medium">{crop.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-sm ${crop.status === "Healthy" ? "text-green-600" : "text-amber-600"}`}
                          >
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
              ) : (
                <div className="text-center py-4 text-gray-500">No crop data available</div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]" onClick={() => setIsManageCropsOpen(true)}>
                Manage Crops
              </Button>
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
                    <div className="h-36 bg-[#e6f0d8] rounded-md flex items-center justify-center mb-4">
                      <Sprout className="h-12 w-12 text-[#2c5d34]" />
                    </div>
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
                    <div className="h-36 bg-[#e6f0d8] rounded-md flex items-center justify-center mb-4">
                      <Leaf className="h-12 w-12 text-[#2c5d34]" />
                    </div>
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
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Farm Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">View detailed reports and analytics for your farm.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full text-[#2c5d34] border-[#2c5d34]">
                      <Link href="/dashboard/reports">View Reports</Link>
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
                    {isLoading ? (
                      <div className="text-center py-4 text-gray-500">Loading listings...</div>
                    ) : farmStats?.listings && farmStats.listings.length > 0 ? (
                      <div className="space-y-2">
                        {farmStats.listings.map((listing, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-[#e6f0d8] rounded-md">
                            <div>
                              <p className="font-medium">{listing.name}</p>
                              <p className="text-sm text-gray-600">Available: {listing.availableDate}</p>
                            </div>
                            <p className="font-bold">
                              ${listing.price}/{listing.unit}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">No active listings</div>
                    )}
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
                    {isLoading ? (
                      <p className="text-gray-500">Loading analytics...</p>
                    ) : (
                      <p className="text-gray-500">Analytics chart placeholder</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-md border border-[#d8e6c0] shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Yield</p>
                      <p className="text-xl font-bold">
                        {farmStats?.yieldChange
                          ? `${farmStats.yieldChange > 0 ? "+" : ""}${farmStats.yieldChange}%`
                          : "..."}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-[#d8e6c0] shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Revenue</p>
                      <p className="text-xl font-bold">${farmStats?.revenue?.toLocaleString() || "..."}</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-[#d8e6c0] shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Efficiency</p>
                      <p className="text-xl font-bold">{farmStats?.efficiency || "..."}%</p>
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

      {/* Manage Crops Dialog */}
      <Dialog open={isManageCropsOpen} onOpenChange={setIsManageCropsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Crops</DialogTitle>
            <DialogDescription>View, add, edit, or delete your crops.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Crops</h3>
              <Button
                onClick={() => {
                  setNewCrop({
                    name: "",
                    status: "Planted",
                    progress: 10,
                    harvestDate: new Date().toISOString().split("T")[0],
                  })
                  setIsAddCropOpen(true)
                }}
                className="bg-[#2c5d34] hover:bg-[#1e3f24]"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Crop
              </Button>
            </div>

            {cropStatus.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No crops added yet. Click "Add Crop" to get started.</div>
            ) : (
              <div className="border rounded-md divide-y">
                {cropStatus.map((crop) => (
                  <div key={crop.id} className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{crop.name}</h4>
                      <div className="text-sm text-gray-500">
                        Status: {crop.status} | Progress: {crop.progress}% | Harvest: {crop.harvestDate}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCrop(crop)
                          setNewCrop({
                            name: crop.name,
                            status: crop.status,
                            progress: crop.progress,
                            harvestDate: crop.harvestDate,
                          })
                          setIsEditCropOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCrop(crop.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageCropsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Crop Dialog */}
      <Dialog open={isAddCropOpen} onOpenChange={setIsAddCropOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Crop</DialogTitle>
            <DialogDescription>Enter the details for your new crop.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="crop-name">Crop Name</Label>
              <Input
                id="crop-name"
                value={newCrop.name}
                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                placeholder="e.g., Tomatoes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop-status">Status</Label>
              <Select value={newCrop.status} onValueChange={(value) => setNewCrop({ ...newCrop, status: value })}>
                <SelectTrigger id="crop-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planted">Planted</SelectItem>
                  <SelectItem value="Growing">Growing</SelectItem>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Ready to harvest">Ready to harvest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop-progress">Progress (%)</Label>
              <Input
                id="crop-progress"
                type="number"
                min="0"
                max="100"
                value={newCrop.progress}
                onChange={(e) => setNewCrop({ ...newCrop, progress: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="harvest-date">Expected Harvest Date</Label>
              <Input
                id="harvest-date"
                type="date"
                value={newCrop.harvestDate}
                onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCropOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]" onClick={handleAddCrop} disabled={!newCrop.name}>
              Add Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Crop Dialog */}
      <Dialog open={isEditCropOpen} onOpenChange={setIsEditCropOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Crop</DialogTitle>
            <DialogDescription>Update the details for your crop.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="edit-crop-name">Crop Name</Label>
              <Input
                id="edit-crop-name"
                value={newCrop.name}
                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-crop-status">Status</Label>
              <Select value={newCrop.status} onValueChange={(value) => setNewCrop({ ...newCrop, status: value })}>
                <SelectTrigger id="edit-crop-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planted">Planted</SelectItem>
                  <SelectItem value="Growing">Growing</SelectItem>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Ready to harvest">Ready to harvest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-crop-progress">Progress (%)</Label>
              <Input
                id="edit-crop-progress"
                type="number"
                min="0"
                max="100"
                value={newCrop.progress}
                onChange={(e) => setNewCrop({ ...newCrop, progress: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-harvest-date">Expected Harvest Date</Label>
              <Input
                id="edit-harvest-date"
                type="date"
                value={newCrop.harvestDate}
                onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCropOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]" onClick={handleUpdateCrop} disabled={!newCrop.name}>
              Update Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
      <Chatbot />
    </div>
  )
}
