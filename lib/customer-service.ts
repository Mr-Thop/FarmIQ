import { apiClient } from "./api-client"

// Customer service functions
export const customerService = {
  // Get customer orders
  getOrders: async () => {
    try {
      const response = await apiClient.get("/api/customer/orders")
      return response.data
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  },

  // Save an item (product, farm, etc.)
  saveItem: async (itemId: string) => {
    try {
      const response = await apiClient.post("/api/customer/saved-items", { item_id: itemId, item_type: "product" })
      return response.data
    } catch (error) {
      console.error("Error saving item:", error)
      throw error
    }
  },

  // Get saved items
  getSavedItems: async () => {
    try {
      const response = await apiClient.get("/api/customer/saved-items")
      return response.data
    } catch (error) {
      console.error("Error fetching saved items:", error)
      throw error
    }
  },

  // Remove a saved item
  removeSavedItem: async (itemId: string) => {
    try {
      const response = await apiClient.delete(`/api/customer/saved-items/${itemId}`)
      return response.data
    } catch (error) {
      console.error("Error removing saved item:", error)
      throw error
    }
  },

  // Get customer profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/customer/profile")
      return response.data
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error
    }
  },

  // Update customer profile
  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put("/api/customer/profile", data)
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  // Cancel an order
  cancelOrder: async (orderId: string) => {
    try {
      const response = await apiClient.post(`/api/customer/orders/${orderId}/cancel`)
      return response.data
    } catch (error) {
      console.error("Error cancelling order:", error)
      throw error
    }
  },

  // Get order details
  getOrderDetails: async (orderId: string) => {
    try {
      const response = await apiClient.get(`/api/customer/orders/${orderId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching order details:", error)
      throw error
    }
  },
}

export const getCustomerSavedItems = async () => {
  try {
    const response = await apiClient.get("/api/customer/saved-items")
    return response.data
  } catch (error) {
    console.error("Error fetching saved items:", error)
    return []
  }
}

export const toggleSaveProduct = async (productId: string) => {
  try {
    const response = await apiClient.post("/api/customer/toggle-save", { productId })
    return response.data
  } catch (error) {
    console.error("Error toggling save product:", error)
    throw error
  }
}
