"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingCartIcon as CartIcon, Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCart, type CartItem } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"

export default function ShoppingCart() {
  const { items, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, totalItems, subtotal } =
    useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)
      setIsCartOpen(false)
    }, 2000)
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-[#d8e6c0] text-[#2c5d34]"
          aria-label="Shopping Cart"
        >
          <CartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#2c5d34] text-white"
              variant="default"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-[#2c5d34] flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Your Cart
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Your cart is empty"
              : `You have ${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <CartIcon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3f24]">
              <Link href="/market" onClick={() => setIsCartOpen(false)}>
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Separator className="mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <div className="grid w-full gap-2">
                  <Button
                    className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#d8e6c0] text-[#2c5d34]"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CartItemCard({
  item,
  removeFromCart,
  updateQuantity,
}: {
  item: CartItem
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
}) {
  return (
    <div className="flex gap-4 p-3 border border-[#d8e6c0] rounded-lg">
      <div className="h-20 w-20 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-[#2c5d34]">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.farmName}</p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center border border-[#d8e6c0] rounded-md">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-7 w-7 flex items-center justify-center text-gray-500 hover:text-[#2c5d34]"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-7 w-7 flex items-center justify-center text-gray-500 hover:text-[#2c5d34]"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="text-right">
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              ${item.price.toFixed(2)}/{item.unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
