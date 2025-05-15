"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  User,
  Leaf,
  Home,
  ShoppingCartIcon,
  Package,
  Heart,
  MapPin,
  Sprout,
  Calendar,
  CloudRain,
  BarChart3,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { motion } from "framer-motion"
import LoginModal from "./login-modal"
import ShoppingCart from "./shopping-cart"
import { useAuth } from "@/context/auth-context"

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  // Determine if the user is a farmer or customer based on the URL or user role
  const isFarmer = user?.role === "farmer" || pathname.includes("/dashboard")
  const isCustomer = user?.role === "customer" || pathname.includes("/customer")

  // Get current page title for the dropdown
  const getCurrentPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/dashboard/soil-check") return "Soil Check"
    if (pathname === "/dashboard/leaf-disease") return "Leaf Disease"
    if (pathname === "/dashboard/calendar") return "Planting Calendar"
    if (pathname === "/dashboard/weather") return "Weather"
    if (pathname === "/dashboard/reports") return "Reports"
    if (pathname === "/customer") return "Dashboard"
    if (pathname === "/customer/orders") return "My Orders"
    if (pathname === "/customer/saved") return "Saved Items"
    if (pathname === "/customer/farms") return "Local Farms"
    return user?.name || "Account"
  }

  // Check if we're on a dashboard page
  const isOnDashboardPage = pathname.includes("/dashboard") || pathname.includes("/customer")

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-[#d8e6c0] bg-white/95 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Leaf className="h-6 w-6 text-[#2c5d34]" />
            </motion.div>
            <motion.span
              className="text-xl font-bold text-[#2c5d34]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              FARMIQ
            </motion.span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#2c5d34] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#2c5d34] transition-colors">
            About
          </Link>
          <Link href="/market" className="text-sm font-medium text-gray-700 hover:text-[#2c5d34] transition-colors">
            Market
          </Link>
          {isAuthenticated && (
            <Link
              href={user?.role === "farmer" ? "/dashboard" : "/customer"}
              className="text-sm font-medium text-gray-700 hover:text-[#2c5d34] transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ShoppingCart />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-[#2c5d34] hover:bg-[#e6f0d8] hover:text-[#2c5d34] transition-colors"
                >
                  {isOnDashboardPage ? (
                    <>
                      <span className="mr-1">{getCurrentPageTitle()}</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">{user?.name}</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isFarmer ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/soil-check" className="flex items-center cursor-pointer">
                        <Sprout className="mr-2 h-4 w-4" />
                        <span>Soil Check</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/leaf-disease" className="flex items-center cursor-pointer">
                        <Leaf className="mr-2 h-4 w-4" />
                        <span>Leaf Disease</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/market" className="flex items-center cursor-pointer">
                        <ShoppingCartIcon className="mr-2 h-4 w-4" />
                        <span>Market</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/calendar" className="flex items-center cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Planting Calendar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/weather" className="flex items-center cursor-pointer">
                        <CloudRain className="mr-2 h-4 w-4" />
                        <span>Weather</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/reports" className="flex items-center cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Reports</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/customer" className="flex items-center cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/market" className="flex items-center cursor-pointer">
                        <ShoppingCartIcon className="mr-2 h-4 w-4" />
                        <span>Marketplace</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/orders" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/saved" className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Saved Items</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/farms" className="flex items-center cursor-pointer">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Local Farms</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center cursor-pointer text-red-600" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-[#2c5d34] hover:bg-[#e6f0d8] hover:text-[#2c5d34]"
                onClick={() => setIsLoginOpen(true)}
              >
                <User className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-base font-medium text-gray-700 hover:text-[#2c5d34]">
                  Home
                </Link>
                <Link href="/about" className="text-base font-medium text-gray-700 hover:text-[#2c5d34]">
                  About
                </Link>
                <Link href="/market" className="text-base font-medium text-gray-700 hover:text-[#2c5d34]">
                  Market
                </Link>

                {isAuthenticated && (
                  <Link
                    href={user?.role === "farmer" ? "/dashboard" : "/customer"}
                    className="text-base font-medium text-gray-700 hover:text-[#2c5d34]"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Mobile dashboard menu items */}
                {isAuthenticated && isFarmer && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <Link
                      href="/dashboard/soil-check"
                      className="text-base font-medium text-gray-700 hover:text-[#2c5d34]"
                    >
                      Soil Check
                    </Link>
                    <Link
                      href="/dashboard/leaf-disease"
                      className="text-base font-medium text-gray-700 hover:text-[#2c5d34]"
                    >
                      Leaf Disease
                    </Link>
                    <Link
                      href="/dashboard/calendar"
                      className="text-base font-medium text-gray-700 hover:text-[#2c5d34]"
                    >
                      Planting Calendar
                    </Link>
                    <Link
                      href="/dashboard/weather"
                      className="text-base font-medium text-gray-700 hover:text-[#2c5d34]"
                    >
                      Weather
                    </Link>
                    <Link
                      href="/dashboard/reports"
                      className="text-base font-medium text-gray-700 hover:text-[#2c5d34]"
                    >
                      Reports
                    </Link>
                  </>
                )}

                {isAuthenticated && isCustomer && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <Link href="/customer/orders" className="text-base font-medium text-gray-700 hover:text-[#2c5d34]">
                      My Orders
                    </Link>
                    <Link href="/customer/saved" className="text-base font-medium text-gray-700 hover:text-[#2c5d34]">
                      Saved Items
                    </Link>
                    <Link href="/customer/farms" className="text-base font-medium text-gray-700 hover:text-[#2c5d34]">
                      Local Farms
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <button onClick={logout} className="text-base font-medium text-red-600 hover:text-red-800">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </motion.header>
  )
}
