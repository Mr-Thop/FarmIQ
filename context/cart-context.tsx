"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cartService } from "@/lib/cart-service"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

export type CartItem = {
  id: string
  name: string
  price: number
  unit: string
  farmName: string
  image: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (item: Omit<CartItem, "id"> & { id: string }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  // Calculate derived values
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Load cart from API if authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const cartData = await cartService.getCart()
          if (cartData && cartData.items) {
            setItems(cartData.items)
            console.log("Cart loaded from API:", cartData.items.length, "items")
          }
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      }
    }

    loadCart()
  }, [isAuthenticated])

  const addToCart = async (newItem: Omit<CartItem, "id"> & { id: string }) => {
    console.log("Adding item to cart:", newItem)

    // Optimistic update
    const existingItemIndex = items.findIndex((item) => item.id === newItem.id)

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const updatedItems = [...items]
      updatedItems[existingItemIndex].quantity += newItem.quantity
      setItems(updatedItems)
    } else {
      // New item
      setItems((prevItems) => [...prevItems, { ...newItem }])
    }

    // Update server if authenticated
    if (isAuthenticated) {
      try {
        await cartService.addToCart(newItem.id, newItem.quantity)
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast({
          title: "Error",
          description: "Could not add item to cart",
          variant: "destructive",
        })
      }
    }

    toast({
      title: "Added to cart",
      description: `${newItem.name} added to your cart`,
    })

    // Open cart drawer
    setIsCartOpen(true)
  }

  const removeFromCart = async (id: string) => {
    console.log("Removing item from cart:", id)

    // Optimistic update
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))

    // Update server if authenticated
    if (isAuthenticated) {
      try {
        await cartService.removeCartItem(id)
      } catch (error) {
        console.error("Error removing from cart:", error)
        toast({
          title: "Error",
          description: "Could not remove item from cart",
          variant: "destructive",
        })
      }
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    console.log(`Updating item ${id} quantity to ${quantity}`)

    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    // Optimistic update
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))

    // Update server if authenticated
    if (isAuthenticated) {
      try {
        await cartService.updateCartItem(id, quantity)
      } catch (error) {
        console.error("Error updating cart:", error)
        toast({
          title: "Error",
          description: "Could not update item quantity",
          variant: "destructive",
        })
      }
    }
  }

  const clearCart = () => {
    console.log("Clearing cart")
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
