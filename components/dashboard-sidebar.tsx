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
import { BarChart3, Calendar, CloudRain, Home, Leaf, LogOut, Settings, ShoppingCart, Sprout, User } from "lucide-react"

export default function DashboardSidebar() {
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
              <p className="font-medium">John Farmer</p>
              <p className="text-xs text-gray-500">Green Valley Farm</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/soil-check")}>
                <Link href="/dashboard/soil-check">
                  <Sprout className="h-4 w-4" />
                  <span>Soil Check</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/leaf-disease")}>
                <Link href="/dashboard/leaf-disease">
                  <Leaf className="h-4 w-4" />
                  <span>Leaf Disease</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/market")}>
                <Link href="/market">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Market</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/calendar")}>
                <Link href="/dashboard/calendar">
                  <Calendar className="h-4 w-4" />
                  <span>Planting Calendar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/weather")}>
                <Link href="/dashboard/weather">
                  <CloudRain className="h-4 w-4" />
                  <span>Weather</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/reports")}>
                <Link href="/dashboard/reports">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
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
