"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Bell, Lock, CreditCard, Languages, Save, Trash2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            message="You need to login as a farmer to access the Settings page."
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
            <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and farm settings</p>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center">
                <Languages className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Language</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal and farm details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Farmer" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.farmer@example.com" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Farm Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="farmName">Farm Name</Label>
                          <Input id="farmName" defaultValue="Green Valley Farm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="farmSize">Farm Size (acres)</Label>
                            <Input id="farmSize" type="number" defaultValue="120" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="farmType">Farm Type</Label>
                            <Select defaultValue="mixed">
                              <SelectTrigger id="farmType">
                                <SelectValue placeholder="Select farm type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="crop">Crop Farm</SelectItem>
                                <SelectItem value="livestock">Livestock Farm</SelectItem>
                                <SelectItem value="mixed">Mixed Farm</SelectItem>
                                <SelectItem value="organic">Organic Farm</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="farmAddress">Farm Address</Label>
                          <Input id="farmAddress" defaultValue="123 Rural Road, Farmville, CA 95432" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Receive updates via text message</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Receive updates on your device</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Weather Alerts</h3>
                            <p className="text-sm text-gray-500">Important weather changes affecting your farm</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Soil Analysis Results</h3>
                            <p className="text-sm text-gray-500">Notifications when soil test results are ready</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Planting Reminders</h3>
                            <p className="text-sm text-gray-500">Reminders about optimal planting times</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Market Updates</h3>
                            <p className="text-sm text-gray-500">Updates on market prices and trends</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">System Updates</h3>
                            <p className="text-sm text-gray-500">Information about FarmIQ updates and new features</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">
                      <Save className="h-4 w-4 mr-2" />
                      Save Notification Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>

                      <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]">Update Password</Button>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Session Management</h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Current Session</h4>
                              <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                              <p className="text-xs text-gray-400">Started: Today at 10:23 AM</p>
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                          </div>
                        </div>

                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          Sign Out of All Other Devices
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-red-200 rounded-md bg-red-50">
                          <h4 className="font-medium text-red-600">Delete Account</h4>
                          <p className="text-sm text-gray-700 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="destructive" className="bg-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Manage your subscription and payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-[#e6f0d8] rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-[#2c5d34]">Current Plan: Premium</h3>
                          <p className="text-sm text-gray-600">Your subscription renews on October 15, 2023</p>
                        </div>
                        <Button variant="outline" className="border-[#2c5d34] text-[#2c5d34]">
                          Change Plan
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Methods</h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-md mr-3">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">Visa ending in 4242</h4>
                                <p className="text-sm text-gray-500">Expires 12/2025</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline">Add Payment Method</Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium">Date</th>
                                <th className="text-left py-3 px-4 font-medium">Description</th>
                                <th className="text-left py-3 px-4 font-medium">Amount</th>
                                <th className="text-left py-3 px-4 font-medium">Status</th>
                                <th className="text-left py-3 px-4 font-medium">Invoice</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-3 px-4">Sep 15, 2023</td>
                                <td className="py-3 px-4">Premium Plan - Monthly</td>
                                <td className="py-3 px-4">$29.99</td>
                                <td className="py-3 px-4">
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Paid
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="sm">
                                    Download
                                  </Button>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-3 px-4">Aug 15, 2023</td>
                                <td className="py-3 px-4">Premium Plan - Monthly</td>
                                <td className="py-3 px-4">$29.99</td>
                                <td className="py-3 px-4">
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Paid
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="sm">
                                    Download
                                  </Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">Jul 15, 2023</td>
                                <td className="py-3 px-4">Premium Plan - Monthly</td>
                                <td className="py-3 px-4">$29.99</td>
                                <td className="py-3 px-4">
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Paid
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="sm">
                                    Download
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="language" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Regional Settings</CardTitle>
                    <CardDescription>Customize your language and regional preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="pt">Português</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="region">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="eu">European Union</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select defaultValue="pst">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                            <SelectItem value="mst">Mountain Time (MST/MDT)</SelectItem>
                            <SelectItem value="cst">Central Time (CST/CDT)</SelectItem>
                            <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger id="dateFormat">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="measurementSystem">Measurement System</Label>
                        <Select defaultValue="imperial">
                          <SelectTrigger id="measurementSystem">
                            <SelectValue placeholder="Select measurement system" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="imperial">Imperial (inches, feet, pounds)</SelectItem>
                            <SelectItem value="metric">Metric (centimeters, meters, kilograms)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">US Dollar ($)</SelectItem>
                            <SelectItem value="eur">Euro (€)</SelectItem>
                            <SelectItem value="gbp">British Pound (£)</SelectItem>
                            <SelectItem value="cad">Canadian Dollar (C$)</SelectItem>
                            <SelectItem value="aud">Australian Dollar (A$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">
                      <Save className="h-4 w-4 mr-2" />
                      Save Language & Regional Settings
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
