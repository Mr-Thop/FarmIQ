"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, FileText, Filter, Printer, Download, TrendingUp, TrendingDown } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Analytics } from "@vercel/analytics/next"

const yieldData = [
  { name: "Jan", yield: 400 },
  { name: "Feb", yield: 300 },
  { name: "Mar", yield: 600 },
  { name: "Apr", yield: 800 },
  { name: "May", yield: 1000 },
  { name: "Jun", yield: 1200 },
  { name: "Jul", yield: 1400 },
]

export default function ReportsPage() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)
  const [date, setDate] = useState(new Date())

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            message="You need to login as a farmer to access the Reports page."
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
        <div className="max-w-7xl mx-auto">
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

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Farm Reports</h1>
                  <p className="text-muted-foreground">Analyze your farm data and generate insights</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Report Date</CardTitle>
                    <CardDescription>Select a date to view reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-md text-center">
                      {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Your latest farm analysis reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">Soil Analysis Report {i}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(2023, 5 + i, 10 + i).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-green-100">
                            View
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-[#d8e6c0] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$35,200</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Up 12% from last year
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-[#d8e6c0] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Crop Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2 tons</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Up 8% from last harvest
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-[#d8e6c0] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450</div>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Down 5% from last year
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-[#d8e6c0] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">64.6%</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Up 3.2% from last year
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="hover:shadow-lg transition-shadow mb-8">
            <CardHeader>
              <CardTitle>Crop Yield Analysis</CardTitle>
              <CardDescription>Monthly yield data for your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="yield" fill="#4ade80" name="Yield (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d8e6c0] mb-8">
            <CardHeader>
              <CardTitle className="text-[#2c5d34]">Generate Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto py-6 bg-[#2c5d34] hover:bg-[#1e3f24]">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <span>Financial Report</span>
                  </div>
                </Button>
                <Button className="h-auto py-6 bg-[#2c5d34] hover:bg-[#1e3f24]">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <span>Crop Analysis</span>
                  </div>
                </Button>
                <Button className="h-auto py-6 bg-[#2c5d34] hover:bg-[#1e3f24]">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <span>Seasonal Report</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
