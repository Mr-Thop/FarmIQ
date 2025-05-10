"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Filter, ArrowUpDown, Star, MapPin, Package, Clock, Check, Bell } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { useCart } from "@/context/cart-context"

export default function CustomerDashboard() {
  const { addToCart } = useCart()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order #1082 has been shipped and is on its way.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "New Products Available",
      message: "Green Valley Farm has added new organic tomatoes to their inventory.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 3,
      title: "Weekly Farmers Market",
      message: "Don't miss the weekly farmers market this Saturday from 8am-2pm.",
      time: "2 days ago",
      read: true,
    },
  ])

  const [featuredFarms, setFeaturedFarms] = useState([
    {
      id: "farm1",
      name: "Green Valley Farm",
      image: "/placeholder.svg?height=100&width=100",
      distance: "5 miles",
      rating: 4.8,
      specialty: "Organic vegetables",
    },
    {
      id: "farm2",
      name: "Sunny Fields",
      image: "/placeholder.svg?height=100&width=100",
      distance: "3 miles",
      rating: 4.7,
      specialty: "Hydroponic lettuce",
    },
    {
      id: "farm4",
      name: "Happy Hens Farm",
      image: "/placeholder.svg?height=100&width=100",
      distance: "4 miles",
      rating: 5.0,
      specialty: "Free-range eggs",
    },
  ])

  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: "1",
      name: "Organic Tomatoes",
      price: 3.5,
      unit: "kg",
      farmId: "farm1",
      farmName: "Green Valley Farm",
      image: "/placeholder.svg?height=192&width=384",
      organic: true,
    },
    {
      id: "2",
      name: "Fresh Lettuce",
      price: 1.99,
      unit: "head",
      farmId: "farm2",
      farmName: "Sunny Fields",
      image: "/placeholder.svg?height=192&width=384",
      organic: false,
    },
    {
      id: "4",
      name: "Fresh Eggs",
      price: 4.5,
      unit: "dozen",
      farmId: "farm4",
      farmName: "Happy Hens Farm",
      image: "/placeholder.svg?height=192&width=384",
      organic: true,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Customer Dashboard</h1>
            <p className="text-gray-600">Welcome back, Sarah! Find fresh produce from local farmers.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Saved Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-gray-500 mt-1">Products in wishlist</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Local Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500 mt-1">Within 15 miles</p>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card className="border-[#d8e6c0] mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-[#2c5d34]">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-md border-l-4 ${
                      notification.read ? "border-gray-300 bg-gray-50" : "border-[#2c5d34] bg-[#e6f0d8]"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h3 className={`font-medium ${notification.read ? "text-gray-700" : "text-[#2c5d34]"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-[#d8e6c0] text-[#2c5d34]">
                View All Notifications
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products, farms, or locations..." className="pl-10 border-[#d8e6c0]" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#d8e6c0]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-[#d8e6c0]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <Tabs defaultValue="marketplace" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="farms">Local Farms</TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="border-[#d8e6c0] hover:shadow-md transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative h-48">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        {product.organic && (
                          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            Organic
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-[#2c5d34]">{product.name}</h3>
                        <p className="font-bold">
                          ${product.price}/{product.unit}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <Link href={`/farm/${product.farmId}`} className="hover:text-[#2c5d34] hover:underline">
                          {product.farmName}
                        </Link>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            unit: product.unit,
                            farmName: product.farmName,
                            image: product.image,
                            quantity: 1,
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                  <Link href="/market">View All Products</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Your Orders</h2>
              <div className="space-y-4">
                <Card className="border-[#d8e6c0] hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Order items"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Order #1082</h3>
                          <p className="text-sm text-gray-500">Placed on May 12, 2025</p>
                          <div className="flex items-center mt-1">
                            <Package className="h-3 w-3 mr-1 text-[#2c5d34]" />
                            <span className="text-sm text-[#2c5d34] font-medium">In Transit</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-bold">$24.50</p>
                        <p className="text-sm text-gray-500">3 items</p>
                        <Button variant="link" className="p-0 h-auto text-[#2c5d34]">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0] hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Order items"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Order #1075</h3>
                          <p className="text-sm text-gray-500">Placed on May 5, 2025</p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1 text-amber-500" />
                            <span className="text-sm text-amber-500 font-medium">Ready for Pickup</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-bold">$18.75</p>
                        <p className="text-sm text-gray-500">2 items</p>
                        <Button variant="link" className="p-0 h-auto text-[#2c5d34]">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#d8e6c0] hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Order items"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Order #1068</h3>
                          <p className="text-sm text-gray-500">Placed on April 28, 2025</p>
                          <div className="flex items-center mt-1">
                            <Check className="h-3 w-3 mr-1 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">Delivered</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-bold">$32.20</p>
                        <p className="text-sm text-gray-500">4 items</p>
                        <Button variant="link" className="p-0 h-auto text-[#2c5d34]">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline" className="border-[#d8e6c0] text-[#2c5d34]">
                  View Order History
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="farms" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Featured Farms</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredFarms.map((farm) => (
                  <Link key={farm.id} href={`/farm/${farm.id}`}>
                    <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow h-full">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                            <img
                              src={farm.image || "/placeholder.svg"}
                              alt={farm.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold text-[#2c5d34] mb-1">{farm.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{farm.distance}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            <span>{farm.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600">{farm.specialty}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">View Farm</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button asChild variant="outline" className="border-[#d8e6c0] text-[#2c5d34]">
                  <Link href="/customer/farms">View All Farms</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
