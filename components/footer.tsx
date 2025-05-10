"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Leaf, Facebook, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()

  // Determine if the user is a farmer or customer based on the URL
  const isFarmer = pathname.includes("/dashboard")
  const isCustomer = pathname.includes("/customer") || pathname.includes("/market")

  return (
    <footer className="bg-[#2c5d34] text-white">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">FARMIQ</span>
            </div>
            <p className="text-[#d8e6c0] max-w-xs">
              {isFarmer
                ? "Empowering farmers with intelligent tools for better crop management and market access."
                : "Connecting customers with local farmers for fresh, quality produce direct from the source."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#d8e6c0] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              {isFarmer ? (
                <>
                  <li>
                    <Link href="/dashboard" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/market" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Market
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/customer" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/market" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Marketplace
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/about" className="text-[#d8e6c0] hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{isFarmer ? "Features" : "Services"}</h3>
            <ul className="space-y-2">
              {isFarmer ? (
                <>
                  <li>
                    <Link href="/dashboard/soil-check" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Soil Check
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/leaf-disease" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Leaf Disease Detection
                    </Link>
                  </li>
                  <li>
                    <Link href="/market" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Preharvest Market
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/reports" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Farm Reports
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/market" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Browse Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/customer/orders" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Track Orders
                    </Link>
                  </li>
                  <li>
                    <Link href="/customer/farms" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Find Local Farms
                    </Link>
                  </li>
                  <li>
                    <Link href="/customer/saved" className="text-[#d8e6c0] hover:text-white transition-colors">
                      Saved Items
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@farmiq.com" className="text-[#d8e6c0] hover:text-white transition-colors">
                  info@farmiq.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <a href="#" className="text-[#d8e6c0] hover:text-white transition-colors">
                  FarmIQ
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <a href="#" className="text-[#d8e6c0] hover:text-white transition-colors">
                  @FarmIQ
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <a href="#" className="text-[#d8e6c0] hover:text-white transition-colors">
                  @FarmIQ_Official
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#4a7951] pt-6 text-center text-[#d8e6c0]">
          <p>© {new Date().getFullYear()} FarmIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
