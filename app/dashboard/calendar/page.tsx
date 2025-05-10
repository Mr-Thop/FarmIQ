"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CalendarIcon, Plus, Leaf, Sun, CloudRain } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"

export default function CalendarPage() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)

  // Sample planting data
  const plantingSchedule = [
    {
      month: "May",
      crops: [
        { name: "Tomatoes", icon: Leaf, status: "Plant now", optimal: true },
        { name: "Peppers", icon: Leaf, status: "Plant now", optimal: true },
        { name: "Cucumbers", icon: Leaf, status: "Plant now", optimal: true },
        { name: "Squash", icon: Leaf, status: "Plant now", optimal: true },
        { name: "Beans", icon: Leaf, status: "Plant now", optimal: true },
      ],
    },
    {
      month: "June",
      crops: [
        { name: "Corn", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Melons", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Pumpkins", icon: Leaf, status: "Coming soon", optimal: false },
      ],
    },
    {
      month: "July",
      crops: [
        { name: "Kale", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Broccoli", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Cauliflower", icon: Leaf, status: "Coming soon", optimal: false },
      ],
    },
  ]

  const harvestSchedule = [
    {
      month: "May",
      crops: [
        { name: "Lettuce", icon: Leaf, status: "Ready to harvest", optimal: true },
        { name: "Spinach", icon: Leaf, status: "Ready to harvest", optimal: true },
        { name: "Radishes", icon: Leaf, status: "Ready to harvest", optimal: true },
      ],
    },
    {
      month: "June",
      crops: [
        { name: "Peas", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Strawberries", icon: Leaf, status: "Coming soon", optimal: false },
      ],
    },
    {
      month: "July",
      crops: [
        { name: "Early Tomatoes", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Zucchini", icon: Leaf, status: "Coming soon", optimal: false },
        { name: "Summer Squash", icon: Leaf, status: "Coming soon", optimal: false },
      ],
    },
  ]

  const upcomingTasks = [
    {
      date: "May 10",
      task: "Plant tomato seedlings",
      priority: "high",
    },
    {
      date: "May 12",
      task: "Apply organic fertilizer to vegetable beds",
      priority: "medium",
    },
    {
      date: "May 15",
      task: "Install drip irrigation system",
      priority: "high",
    },
    {
      date: "May 18",
      task: "Thin carrot seedlings",
      priority: "medium",
    },
    {
      date: "May 20",
      task: "Plant cucumber seeds",
      priority: "medium",
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            message="You need to login as a farmer to access the Planting Calendar feature."
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
            <h1 className="text-3xl font-bold text-[#2c5d34]">Planting Calendar</h1>
            <p className="text-gray-600">Optimal planting and harvesting schedules for your location</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="border-[#d8e6c0] shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-[#2c5d34]">Upcoming Tasks</CardTitle>
                  <Button size="sm" className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-md border-l-4"
                        style={{
                          borderLeftColor: task.priority === "high" ? "rgb(220, 38, 38)" : "rgb(245, 158, 11)",
                          backgroundColor:
                            task.priority === "high" ? "rgba(254, 226, 226, 0.3)" : "rgba(254, 243, 199, 0.3)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-md shadow-sm">
                            <span className="text-sm font-bold text-[#2c5d34]">{task.date.split(" ")[1]}</span>
                            <span className="text-xs text-gray-500">{task.date.split(" ")[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{task.task}</p>
                            <p className="text-xs text-gray-500">
                              Priority: {task.priority === "high" ? "High" : "Medium"}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-[#d8e6c0] text-[#2c5d34]">
                          Complete
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Card className="border-[#d8e6c0] shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Weather Outlook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="flex items-center justify-between p-3 bg-[#e6f0d8] rounded-md"
                    >
                      <div>
                        <p className="font-medium">Today</p>
                        <p className="text-sm text-gray-600">May 8</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sun className="h-8 w-8 text-yellow-500" />
                        <p className="text-sm">75° / 58°</p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">Tomorrow</p>
                        <p className="text-sm text-gray-600">May 9</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sun className="h-8 w-8 text-yellow-500" />
                        <p className="text-sm">73° / 60°</p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">Sunday</p>
                        <p className="text-sm text-gray-600">May 11</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <CloudRain className="h-8 w-8 text-blue-500" />
                        <p className="text-sm">68° / 60°</p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full text-[#2c5d34] border-[#d8e6c0]">
                      <Link href="/dashboard/weather">View Full Forecast</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="planting" className="mb-8">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="planting">Planting Schedule</TabsTrigger>
              <TabsTrigger value="harvesting">Harvesting Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="planting" className="space-y-6">
              {plantingSchedule.map((month, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-[#d8e6c0]">
                    <CardHeader>
                      <CardTitle className="text-[#2c5d34]">{month.month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {month.crops.map((crop, cropIndex) => (
                          <motion.div
                            key={cropIndex}
                            whileHover={{ scale: 1.03 }}
                            className={`p-4 rounded-md flex items-center gap-3 ${
                              crop.optimal ? "bg-[#e6f0d8]" : "bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                crop.optimal ? "bg-[#2c5d34] text-white" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              <crop.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{crop.name}</p>
                              <p className={`text-xs ${crop.optimal ? "text-green-600 font-medium" : "text-gray-500"}`}>
                                {crop.status}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="harvesting" className="space-y-6">
              {harvestSchedule.map((month, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-[#d8e6c0]">
                    <CardHeader>
                      <CardTitle className="text-[#2c5d34]">{month.month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {month.crops.map((crop, cropIndex) => (
                          <motion.div
                            key={cropIndex}
                            whileHover={{ scale: 1.03 }}
                            className={`p-4 rounded-md flex items-center gap-3 ${
                              crop.optimal ? "bg-[#e6f0d8]" : "bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                crop.optimal ? "bg-[#2c5d34] text-white" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              <crop.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{crop.name}</p>
                              <p className={`text-xs ${crop.optimal ? "text-green-600 font-medium" : "text-gray-500"}`}>
                                {crop.status}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-[#d8e6c0]">
              <CardHeader>
                <CardTitle className="text-[#2c5d34]">Custom Planting Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1 }} className="mb-4">
                    <CalendarIcon className="h-12 w-12 text-[#2c5d34]" />
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2">Create Your Custom Calendar</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Add your specific crops and get personalized planting and harvesting dates based on your location
                    and growing conditions.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Custom Calendar
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
