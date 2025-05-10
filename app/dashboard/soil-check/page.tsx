"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import SoilUploader from "@/components/soil-uploader"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"

export default function SoilCheckPage() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            message="You need to login as a farmer to access the Soil Check feature."
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/dashboard" className="flex items-center text-[#2c5d34] hover:underline mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#2c5d34]">Soil Check</h1>
            <p className="text-gray-600">Upload soil photos for quality analysis and crop recommendations</p>
          </motion.div>

          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="guide">Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-[#d8e6c0]">
                  <CardContent className="pt-6">
                    <SoilUploader />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-[#d8e6c0]">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                          <motion.div
                            key={item}
                            whileHover={{ y: -5 }}
                            className="border border-[#d8e6c0] rounded-md overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="h-40 bg-[#e6f0d8] flex items-center justify-center">
                              <img
                                src="/placeholder.svg?height=160&width=240"
                                alt={`Soil sample ${item}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-medium">Soil Sample #{item}</p>
                              <p className="text-sm text-gray-500">Analyzed on May {item + 1}, 2025</p>
                              <div className="flex items-center mt-2">
                                <span className="text-sm font-medium mr-2">Quality:</span>
                                <span className="text-sm text-green-600 flex items-center">
                                  <Check className="h-3 w-3 mr-1" /> Good
                                </span>
                              </div>
                              <Button variant="link" className="p-0 h-auto text-[#2c5d34]">
                                View Details
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="guide" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-[#d8e6c0]">
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-[#2c5d34]">How to Take Soil Photos for Analysis</h3>
                      <ol className="space-y-4">
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <strong>Prepare the soil sample:</strong> Dig about 6 inches deep and collect a sample. Remove
                          any large debris, rocks, or plant material.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <strong>Place on a neutral background:</strong> Put the soil on a white or light-colored
                          surface for better contrast.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <strong>Good lighting:</strong> Take photos in natural daylight, avoiding shadows or glare.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <strong>Multiple angles:</strong> Take 2-3 photos from different angles for better analysis.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <strong>Include a reference object:</strong> Place a coin or ruler next to the soil for size
                          reference.
                        </motion.li>
                      </ol>

                      <h3 className="text-[#2c5d34] mt-6">Understanding Your Results</h3>
                      <p>Our AI analyzes your soil photos to determine:</p>
                      <ul className="space-y-2">
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <strong>Soil type:</strong> Clay, loam, sandy, etc.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <strong>Estimated pH level:</strong> Acidic, neutral, or alkaline
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <strong>Organic matter content:</strong> Low, medium, or high
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <strong>Moisture level:</strong> Dry, moderate, or wet
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <strong>Recommended crops:</strong> Based on soil type and current season
                        </motion.li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  )
}
