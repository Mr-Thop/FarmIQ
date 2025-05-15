import { apiClient } from "./api-client"

export type CartItem = {
  id: string
  name: string
  price: number
  unit: string
  farmName: string
  image: string
  quantity: number
}

export type CartSummary = {
  items: CartItem[]
  subtotal: number
}

export type OrderData = {
  shippingAddress: string
  paymentMethod: string
}

class CartService {
  async getCart(): Promise<CartSummary> {
    console.log("Fetching cart")
    try {
      const response = await apiClient.get<CartSummary>("/api/cart")
      return response.data || { items: [], subtotal: 0 }
    } catch (error) {
      console.error("Error fetching cart:", error)
      return { items: [], subtotal: 0 }
    }
  }

  async addToCart(productId: string, quantity: number): Promise<boolean> {
    console.log(`Adding product ${productId} to cart, quantity: ${quantity}`)
    try {
      const response = await apiClient.post("/api/cart", { productId, quantity })
      return response.status === 201
    } catch (error) {
      console.error("Error adding to cart:", error)
      return false
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<boolean> {
    console.log(`Updating cart item ${itemId}, quantity: ${quantity}`)
    try {
      const response = await apiClient.put(`/api/cart/${itemId}`, { quantity })
      return response.status === 200
    } catch (error) {
      console.error("Error updating cart item:", error)
      return false
    }
  }

  async removeCartItem(itemId: string): Promise<boolean> {
    console.log(`Removing item ${itemId} from cart`)
    try {
      const response = await apiClient.delete(`/api/cart/${itemId}`)
      return response.status === 200
    } catch (error) {
      console.error("Error removing cart item:", error)
      return false
    }
  }

  async createOrder(orderData: OrderData): Promise<{ orderId?: number; success: boolean }> {
    console.log("Creating order:", orderData)
    try {
      const response = await apiClient.post<{ message: string; order_id: number }>("/api/orders", orderData)
      if (response.status === 201 && response.data) {
        return {
          orderId: response.data.order_id,
          success: true,
        }
      }
      return { success: false }
    } catch (error) {
      console.error("Error creating order:", error)
      return { success: false }
    }
  }

  async getOrders(): Promise<any[]> {
    console.log("Fetching orders")
    try {
      const response = await apiClient.get<{ orders: any[] }>("/api/orders")
      return response.data?.orders || []
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  }

  async getOrder(orderId: number): Promise<any | null> {
    console.log(`Fetching order: ${orderId}`)
    try {
      const response = await apiClient.get<{ order: any }>(`/api/orders/${orderId}`)
      return response.data?.order || null
    } catch (error) {
      console.error("Error fetching order:", error)
      return null
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    console.log(`Cancelling order: ${orderId}`)
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/cancel`)
      return response.status === 200
    } catch (error) {
      console.error("Error cancelling order:", error)
      return false
    }
  }
}

export const cartService = new CartService()
