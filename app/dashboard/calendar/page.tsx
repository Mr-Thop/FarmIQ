"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Plus, Check, Edit } from "lucide-react"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { calendarService } from "@/lib/calendar-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function CalendarPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isCreateCalendarOpen, setIsCreateCalendarOpen] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    priority: "medium",
  })
  const [newCalendar, setNewCalendar] = useState({
    name: "",
    description: "",
    cropType: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
  })

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      setIsLoading(true)
      const result = await calendarService.addTask(newTask)
      if (result.success) {
        setTasks([...tasks, result.task])
        setIsAddTaskOpen(false)
        setNewTask({
          title: "",
          description: "",
          date: new Date().toISOString().split('T')[0],
          priority: "medium",
        })
        toast({
          title: "Success",
          description: "Task added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle creating a new calendar
  const handleCreateCalendar = async () => {
    try {
      setIsLoading(true)
      const result = await calendarService.createCalendar(newCalendar)
      if (result.success) {
        setIsCreateCalendarOpen(false)
        setNewCalendar({
          name: "",
          description: "",
          cropType: "",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        })
        toast({
          title: "Success",
          description: "Calendar created successfully",
        })
      }
    } catch (error) {
      console.error("Error creating calendar:", error)
      toast({
        title: "Error",
        description: "Failed to create calendar",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle marking a task as complete
  const handleCompleteTask = async (taskId: number) => {
    try {
      const success = await calendarService.completeTask(taskId)
      if (success) {
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: true } 
            : task
        ))
        toast({
          title: "Success",
          description: "Task marked as complete",
        })
      }
    } catch (error) {
      console.error("Error completing task:", error)
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Farm Calendar</h1>
              <p className="text-gray-600">Plan and track your farming activities</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button
                className="bg-[#2c5d34] hover:bg-[#1e3f24]"
                onClick={() => setIsAddTaskOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button
                variant="outline"
                className="border-[#d8e6c0]"
                onClick={() => setIsCreateCalendarOpen(true)}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Create Calendar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="planting" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="planting">Planting Calendar</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="planting" className="space-y-6">
              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Planting Schedule</CardTitle>
                  <CardDescription>Optimal planting times for your crops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <h3 className="font-medium text-lg">Recommended Activities for {date ? format(date, 'MMMM d, yyyy') : 'Today'}</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-[#e6f0d8] rounded-md">
                            <div className="mt-0.5">
                              <Checkbox id="task-1" />
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor="task-1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Plant Corn
                              </label>
                              <p className="text-sm text-gray-600 mt-1">
                                Ideal time to plant corn in your region. Soil temperature should be above 50°F.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    toast({
                                      title: "Task Completed",
                                      description: "Corn planting has been marked as complete",
                                    })
                                  }}
                                >
                                  <Check className="h-3 w-3 mr-1" /> Complete
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-[#e6f0d8] rounded-md">
                            <div className="mt-0.5">
                              <Checkbox id="task-2" />
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor="task-2"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Prepare Soil for Tomatoes
                              </label>
                              <p className="text-sm text-gray-600 mt-1">
                                Add compost and till the soil in preparation for tomato planting next week.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    toast({
                                      title: "Task Completed",
                                      description: "Soil preparation has been marked as complete",
                                    })
                                  }}
                                >
                                  <Check className="h-3 w-3 mr-1" /> Complete
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-[#e6f0d8] rounded-md">
                            <div className="mt-0.5">
                              <Checkbox id="task-3" />
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor="task-3"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Apply Fertilizer to Wheat Fields
                              </label>
                              <p className="text-sm text-gray-600 mt-1">
                                Apply nitrogen-rich fertilizer to wheat fields for optimal growth.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    toast({
                                      title: "Task Completed",
                                      description: "Fertilizer application has been marked as complete",
                                    })
                                  }}
                                >
                                  <Check className="h-3 w-3 mr-1" /> Complete
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-[#d8e6c0]">
                  <CardHeader>
                    <CardTitle className="text-[#2c5d34]">Crop Planting Guide</CardTitle>
                    <CardDescription>Optimal planting windows for your region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-[#f0f7e6] rounded-md">
                        <div>
                          <h3 className="font-medium">Corn</h3>
                          <p className="text-sm text-gray-600">April 15 - May 30</p>
                        </div>
                        <div className="text-sm font-medium text-green-600">In Season</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#f0f7e6] rounded-md">
                        <div>
                          <h3 className="font-medium">Tomatoes</h3>
                          <p className="text-sm text-gray-600">May 1 - June 15</p>
                        </div>
                        <div className="text-sm font-medium text-green-600">In Season</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#f0f7e6] rounded-md">
                        <div>
                          <h3 className="font-medium">Wheat</h3>
                          <p className="text-sm text-gray-600">September 15 - October 30</p>
                        </div>
                        <div className="text-sm font-medium text-gray-600">Off Season</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#f0f7e6] rounded-md">
                        <div>
                          <h3 className="font-medium">Soybeans</h3>
                          <p className="text-sm text-gray-600">May 15 - June 30</p>
                        </div>
                        <div className="text-sm font-medium text-green-600">In Season</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#f0f7e6] rounded-md">
                        <div>
                          <h3 className="font-medium">Lettuce</h3>
                          <p className="text-sm text-gray-600">March 1 - April 30</p>
                        </div>
                        <div className="text-sm font-medium text-amber-600">Late Season</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0]">
                  <CardHeader>
                    <CardTitle className="text-[#2c5d34]">Weather Considerations</CardTitle>
                    <CardDescription>Weather factors affecting planting decisions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-[#f0f7e6] rounded-md">
                        <h3 className="font-medium">Soil Temperature</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Current: 58°F (Ideal for corn, tomatoes, and soybeans)
                        </p>
                      </div>
                      <div className="p-3 bg-[#f0f7e6] rounded-md">
                        <h3 className="font-medium">Precipitation Forecast</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Light rain expected in the next 3 days. Consider delaying planting until after rainfall.
                        </p>
                      </div>
                      <div className="p-3 bg-[#f0f7e6] rounded-md">
                        <h3 className="font-medium">Frost Risk</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Low risk of frost for the next 14 days. Safe for planting frost-sensitive crops.
                        </p>
                      </div>
                      <div className="p-3 bg-[#f0f7e6] rounded-md">
                        <h3 className="font-medium">Growing Degree Days</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Accumulated: 450 GDD (On track for normal growing season)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Upcoming Tasks</CardTitle>
                  <CardDescription>Tasks scheduled for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-[#f0f7e6] rounded-md">
                      <div className="mt-0.5">
                        <Checkbox id="upcoming-1" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="upcoming-1"
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Plant Corn in North Field
                          </label>
                          <span className="text-sm text-gray-500">Today</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Plant corn seeds at 1.5-inch depth with 6-inch spacing.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">High Priority</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              toast({
                                title: "Task Completed",
                                description: "Corn planting has been marked as complete",
                              })
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" /> Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-[#f0f7e6] rounded-md">
                      <div className="mt-0.5">
                        <Checkbox id="upcoming-2" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="upcoming-2"
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Irrigation System Maintenance
                          </label>
                          <span className="text-sm text-gray-500">Tomorrow</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Check and repair any leaks in the irrigation system.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Medium Priority</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              toast({
                                title: "Task Completed",
                                description: "Irrigation maintenance has been marked as complete",
                              })
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" /> Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-[#f0f7e6] rounded-md">
                      <div className="mt-0.5">
                        <Checkbox id="upcoming-3" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="upcoming-3"
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Apply Fertilizer to Tomato Beds
                          </label>
                          <span className="text-sm text-gray-500">May 18, 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Apply organic fertilizer to tomato beds before planting.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Low Priority</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              toast({
                                title: "Task Completed",
                                description: "Fertilizer application has been marked as complete",
                              })
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" /> Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-[#f0f7e6] rounded-md">
                      <div className="mt-0.5">
                        <Checkbox id="upcoming-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="upcoming-4"
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Tractor Maintenance
                          </label>
                          <span className="text-sm text-gray-500">May 20, 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Schedule regular maintenance for the tractor before heavy use season.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Medium Priority</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              toast({
                                title: "Task Completed",
                                description: "Tractor maintenance has been marked as complete",
                              })
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" /> Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]"
                    onClick={() => setIsAddTaskOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Completed Tasks</CardTitle>
                  <CardDescription>Recently completed farm tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-md opacity-70">
                      <div className="mt-0.5">
                        <Checkbox id="completed-1" checked disabled />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="completed-1"
                            className="font-medium leading-none line-through text-gray-500"
                          >
                            Soil Testing for South Field
                          </label>
                          <span className="text-sm text-gray-500">May 10, 2023</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-through">
                          Collect soil samples and send for laboratory analysis.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-md opacity-70">
                      <div className="mt-0.5">
                        <Checkbox id="completed-2" checked disabled />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="completed-2"
                            className="font-medium leading-none line-through text-gray-500"
                          >
                            Order Seeds for Summer Planting
                          </label>
                          <span className="text-sm text-gray-500">May 8, 2023</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-through">
                          Order tomato, cucumber, and pepper seeds from supplier.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-md opacity-70">
                      <div className="mt-0.5">
                        <Checkbox id="completed-3" checked disabled />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <label
                            htmlFor="completed-3"
                            className="font-medium leading-none line-through text-gray-500"
                          >
                            Repair Fence in North Pasture
                          </label>
                          <span className="text-sm text-gray-500">May 5, 2023</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-through">
                          Fix damaged sections of fence in the north pasture.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Monthly Schedule</CardTitle>
                  <CardDescription>Overview of activities for May 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-7 gap-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center font-medium text-sm py-2">
                          {day}
                        </div>
                      ))}
                      
                      {/* First week (empty days + days 1-6) */}
                      <div className="text-center py-2 text-gray-400"></div>
                      <div className="text-center py-2 text-gray-400"></div>
                      <div className="text-center py-2 text-gray-400"></div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">1</div>
                        <div className="text-xs bg-blue-100 text-blue-800 rounded p-1 mt-1">Soil Prep</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">2</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">3</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">4</div>
                      </div>
                      
                      {/* Second week (days 7-13) */}
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">5</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">6</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">7</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">8</div>
                        <div className="text-xs bg-green-100 text-green-800 rounded p-1 mt-1">Fertilize</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">9</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">10</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">11</div>
                      </div>
                      
                      {/* Third week (days 14-20) */}
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">12</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">13</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">14</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">15</div>
                        <div className="text-xs bg-red-100 text-red-800 rounded p-1 mt-1">Plant Corn</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">16</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">17</div>
                        <div className="text-xs bg-yellow-100 text-yellow-800 rounded p-1 mt-1">Maintenance</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">18</div>
                      </div>
                      
                      {/* Fourth week (days 21-27) */}
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">19</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">20</div>
                        <div className="text-xs bg-purple-100 text-purple-800 rounded p-1 mt-1">Tractor</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">21</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">22</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">23</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">24</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">25</div>
                      </div>
                      
                      {/* Fifth week (days 28-31) */}
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">26</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">27</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">28</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">29</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">30</div>
                      </div>
                      <div className="text-center py-2 h-24 border rounded-md p-1">
                        <div className="text-sm">31</div>
                      </div>
                      <div className="text-center py-2 text-gray-400"></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-[#d8e6c0]">Previous Month</Button>
                  <Button variant="outline" className="border-[#d8e6c0]">Next Month</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your farm calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input 
                id="task-title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="e.g., Plant Corn in North Field"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea 
                id="task-description" 
                value={newTask.description} 
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task details..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-date">Date</Label>
              <Input 
                id="task-date" 
                type="date" 
                value={newTask.date} 
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#2c5d34] hover:bg-[#1e3f24]"
              onClick={handleAddTask}
              disabled={!newTask.title || isLoading}
            >
              {isLoading ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Calendar Dialog */}
      <Dialog open={isCreateCalendarOpen} onOpenChange={setIsCreateCalendarOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Calendar</DialogTitle>
            <DialogDescription>
              Create a custom planting calendar for specific crops.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="calendar-name">Calendar Name</Label>
              <Input 
                id="calendar-name" 
                value={newCalendar.name} 
                onChange={(e) => setNewCalendar({...newCalendar, name: e.target.value})}
                placeholder="e.g., Summer Vegetables"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calendar-description">Description</Label>
              <Textarea 
                id="calendar-description" 
                value={newCalendar.description} 
                onChange={(e) => setNewCalendar({...newCalendar, description: e.target.value})}
                placeholder="Enter calendar details..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="crop-type">Crop Type</Label>
              <Select 
                value={newCalendar.cropType} 
                onValueChange={(value) => setNewCalendar({...newCalendar, cropType: value})}
              >
                <SelectTrigger id="crop-type">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input 
                  id="start-date" 
                  type="date" 
                  value={newCalendar.startDate} 
                  onChange={(e) => setNewCalendar({...newCalendar, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="date" 
                  value={newCalendar.endDate} 
                  onChange={(e) => setNewCalendar({...newCalendar, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCalendarOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#2c5d34] hover:bg-[#1e3f24]"
              onClick={handleCreateCalendar}
              disabled={!newCalendar.name || !newCalendar.cropType || isLoading}
            >
              {isLoading ? "Creating..." : "Create Calendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
      )
      }
