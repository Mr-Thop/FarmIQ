"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, Package, Heart, User, LogOut, MapPin } from "lucide-react"

export default function CustomerSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-[#d8e6c0]">
        <SidebarHeader className="border-b border-[#d8e6c0]">
          <div className="flex items-center gap-2 px-4 py-2">
            <User className="h-8 w-8 rounded-full bg-[#e6f0d8] p-1.5 text-[#2c5d34]" />
            <div>
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-xs text-gray-500">Customer</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/customer")}>
                <Link href="/customer">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/market")}>
                <Link href="/market">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Marketplace</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/customer/orders")}>
                <Link href="/customer/orders">
                  <Package className="h-4 w-4" />
                  <span>My Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/customer/saved")}>
                <Link href="/customer/saved">
                  <Heart className="h-4 w-4" />
                  <span>Saved Items</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/customer/farms")}>
                <Link href="/customer/farms">
                  <MapPin className="h-4 w-4" />
                  <span>Local Farms</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-[#d8e6c0]">
          <div className="p-4">
            <Button variant="outline" className="w-full border-[#d8e6c0] text-[#2c5d34]">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
