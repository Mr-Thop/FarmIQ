"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Calendar,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Truck,
  Leaf,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { useCart } from "@/context/cart-context"
import { Analytics } from "@vercel/analytics/next"

// Sample farm data
const farms = [
  {
    id: "farm1",
    name: "Green Valley Farm",
    description:
      "Green Valley Farm is a family-owned organic farm specializing in heirloom vegetables and fruits. Our farming practices focus on sustainability and biodiversity, ensuring the highest quality produce while caring for the environment.",
    location: "123 Farm Road, Greenville, CA 95432",
    distance: 5,
    phone: "(555) 123-4567",
    email: "info@greenvalleyfarm.com",
    rating: 4.8,
    reviews: 24,
    founded: 2005,
    certifications: ["Certified Organic", "Sustainable Farming", "Non-GMO"],
    paymentOptions: ["Credit Card", "Cash", "Farm Tokens"],
    deliveryOptions: ["Pickup at Farm", "Local Delivery", "Farmers Markets"],
    hours: [
      { day: "Monday", hours: "Closed" },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 3:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "1",
        name: "Organic Tomatoes",
        price: 3.5,
        unit: "kg",
        description: "Vine-ripened organic tomatoes, freshly harvested. Perfect for salads and cooking.",
        image: "/placeholder.svg?height=192&width=384",
        availability: "available-now",
        category: "vegetables",
        organic: true,
      },
      {
        id: "9",
        name: "Heirloom Carrots",
        price: 2.99,
        unit: "bunch",
        description: "Colorful, sweet heirloom carrots. Great for roasting or eating raw.",
        image: "/placeholder.svg?height=192&width=384",
        availability: "available-now",
        category: "vegetables",
        organic: true,
      },
      {
        id: "10",
        name: "Fresh Spinach",
        price: 3.25,
        unit: "bag",
        description: "Tender, nutrient-rich spinach leaves. Locally grown and pesticide-free.",
        image: "/placeholder.svg?height=192&width=384",
        availability: "available-now",
        category: "vegetables",
        organic: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "Sarah J.",
        date: "May 15, 2025",
        rating: 5,
        comment:
          "The tomatoes from Green Valley Farm are incredible! So much flavor compared to store-bought. Will definitely be buying more.",
      },
      {
        id: "r2",
        user: "Michael T.",
        date: "May 10, 2025",
        rating: 5,
        comment:
          "Great experience visiting the farm. The owners are friendly and knowledgeable, and the produce is top-notch.",
      },
      {
        id: "r3",
        user: "Emily R.",
        date: "May 3, 2025",
        rating: 4,
        comment:
          "Love their commitment to sustainable farming. The spinach is always fresh and lasts longer than what I get at the supermarket.",
      },
    ],
  },
  {
    id: "farm2",
    name: "Sunny Fields",
    description:
      "At Sunny Fields, we grow hydroponic lettuce and herbs year-round in our state-of-the-art greenhouse. Our controlled environment allows us to produce consistent, high-quality greens without pesticides.",
    location: "456 Sunshine Lane, Meadowbrook, CA 95433",
    distance: 3,
    phone: "(555) 987-6543",
    email: "contact@sunnyfields.com",
    rating: 4.7,
    reviews: 18,
    founded: 2012,
    certifications: ["Pesticide-Free", "Water Conservation", "Local First"],
    paymentOptions: ["Credit Card", "Cash", "Venmo"],
    deliveryOptions: ["Pickup at Farm", "Local Delivery", "Subscription Box"],
    hours: [
      { day: "Monday", hours: "10:00 AM - 4:00 PM" },
      { day: "Tuesday", hours: "10:00 AM - 4:00 PM" },
      { day: "Wednesday", hours: "10:00 AM - 4:00 PM" },
      { day: "Thursday", hours: "10:00 AM - 4:00 PM" },
      { day: "Friday", hours: "10:00 AM - 4:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "2",
        name: "Fresh Lettuce",
        price: 1.99,
        unit: "head",
        description: "Crisp, hydroponic lettuce grown without pesticides. Harvested daily for maximum freshness.",
        image: "/placeholder.svg?height=192&width=384",
        availability: "available-now",
        category: "vegetables",
        organic: false,
      },
      {
        id: "8",
        name: "Fresh Herbs Bundle",
        price: 3.99,
        unit: "bundle",
        description: "Assorted fresh herbs including basil, rosemary, thyme, and mint.",
        image: "/placeholder.svg?height=192&width=384",
        availability: "available-now",
        category: "herbs",
        organic: false,
      },
      {
        id: "11",
        name: "Microgreens Mix",
        price: 4.5,
        unit: "container",
        description: "Nutrient-dense microgreens mix. Perfect for adding to salads, sandwiches, and as garnish.",
        image: "/placeholder.svg?height=192&width=384",
        availability: "available-now",
        category: "vegetables",
        organic: false,
      },
    ],
    reviews: [
      {
        id: "r4",
        user: "David L.",
        date: "May 12, 2025",
        rating: 5,
        comment:
          "Their lettuce is always crisp and fresh. I love that I can visit the greenhouse and see exactly how everything is grown.",
      },
      {
        id: "r5",
        user: "Jessica M.",
        date: "May 8, 2025",
        rating: 4,
        comment: "Great quality herbs. The basil is especially fragrant and flavorful.",
      },
      {
        id: "r6",
        user: "Robert K.",
        date: "April 30, 2025",
        rating: 5,
        comment: "The microgreens are amazing! So much flavor packed into these little greens. Worth every penny.",
      },
    ],
  },
]

export default function FarmProfilePage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Find the farm data based on the ID from the URL
  const farm = farms.find((f) => f.id === id) || farms[0]

  // Calculate average rating
  const averageRating = farm.reviews.reduce((acc, review) => acc + review.rating, 0) / farm.reviews.length

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />
      <Analytics/>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <Link href="/market" className="flex items-center text-[#2c5d34] hover:underline mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Marketplace
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Farm images and gallery */}
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden mb-4 h-64 md:h-96">
                <img
                  src={farm.images[activeImageIndex] || "/placeholder.svg"}
                  alt={farm.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {farm.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative rounded-md overflow-hidden h-16 w-24 flex-shrink-0 border-2 ${
                      activeImageIndex === index ? "border-[#2c5d34]" : "border-transparent"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${farm.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Farm info */}
            <div>
              <div className="bg-white rounded-lg border border-[#d8e6c0] p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-[#2c5d34] mb-2">{farm.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600">{farm.reviews.length} reviews</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-[#2c5d34] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">{farm.location}</p>
                      <p className="text-sm text-gray-500">{farm.distance} miles away</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#2c5d34] flex-shrink-0" />
                    <p className="text-gray-700">{farm.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[#2c5d34] flex-shrink-0" />
                    <a href={`mailto:${farm.email}`} className="text-[#2c5d34] hover:underline">
                      {farm.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-[#2c5d34] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium">Hours Today</p>
                      <p className="text-gray-600">
                        {
                          farm.hours.find((h) => h.day === new Date().toLocaleDateString("en-US", { weekday: "long" }))
                            ?.hours
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {farm.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="bg-[#e6f0d8] border-[#d8e6c0] text-[#2c5d34]">
                      <Check className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#2c5d34] hover:bg-[#1e3f24]">Contact Farm</Button>
                  <Button variant="outline" size="icon" className="border-[#d8e6c0]">
                    <Heart className="h-4 w-4 text-[#2c5d34]" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-[#d8e6c0]">
                    <Share2 className="h-4 w-4 text-[#2c5d34]" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="mb-8">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card className="border-[#d8e6c0]">
                    <CardHeader>
                      <CardTitle className="text-[#2c5d34]">About {farm.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-6">{farm.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-[#2c5d34] mb-3">Farm Details</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#2c5d34]" />
                              <span>Founded in {farm.founded}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-[#2c5d34]" />
                              <span>
                                {farm.certifications.includes("Certified Organic")
                                  ? "Certified Organic"
                                  : "Conventional Farming"}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium text-[#2c5d34] mb-3">Delivery & Payment</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Delivery Options:</p>
                              <ul className="space-y-1">
                                {farm.deliveryOptions.map((option, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                    <Truck className="h-3 w-3 text-[#2c5d34]" />
                                    <span>{option}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Payment Accepted:</p>
                              <p className="text-sm text-gray-700">{farm.paymentOptions.join(", ")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#d8e6c0]">
                    <CardHeader>
                      <CardTitle className="text-[#2c5d34]">Hours of Operation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {farm.hours.map((schedule, index) => (
                          <li
                            key={index}
                            className={`flex justify-between py-2 ${
                              index < farm.hours.length - 1 ? "border-b border-[#e6f0d8]" : ""
                            } ${
                              schedule.day === new Date().toLocaleDateString("en-US", { weekday: "long" })
                                ? "font-medium"
                                : ""
                            }`}
                          >
                            <span>{schedule.day}</span>
                            <span>{schedule.hours}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <Card className="border-[#d8e6c0]">
                    <CardHeader>
                      <CardTitle className="text-[#2c5d34]">Available Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {farm.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex gap-4 p-4 border border-[#d8e6c0] rounded-lg hover:bg-[#f0f5e8] transition-colors"
                          >
                            <div className="h-20 w-20 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-[#2c5d34]">{product.name}</h3>
                                <p className="font-bold">
                                  ${product.price}/{product.unit}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      product.availability === "available-now"
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-amber-100 text-amber-800 border-amber-200"
                                    } text-xs`}
                                  >
                                    {product.availability === "available-now" ? "Available Now" : "Pre-order"}
                                  </Badge>
                                  {product.organic && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 bg-[#e6f0d8] border-[#d8e6c0] text-[#2c5d34] text-xs"
                                    >
                                      Organic
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  className="h-8 bg-[#2c5d34] hover:bg-[#1e3f24]"
                                  onClick={() =>
                                    addToCart({
                                      id: product.id,
                                      name: product.name,
                                      price: product.price,
                                      unit: product.unit,
                                      farmName: farm.name,
                                      image: product.image,
                                      quantity: 1,
                                    })
                                  }
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card className="border-[#d8e6c0]">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-[#2c5d34]">Customer Reviews</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="font-medium text-lg">{averageRating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">({farm.reviews.length})</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {farm.reviews.map((review) => (
                          <div key={review.id} className="border-b border-[#e6f0d8] pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{review.user}</p>
                                <p className="text-sm text-gray-500">{review.date}</p>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">Write a Review</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card className="border-[#d8e6c0] sticky top-4">
                <CardHeader>
                  <CardTitle className="text-[#2c5d34]">More Farms Nearby</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {farms
                      .filter((f) => f.id !== farm.id)
                      .slice(0, 3)
                      .map((nearbyFarm) => (
                        <Link
                          key={nearbyFarm.id}
                          href={`/farm/${nearbyFarm.id}`}
                          className="flex gap-3 p-3 border border-[#d8e6c0] rounded-lg hover:bg-[#f0f5e8] transition-colors"
                        >
                          <div className="h-16 w-16 bg-[#e6f0d8] rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={nearbyFarm.images[0] || "/placeholder.svg"}
                              alt={nearbyFarm.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#2c5d34]">{nearbyFarm.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span>
                                {nearbyFarm.rating} ({nearbyFarm.reviews} reviews)
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{nearbyFarm.distance} miles away</p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full text-[#2c5d34] border-[#d8e6c0]">
                    <Link href="/market">View All Farms</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
