"use client"

import { useState, useEffect } from "react"
import { Package, Loader2, Truck, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { cartService } from "@/lib/cart-service"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Order status types
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

// Order interface
interface Order {
  id: string
  date: string
  total: number
  status: OrderStatus
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image?: string
  }[]
  farmName: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // Use the real API call from cartService
        const data = await cartService.getOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated, toast])

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["pending", "processing", "shipped"].includes(order.status)
    if (activeTab === "completed") return order.status === "delivered"
    if (activeTab === "cancelled") return order.status === "cancelled"
    return true
  })

  // Get status badge color
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "shipped":
        return <Badge className="bg-indigo-500">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-indigo-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <Clock className="h-5 w-5 text-red-500" />
    }
  }

  // Handle cancel order
  const handleCancelOrder = async (orderId: string) => {
    try {
      // This would be a real API call in a complete implementation
      // await cartService.cancelOrder(orderId);

      // For now, update the UI optimistically
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" as OrderStatus } : order)),
      )

      toast({
        title: "Order Cancelled",
        description: `Order #${orderId} has been cancelled.`,
      })
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle view order details
  const handleViewOrderDetails = (orderId: string) => {
    // In a complete implementation, this would navigate to an order details page
    // router.push(`/customer/orders/${orderId}`);

    toast({
      title: "Order Details",
      description: `Viewing details for Order #${orderId}.`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />
      <main className="flex-1 p-6 container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2c5d34]">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#2c5d34]" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3e24]">
                  <a href="/market">Browse Marketplace</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="border-[#d8e6c0]">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col md:flex-row justify-between items-start">
                        <div>
                          <CardTitle className="text-[#2c5d34]">Order #{order.id}</CardTitle>
                          <p className="text-sm text-gray-500">Placed on {order.date}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start border-b border-[#d8e6c0] pb-4">
                          <div>
                            <p className="font-medium">Farm: {order.farmName}</p>
                            {order.trackingNumber && (
                              <p className="text-sm text-gray-500">
                                Tracking: <span className="font-medium">{order.trackingNumber}</span>
                              </p>
                            )}
                            {order.estimatedDelivery && (
                              <p className="text-sm text-gray-500">
                                Estimated Delivery: <span className="font-medium">{order.estimatedDelivery}</span>
                              </p>
                            )}
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{order.items.length} items</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-[#e6f0d8]">
                                    <Package className="h-8 w-8 text-[#2c5d34]" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          {["pending", "processing"].includes(order.status) && (
                            <Button
                              variant="outline"
                              className="border-[#d8e6c0] text-red-600"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel Order
                            </Button>
                          )}
                          <Button
                            className="bg-[#2c5d34] hover:bg-[#1e3e24]"
                            onClick={() => handleViewOrderDetails(order.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
