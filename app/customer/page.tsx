"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Search,
  Filter,
  ArrowUpDown,
  Star,
  MapPin,
  Package,
  Clock,
  Check,
  Bell,
  Heart,
  Bookmark,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { farmService, type Farm } from "@/lib/farm-service"
import { productService, type Product } from "@/lib/product-service"
import { notificationService, type Notification } from "@/lib/notification-service"
import { customerService } from "@/lib/customer-service"
import { useToast } from "@/components/ui/use-toast"

export default function CustomerDashboard() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  // State for data
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [featuredFarms, setFeaturedFarms] = useState<Farm[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [savedItems, setSavedItems] = useState<Product[]>([])
  const [localFarms, setLocalFarms] = useState<Farm[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true)

      // Check if user is authenticated before making API calls
      if (!user || !localStorage.getItem("farmiq-token")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your dashboard",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      try {
        // Fetch notifications
        const notificationsData = await notificationService.getNotifications()
        if (notificationsData) {
          setNotifications(notificationsData)
          console.log("Notifications loaded:", notificationsData)
        }

        // Fetch featured farms
        const farmsData = await farmService.getFarms({ distance: 15 })
        if (farmsData) {
          setFeaturedFarms(farmsData.slice(0, 3)) // Take first 3 farms
          console.log("Featured farms loaded:", farmsData.slice(0, 3))
        }

        // Fetch featured products
        const productsData = await productService.getProducts({ featured: true })
        if (productsData) {
          setFeaturedProducts(productsData.slice(0, 3)) // Take first 3 products
          console.log("Featured products loaded:", productsData.slice(0, 3))
        }

        // Fetch saved items
        const savedItemsData = await customerService.getSavedItems()
        if (savedItemsData) {
          setSavedItems(savedItemsData)
          console.log("Saved items loaded:", savedItemsData)
        }

        // Fetch local farms
        const localFarmsData = await farmService.getFarms({ distance: 5 })
        if (localFarmsData) {
          setLocalFarms(localFarmsData)
          console.log("Local farms loaded:", localFarmsData)
        }

        // Fetch orders using the cart service
        const ordersData = await customerService.getOrders()
        if (ordersData) {
          setOrders(ordersData)
          console.log("Orders loaded:", ordersData)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)

        // Check if the error is related to authentication
        if (error.message?.includes("Token is missing") || error.message?.includes("Unauthorized")) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          })
          // Clear invalid token
          localStorage.removeItem("farmiq-token")
        } else {
          toast({
            title: "Error",
            description: "Failed to load dashboard data. Please try again later.",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [toast, user])

  // Handle marking notification as read
  const markAsRead = async (id: number) => {
    try {
      const success = await notificationService.markAsRead(id)
      if (success) {
        // Update local state to reflect the change
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        )
        console.log(`Notification ${id} marked as read`)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  // Handle saving an item
  const handleSaveItem = async (productId: string) => {
    try {
      await customerService.saveItem(productId)
      toast({
        title: "Success",
        description: "Item saved to wishlist",
      })

      // Refresh saved items
      const savedItemsData = await customerService.getSavedItems()
      if (savedItemsData) {
        setSavedItems(savedItemsData)
      }
    } catch (error) {
      console.error("Error saving item:", error)
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      })
    }
  }

  // Handle removing a saved item
  const handleRemoveSavedItem = async (productId: string) => {
    try {
      await customerService.removeSavedItem(productId)
      setSavedItems(savedItems.filter((item) => item.id !== productId))
      toast({
        title: "Success",
        description: "Item removed from wishlist",
      })
    } catch (error) {
      console.error("Error removing saved item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
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
            <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Customer Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || "Customer"}! Find fresh produce from local farmers.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : orders.filter((o) => o.status !== "delivered").length}
                </div>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Saved Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : savedItems.length}</div>
                <p className="text-xs text-gray-500 mt-1">Products in wishlist</p>
              </CardContent>
            </Card>

            <Card className="border-[#d8e6c0] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Local Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : localFarms.length}</div>
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
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-md border-l-4 cursor-pointer ${
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
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No notifications at this time</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#d8e6c0] text-[#2c5d34]"
                onClick={async () => {
                  try {
                    await notificationService.markAllAsRead()
                    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
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
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="farms">Local Farms</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Featured Products</h2>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading products...</div>
              ) : featuredProducts.length > 0 ? (
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
                      <CardFooter className="pt-0 flex gap-2">
                        <Button
                          className="flex-1 bg-[#2c5d34] hover:bg-[#1e3f24]"
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-[#d8e6c0]"
                          onClick={() => handleSaveItem(product.id)}
                        >
                          <Heart className="h-4 w-4 text-[#2c5d34]" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No products available</div>
              )}

              <div className="flex justify-center mt-6">
                <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                  <Link href="/market">View All Products</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Your Orders</h2>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <Card key={index} className="border-[#d8e6c0] hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={order.image_url || "/placeholder.svg?height=64&width=64"}
                                alt="Order items"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </p>
                              <div className="flex items-center mt-1">
                                {order.status === "in_transit" && (
                                  <>
                                    <Package className="h-3 w-3 mr-1 text-[#2c5d34]" />
                                    <span className="text-sm text-[#2c5d34] font-medium">In Transit</span>
                                  </>
                                )}
                                {order.status === "ready_for_pickup" && (
                                  <>
                                    <Clock className="h-3 w-3 mr-1 text-amber-500" />
                                    <span className="text-sm text-amber-500 font-medium">Ready for Pickup</span>
                                  </>
                                )}
                                {order.status === "delivered" && (
                                  <>
                                    <Check className="h-3 w-3 mr-1 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">Delivered</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end">
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{order.items.length} items</p>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-[#2c5d34]"
                              onClick={() => {
                                // In a complete implementation, this would navigate to an order details page
                                // router.push(`/customer/orders/${order.id}`);
                                toast({
                                  title: "Order Details",
                                  description: `Viewing details for Order #${order.id}.`,
                                })
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No orders found</div>
              )}

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="border-[#d8e6c0] text-[#2c5d34]"
                  onClick={() => {
                    // In a complete implementation, this would navigate to the order history page
                    // router.push('/customer/orders');
                    window.location.href = "/customer/orders"
                  }}
                >
                  View Order History
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="farms" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Featured Farms</h2>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading farms...</div>
              ) : featuredFarms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredFarms.map((farm) => (
                    <Link key={farm.id} href={`/farm/${farm.id}`}>
                      <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow h-full">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                              <img
                                src={farm.image_url || "/placeholder.svg"}
                                alt={farm.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold text-[#2c5d34] mb-1">{farm.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{farm.distance || "Nearby"}</span>
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
              ) : (
                <div className="text-center py-8 text-gray-500">No farms available</div>
              )}

              <div className="flex justify-center mt-6">
                <Button asChild variant="outline" className="border-[#d8e6c0] text-[#2c5d34]">
                  <Link href="/customer/farms">View All Farms</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2c5d34] mb-4">Saved Items</h2>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading saved items...</div>
              ) : savedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {savedItems.map((product) => (
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
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 bg-white border-[#d8e6c0]"
                            onClick={() => handleRemoveSavedItem(product.id)}
                          >
                            <Bookmark className="h-4 w-4 text-[#2c5d34] fill-[#2c5d34]" />
                          </Button>
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
              ) : (
                <div className="text-center py-8 text-gray-500">No saved items found</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
