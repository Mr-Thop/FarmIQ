"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, ArrowUpDown, Star, MapPin, Calendar, Heart } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import ProductFilters, { type FilterState } from "@/components/product-filters"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"
import { motion } from "framer-motion"
import { Analytics } from "@vercel/analytics/next"

// Sample product data
const products = [
  {
    id: "1",
    name: "Organic Tomatoes",
    price: 3.5,
    unit: "kg",
    farmId: "farm1",
    farmName: "Green Valley Farm",
    distance: 5,
    rating: 4.8,
    reviews: 24,
    description: "Vine-ripened organic tomatoes, freshly harvested. Perfect for salads and cooking.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "available-now",
    category: "vegetables",
    organic: true,
  },
  {
    id: "2",
    name: "Fresh Lettuce",
    price: 1.99,
    unit: "head",
    farmId: "farm2",
    farmName: "Sunny Fields",
    distance: 3,
    rating: 4.7,
    reviews: 18,
    description: "Crisp, hydroponic lettuce grown without pesticides. Harvested daily for maximum freshness.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "available-now",
    category: "vegetables",
    organic: true,
  },
  {
    id: "3",
    name: "Sweet Corn",
    price: 2.75,
    unit: "dozen",
    farmId: "farm3",
    farmName: "Harvest Hills",
    distance: 8,
    rating: 4.9,
    reviews: 32,
    description: "Sweet, non-GMO corn. Reserve now for the upcoming harvest.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "pre-order",
    availableDate: "July 10",
    category: "vegetables",
    organic: false,
  },
  {
    id: "4",
    name: "Fresh Eggs",
    price: 4.5,
    unit: "dozen",
    farmId: "farm4",
    farmName: "Happy Hens Farm",
    distance: 4,
    rating: 5.0,
    reviews: 41,
    description: "Free-range, organic eggs from pasture-raised hens. Collected daily.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "available-now",
    category: "dairy",
    organic: true,
  },
  {
    id: "5",
    name: "Raw Honey",
    price: 8.99,
    unit: "jar",
    farmId: "farm5",
    farmName: "Bee Haven",
    distance: 7,
    rating: 4.9,
    reviews: 27,
    description: "Pure, unfiltered honey from local wildflower meadows. 16oz jar.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "available-now",
    category: "honey",
    organic: true,
  },
  {
    id: "6",
    name: "Organic Apples",
    price: 2.25,
    unit: "lb",
    farmId: "farm6",
    farmName: "Orchard Valley",
    distance: 10,
    rating: 4.8,
    reviews: 19,
    description: "Crisp, organic apples. Multiple varieties available. Reserve your bushel now.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "pre-order",
    availableDate: "September 5",
    category: "fruits",
    organic: true,
  },
  {
    id: "7",
    name: "Grass-Fed Beef",
    price: 12.99,
    unit: "lb",
    farmId: "farm7",
    farmName: "Green Pastures",
    distance: 12,
    rating: 4.9,
    reviews: 36,
    description: "Locally raised, grass-fed beef. No hormones or antibiotics.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "available-now",
    category: "meat",
    organic: true,
  },
  {
    id: "8",
    name: "Fresh Herbs Bundle",
    price: 3.99,
    unit: "bundle",
    farmId: "farm2",
    farmName: "Sunny Fields",
    distance: 3,
    rating: 4.6,
    reviews: 14,
    description: "Assorted fresh herbs including basil, rosemary, thyme, and mint.",
    image: "/placeholder.svg?height=192&width=384",
    availability: "available-now",
    category: "herbs",
    organic: false,
  },
]

export default function MarketPage() {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("buy")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50],
    distance: 25,
    availability: "all",
    organic: false,
    sortBy: "relevance",
  })
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Apply filters to products
  const applyFilters = () => {
    let result = [...products]

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.farmName.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term),
      )
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    // Apply price range filter
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Apply distance filter
    result = result.filter((product) => product.distance <= filters.distance)

    // Apply availability filter
    if (filters.availability !== "all") {
      result = result.filter((product) => product.availability === filters.availability)
    }

    // Apply organic filter
    if (filters.organic) {
      result = result.filter((product) => product.organic)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "distance":
        result.sort((a, b) => a.distance - b.distance)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // relevance - keep original order
        break
    }

    setFilteredProducts(result)
  }

  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50],
      distance: 25,
      availability: "all",
      organic: false,
      sortBy: "relevance",
    })
    setSearchTerm("")
  }

  // Apply filters when filters or search term changes
  useEffect(() => {
    applyFilters()
  }, [searchTerm])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle add to cart with authentication check
  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

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

  // Handle save item with authentication check
  const handleSaveItem = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    // Save item functionality would go here
  }

  // Handle sell tab click with authentication check
  const handleSellTabClick = (value: string) => {
    if (value === "sell" && !isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setActiveTab(value)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />
      <Analytics/>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#2c5d34] mb-2">Preharvest Market</h1>
              <p className="text-gray-600">Connect directly with farmers and buyers in your area</p>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products, farms, or locations..."
                  className="pl-10 border-[#d8e6c0]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="md:hidden border-[#d8e6c0]" onClick={() => applyFilters()}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <Tabs defaultValue="buy" value={activeTab} onValueChange={handleSellTabClick} className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="buy">Buy Products</TabsTrigger>
              <TabsTrigger value="sell">Sell Products</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Filters sidebar */}
                <ProductFilters
                  filters={filters}
                  setFilters={setFilters}
                  applyFilters={applyFilters}
                  resetFilters={resetFilters}
                  className="w-full md:w-64 lg:w-72 flex-shrink-0"
                />

                {/* Product grid */}
                <div className="flex-1">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                      <Button variant="outline" onClick={resetFilters} className="border-[#d8e6c0] text-[#2c5d34]">
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">
                          Showing <span className="font-medium">{filteredProducts.length}</span> products
                        </p>
                        <div className="flex items-center gap-2">
                          {filters.categories.length > 0 && (
                            <Badge variant="outline" className="bg-[#e6f0d8] border-[#d8e6c0] text-[#2c5d34]">
                              {filters.categories.length} categories
                            </Badge>
                          )}
                          {filters.organic && (
                            <Badge variant="outline" className="bg-[#e6f0d8] border-[#d8e6c0] text-[#2c5d34]">
                              Organic
                            </Badge>
                          )}
                          {filters.availability !== "all" && (
                            <Badge variant="outline" className="bg-[#e6f0d8] border-[#d8e6c0] text-[#2c5d34]">
                              {filters.availability === "available-now" ? "Available Now" : "Pre-order"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -5 }}
                          >
                            <Card className="border-[#d8e6c0] hover:shadow-md transition-shadow h-full">
                              <CardHeader className="p-0">
                                <div className="relative h-48">
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-t-lg"
                                  />
                                  <div
                                    className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                                      product.availability === "available-now" ? "bg-[#2c5d34]" : "bg-amber-500"
                                    }`}
                                  >
                                    {product.availability === "available-now" ? "Available Now" : "Pre-order"}
                                  </div>
                                  {product.organic && (
                                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                      Organic
                                    </div>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-[#2c5d34] rounded-full h-8 w-8"
                                    onClick={handleSaveItem}
                                  >
                                    <Heart className="h-4 w-4" />
                                    <span className="sr-only">Save {product.name}</span>
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Link
                                    href={`/farm/${product.farmId}`}
                                    className="font-semibold text-[#2c5d34] hover:underline"
                                  >
                                    {product.name}
                                  </Link>
                                  <p className="font-bold">
                                    ${product.price}/{product.unit}
                                  </p>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <Link
                                    href={`/farm/${product.farmId}`}
                                    className="hover:text-[#2c5d34] hover:underline"
                                  >
                                    {product.farmName} ({product.distance} miles)
                                  </Link>
                                </div>
                                {product.availability === "pre-order" && product.availableDate && (
                                  <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Available: {product.availableDate}</span>
                                  </div>
                                )}
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                  <span>
                                    {product.rating} ({product.reviews} reviews)
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <Button
                                  className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {product.availability === "available-now" ? "Add to Cart" : "Pre-order"}
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sell" className="space-y-6">
              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">List Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Button className="w-full h-32 bg-[#2c5d34] hover:bg-[#1e3f24]">Add New Listing</Button>
                    </div>
                    <div>
                      <Button className="w-full h-32 bg-[#2c5d34] hover:bg-[#1e3f24]">Manage Existing Listings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Your Active Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start p-4 border border-[#d8e6c0] rounded-md hover:bg-[#f0f5e8] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden">
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Organic Tomatoes"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Organic Tomatoes</h3>
                          <p className="text-sm text-gray-500">Available: Now</p>
                          <p className="text-sm text-gray-500">Quantity: 50kg</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <p className="font-bold">$3.50/kg</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="border-[#d8e6c0] text-[#2c5d34]">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-[#d8e6c0] text-red-600">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start p-4 border border-[#d8e6c0] rounded-md hover:bg-[#f0f5e8] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden">
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Sweet Corn"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Sweet Corn</h3>
                          <p className="text-sm text-gray-500">Available: July 10</p>
                          <p className="text-sm text-gray-500">Quantity: 200 dozen</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <p className="font-bold">$2.75/dozen</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="border-[#d8e6c0] text-[#2c5d34]">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-[#d8e6c0] text-red-600">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start p-4 border border-[#d8e6c0] rounded-md hover:bg-[#f0f5e8] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden">
                          <img
                            src="/placeholder.svg?height=64&width=64"
                            alt="Fresh Lettuce"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Fresh Lettuce</h3>
                          <p className="text-sm text-gray-500">Available: Now</p>
                          <p className="text-sm text-gray-500">Quantity: 75 heads</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <p className="font-bold">$1.99/head</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="border-[#d8e6c0] text-[#2c5d34]">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-[#d8e6c0] text-red-600">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <Chatbot />

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="You need to login to access this feature. Would you like to login now?"
      />
    </div>
  )
}
