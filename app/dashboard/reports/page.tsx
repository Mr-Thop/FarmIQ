"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Filter, Printer, FileText } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Sample data for charts
const yieldData = [
  { month: "Jan", yield: 0 },
  { month: "Feb", yield: 0 },
  { month: "Mar", yield: 0 },
  { month: "Apr", yield: 10 },
  { month: "May", yield: 30 },
  { month: "Jun", yield: 70 },
  { month: "Jul", yield: 90 },
  { month: "Aug", yield: 70 },
  { month: "Sep", yield: 50 },
  { month: "Oct", yield: 20 },
  { month: "Nov", yield: 0 },
  { month: "Dec", yield: 0 },
]

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1900 },
  { month: "Mar", revenue: 2100 },
  { month: "Apr", revenue: 2400 },
  { month: "May", revenue: 2700 },
  { month: "Jun", revenue: 3500 },
  { month: "Jul", revenue: 3800 },
  { month: "Aug", revenue: 3300 },
  { month: "Sep", revenue: 2900 },
  { month: "Oct", revenue: 2300 },
  { month: "Nov", revenue: 1700 },
  { month: "Dec", revenue: 1500 },
]

const cropDistributionData = [
  { name: "Corn", value: 35 },
  { name: "Wheat", value: 25 },
  { name: "Soybeans", value: 20 },
  { name: "Vegetables", value: 15 },
  { name: "Fruits", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const { toast } = useToast()
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: "all",
    reportType: "all",
    customStartDate: "",
    customEndDate: "",
  })

  // Handle filter application
  const applyFilters = () => {
    setIsFilterDialogOpen(false)
    toast({
      title: "Filters Applied",
      description: "Your report filters have been applied.",
    })
  }

  // Handle export to CSV
  const exportToCSV = () => {
    toast({
      title: "Export Started",
      description: "Your report is being exported to CSV.",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your report has been exported successfully.",
      })
    }, 1500)
  }

  // Handle print
  const printReports = () => {
    toast({
      title: "Preparing Print",
      description: "Your report is being prepared for printing.",
    })

    // Simulate print preparation
    setTimeout(() => {
      window.print()
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Farm Reports</h1>
              <p className="text-gray-600">View and analyze your farm performance data</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#d8e6c0]"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2 border-[#d8e6c0]" onClick={exportToCSV}>
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2 border-[#d8e6c0]" onClick={printReports}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$28,500</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+12% from last year</p>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Average Yield</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68 bu/acre</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+8% from last year</p>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32%</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+5% from last year</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Annual Yield Overview</CardTitle>
                  <CardDescription>Monthly crop yield for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={yieldData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="yield" fill="#2c5d34" name="Yield (bu/acre)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-[#d8e6c0]">
                  <CardHeader>
                    <CardTitle className="text-[#2c5d34]">Crop Distribution</CardTitle>
                    <CardDescription>Percentage of land allocated to each crop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={cropDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {cropDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader>
                    <CardTitle className="text-[#2c5d34]">Recent Reports</CardTitle>
                    <CardDescription>Latest analysis and findings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-[#2c5d34] pl-4 py-2">
                        <h3 className="font-medium">Soil Health Analysis</h3>
                        <p className="text-sm text-gray-600">June 15, 2023</p>
                        <p className="text-sm mt-1">
                          Nitrogen levels optimal, pH balance improved by 12% since last test.
                        </p>
                      </div>
                      <div className="border-l-4 border-[#2c5d34] pl-4 py-2">
                        <h3 className="font-medium">Quarterly Financial Report</h3>
                        <p className="text-sm text-gray-600">June 1, 2023</p>
                        <p className="text-sm mt-1">
                          Q2 revenue exceeded projections by 8%, expenses under budget by 3%.
                        </p>
                      </div>
                      <div className="border-l-4 border-[#2c5d34] pl-4 py-2">
                        <h3 className="font-medium">Crop Yield Forecast</h3>
                        <p className="text-sm text-gray-600">May 20, 2023</p>
                        <p className="text-sm mt-1">
                          Projected 15% increase in corn yield, 7% increase in soybean yield.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-[#2c5d34] border-[#d8e6c0]">
                      View All Reports
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#2c5d34" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$19,380</div>
                    <p className="text-xs text-red-600 flex items-center mt-1">+3% from last year</p>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$9,120</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+18% from last year</p>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24%</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+4% from last year</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Financial Reports</CardTitle>
                  <CardDescription>Detailed financial analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#f0f7e6] rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-[#2c5d34]" />
                        <div>
                          <h3 className="font-medium">Q2 Financial Statement</h3>
                          <p className="text-sm text-gray-600">June 30, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#2c5d34] border-[#d8e6c0]">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f0f7e6] rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-[#2c5d34]" />
                        <div>
                          <h3 className="font-medium">Cash Flow Analysis</h3>
                          <p className="text-sm text-gray-600">May 15, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#2c5d34] border-[#d8e6c0]">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f0f7e6] rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-[#2c5d34]" />
                        <div>
                          <h3 className="font-medium">Expense Breakdown</h3>
                          <p className="text-sm text-gray-600">April 30, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#2c5d34] border-[#d8e6c0]">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,450 bu</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+15% from last year</p>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Harvested Area</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">183 acres</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+5% from last year</p>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Resource Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">+12% from last year</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Crop Performance</CardTitle>
                  <CardDescription>Yield comparison by crop type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Corn", current: 180, previous: 165 },
                          { name: "Wheat", current: 60, previous: 55 },
                          { name: "Soybeans", current: 50, previous: 48 },
                          { name: "Rice", current: 85, previous: 80 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" fill="#2c5d34" name="Current Year (bu/acre)" />
                        <Bar dataKey="previous" fill="#a3c57d" name="Previous Year (bu/acre)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Production Reports</CardTitle>
                  <CardDescription>Detailed production analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#f0f7e6] rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-[#2c5d34]" />
                        <div>
                          <h3 className="font-medium">Crop Yield Analysis</h3>
                          <p className="text-sm text-gray-600">June 20, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#2c5d34] border-[#d8e6c0]">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f0f7e6] rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-[#2c5d34]" />
                        <div>
                          <h3 className="font-medium">Resource Utilization Report</h3>
                          <p className="text-sm text-gray-600">May 25, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#2c5d34] border-[#d8e6c0]">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f0f7e6] rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-[#2c5d34]" />
                        <div>
                          <h3 className="font-medium">Seasonal Production Summary</h3>
                          <p className="text-sm text-gray-600">April 15, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#2c5d34] border-[#d8e6c0]">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Reports</DialogTitle>
            <DialogDescription>Customize your report view with filters.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filters.dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.customStartDate}
                    onChange={(e) => setFilters({ ...filters, customStartDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.customEndDate}
                    onChange={(e) => setFilters({ ...filters, customEndDate: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select
                value={filters.reportType}
                onValueChange={(value) => setFilters({ ...filters, reportType: value })}
              >
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="soil">Soil Analysis</SelectItem>
                  <SelectItem value="crop">Crop Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]" onClick={applyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
