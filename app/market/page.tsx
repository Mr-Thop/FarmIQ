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
import { productService, type Product } from "@/lib/product-service"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MarketPage() {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("buy")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50],
    distance: 25,
    availability: "all",
    organic: false,
    sortBy: "relevance",
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [userProducts, setUserProducts] = useState<Product[]>([])
  const [isLoadingUserProducts, setIsLoadingUserProducts] = useState(false)

  // New listing dialog state
  const [showNewListingDialog, setShowNewListingDialog] = useState(false)
  const [newListing, setNewListing] = useState({
    name: "",
    price: "",
    unit: "kg",
    category: "",
    description: "",
    available: "now",
    organic: false,
    quantity: "",
  })

  // Manage listings dialog state
  const [showManageListingsDialog, setShowManageListingsDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editMode, setEditMode] = useState(false)

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const productsData = await productService.getProducts()
        console.log("Products loaded:", productsData.length)
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error("Error loading products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  // Load user's products if authenticated and on sell tab
  useEffect(() => {
    const loadUserProducts = async () => {
      if (!isAuthenticated || activeTab !== "sell") return

      setIsLoadingUserProducts(true)
      try {
        // In a real app, we'd fetch the user's products
        // For now, we'll use the first 3 products as a demo
        const userProds = products.slice(0, 3).map((p) => ({
          ...p,
          quantity: Math.floor(Math.random() * 100) + 10,
        }))
        setUserProducts(userProds)
      } catch (error) {
        console.error("Error loading user products:", error)
        toast({
          title: "Error",
          description: "Failed to load your products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingUserProducts(false)
      }
    }

    loadUserProducts()
  }, [isAuthenticated, activeTab, products, toast])

  // Apply filters to products
  const applyFilters = () => {
    console.log("Applying filters:", filters)

    let result = [...products]

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          (product.farmName && product.farmName.toLowerCase().includes(term)) ||
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
    if (typeof filters.distance === "number") {
      result = result.filter((product) => {
        // If product doesn't have distance, assume it's within range
        if (typeof product.distance !== "number") return true
        return product.distance <= filters.distance
      })
    }

    // Apply availability filter
    if (filters.availability !== "all") {
      result = result.filter((product) => {
        // Map availability strings
        const productAvailability = product.available ? "available-now" : "pre-order"
        return productAvailability === filters.availability
      })
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
        result.sort((a, b) => {
          const distA = typeof a.distance === "number" ? a.distance : Number.POSITIVE_INFINITY
          const distB = typeof b.distance === "number" ? b.distance : Number.POSITIVE_INFINITY
          return distA - distB
        })
        break
      case "rating":
        result.sort((a, b) => {
          const ratingA = typeof a.rating === "number" ? a.rating : 0
          const ratingB = typeof b.rating === "number" ? b.rating : 0
          return ratingB - ratingA
        })
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
    setFilteredProducts(products)
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
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      farmName: product.farmName || `Farm #${product.farm_id}`,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // Handle save item with authentication check
  const handleSaveItem = (product: Product) => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    toast({
      title: "Item saved",
      description: `${product.name} has been saved to your favorites.`,
    })
  }

  // Handle sell tab click with authentication check
  const handleSellTabClick = (value: string) => {
    if (value === "sell" && !isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setActiveTab(value)
  }

  // Handle add new listing
  const handleAddNewListing = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setShowNewListingDialog(true)
  }

  // Handle submit new listing
  const handleSubmitNewListing = () => {
    // Validate form
    if (
      !newListing.name ||
      !newListing.price ||
      !newListing.category ||
      !newListing.description ||
      !newListing.quantity
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would submit to the API
    // For now, just add to the user's products
    const newProduct = {
      id: `new-${Date.now()}`,
      name: newListing.name,
      price: Number.parseFloat(newListing.price),
      unit: newListing.unit,
      category: newListing.category,
      description: newListing.description,
      available: newListing.available === "now",
      organic: newListing.organic,
      farm_id: "1",
      farmName: "Your Farm",
      image: "/placeholder.svg?height=200&width=300",
      quantity: Number.parseInt(newListing.quantity),
      availableDate: newListing.available === "now" ? undefined : "June 15, 2023",
    }

    setUserProducts([newProduct, ...userProducts])
    setShowNewListingDialog(false)

    // Reset form
    setNewListing({
      name: "",
      price: "",
      unit: "kg",
      category: "",
      description: "",
      available: "now",
      organic: false,
      quantity: "",
    })

    toast({
      title: "Listing added",
      description: `${newListing.name} has been added to your listings.`,
    })
  }

  // Handle manage listings
  const handleManageListings = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setShowManageListingsDialog(true)
  }

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditMode(true)
    setShowManageListingsDialog(true)
  }

  // Handle update product
  const handleUpdateProduct = () => {
    if (!selectedProduct) return

    // In a real app, we would submit to the API
    // For now, just update the user's products
    const updatedProducts = userProducts.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))

    setUserProducts(updatedProducts)
    setShowManageListingsDialog(false)
    setSelectedProduct(null)
    setEditMode(false)

    toast({
      title: "Product updated",
      description: `${selectedProduct.name} has been updated.`,
    })
  }

  // Handle remove product
  const handleRemoveProduct = (product: Product) => {
    // In a real app, we would submit to the API
    // For now, just remove from the user's products
    const updatedProducts = userProducts.filter((p) => p.id !== product.id)
    setUserProducts(updatedProducts)

    toast({
      title: "Product removed",
      description: `${product.name} has been removed from your listings.`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

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
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2c5d34] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
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
                                    src={product.image || "/placeholder.svg?height=200&width=300"}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-t-lg"
                                  />
                                  <div
                                    className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                                      product.available ? "bg-[#2c5d34]" : "bg-amber-500"
                                    }`}
                                  >
                                    {product.available ? "Available Now" : "Pre-order"}
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
                                    onClick={() => handleSaveItem(product)}
                                  >
                                    <Heart className="h-4 w-4" />
                                    <span className="sr-only">Save {product.name}</span>
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Link
                                    href={`/farm/${product.farm_id}`}
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
                                    href={`/farm/${product.farm_id}`}
                                    className="hover:text-[#2c5d34] hover:underline"
                                  >
                                    {product.farmName || `Farm #${product.farm_id}`}
                                    {product.distance ? ` (${product.distance} miles)` : ""}
                                  </Link>
                                </div>
                                {!product.available && product.availableDate && (
                                  <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Available: {product.availableDate}</span>
                                  </div>
                                )}
                                {product.rating && (
                                  <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                    <span>
                                      {product.rating} ({product.reviews || 0} reviews)
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <Button
                                  className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {product.available ? "Add to Cart" : "Pre-order"}
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
                      <Button className="w-full h-32 bg-[#2c5d34] hover:bg-[#1e3f24]" onClick={handleAddNewListing}>
                        Add New Listing
                      </Button>
                    </div>
                    <div>
                      <Button className="w-full h-32 bg-[#2c5d34] hover:bg-[#1e3f24]" onClick={handleManageListings}>
                        Manage Existing Listings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#d8e6c0]">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">Your Active Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingUserProducts ? (
                    <div className="text-center py-4">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#2c5d34] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="mt-2 text-gray-600">Loading your listings...</p>
                    </div>
                  ) : userProducts.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      You don't have any active listings yet. Click "Add New Listing" to get started.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-col md:flex-row justify-between items-start p-4 border border-[#d8e6c0] rounded-md hover:bg-[#f0f5e8] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden">
                              <img
                                src={product.image || "/placeholder.svg?height=64&width=64"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-500">
                                Available: {product.available ? "Now" : "Pre-order"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {product.quantity || Math.floor(Math.random() * 100) + 10} {product.unit}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col items-end">
                            <p className="font-bold">
                              ${product.price}/{product.unit}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#d8e6c0] text-[#2c5d34]"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#d8e6c0] text-red-600"
                                onClick={() => handleRemoveProduct(product)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* New Listing Dialog */}
      <Dialog open={showNewListingDialog} onOpenChange={setShowNewListingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
            <DialogDescription>Fill in the details below to create a new product listing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                value={newListing.name}
                onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price*
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  className="flex-1"
                />
                <Select
                  value={newListing.unit}
                  onValueChange={(value) => setNewListing({ ...newListing, unit: value })}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="each">each</SelectItem>
                    <SelectItem value="bunch">bunch</SelectItem>
                    <SelectItem value="dozen">dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity*
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newListing.quantity}
                onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category*
              </Label>
              <Select
                value={newListing.category}
                onValueChange={(value) => setNewListing({ ...newListing, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="herbs">Herbs</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="eggs">Eggs</SelectItem>
                  <SelectItem value="honey">Honey</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">
                Availability
              </Label>
              <Select
                value={newListing.available}
                onValueChange={(value) => setNewListing({ ...newListing, available: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Available Now</SelectItem>
                  <SelectItem value="preorder">Pre-order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="organic" className="text-right">
                Organic
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="organic"
                  checked={newListing.organic}
                  onChange={(e) => setNewListing({ ...newListing, organic: e.target.checked })}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="organic" className="text-sm">
                  This product is certified organic
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description*
              </Label>
              <Textarea
                id="description"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewListingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewListing} className="bg-[#2c5d34] hover:bg-[#1e3f24]">
              Add Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Listings Dialog */}
      <Dialog open={showManageListingsDialog} onOpenChange={setShowManageListingsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Product" : "Manage Listings"}</DialogTitle>
            <DialogDescription>
              {editMode ? "Update your product details below." : "View and manage your product listings."}
            </DialogDescription>
          </DialogHeader>

          {editMode && selectedProduct ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false)
                    setSelectedProduct(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct} className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                  Update Product
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="py-4">
              {userProducts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">You don't have any active listings yet.</div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {userProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-4 border border-[#d8e6c0] rounded-md hover:bg-[#f0f5e8] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#e6f0d8] rounded-md overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg?height=48&width=48"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${product.price}/{product.unit} · {product.available ? "Available Now" : "Pre-order"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#d8e6c0] text-[#2c5d34]"
                          onClick={() => {
                            setSelectedProduct(product)
                            setEditMode(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#d8e6c0] text-red-600"
                          onClick={() => {
                            handleRemoveProduct(product)
                            if (userProducts.length <= 1) {
                              setShowManageListingsDialog(false)
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowManageListingsDialog(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
