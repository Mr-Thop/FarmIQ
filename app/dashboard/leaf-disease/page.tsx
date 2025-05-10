"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import LeafUploader from "@/components/leaf-uploader"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import LoginRequiredModal from "@/components/login-required-modal"
import { Analytics } from "@vercel/analytics/next"

export default function LeafDiseasePage() {
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
            message="You need to login as a farmer to access the Leaf Disease Detection feature."
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />
      <Analytics/>

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
            <h1 className="text-3xl font-bold text-[#2c5d34]">Leaf Disease Detection</h1>
            <p className="text-gray-600">Upload leaf photos to identify diseases and get treatment recommendations</p>
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
                    <LeafUploader />
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
                        {[1, 2, 3, 4].map((item) => (
                          <motion.div
                            key={item}
                            whileHover={{ y: -5 }}
                            className="border border-[#d8e6c0] rounded-md overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="h-40 bg-[#e6f0d8] flex items-center justify-center">
                              <img
                                src="/placeholder.svg?height=160&width=240"
                                alt={`Leaf sample ${item}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-medium">Tomato Leaf</p>
                              <p className="text-sm text-gray-500">Analyzed on May {item + 5}, 2025</p>
                              <div className="flex items-center mt-2">
                                <span className="text-sm font-medium mr-2">Diagnosis:</span>
                                <span className="text-sm text-red-600">Early Blight</span>
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
                      <h3 className="text-[#2c5d34]">How to Take Leaf Photos for Disease Detection</h3>
                      <ol className="space-y-4">
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <strong>Select affected leaves:</strong> Choose leaves that show clear symptoms of disease.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <strong>Clean background:</strong> Place the leaf on a solid, contrasting background.
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
                          <strong>Multiple angles:</strong> Take photos of both the top and bottom of the leaf.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <strong>Include healthy leaves:</strong> If possible, include a healthy leaf for comparison.
                        </motion.li>
                      </ol>

                      <h3 className="text-[#2c5d34] mt-6">Common Plant Diseases</h3>
                      <ul className="space-y-2">
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <strong>Early Blight:</strong> Brown spots with concentric rings, often on lower leaves.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <strong>Powdery Mildew:</strong> White powdery spots on leaves and stems.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <strong>Leaf Spot:</strong> Dark spots with yellow halos on leaves.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <strong>Downy Mildew:</strong> Yellow spots on leaf tops, gray fuzz underneath.
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <strong>Bacterial Wilt:</strong> Rapid wilting of entire plant despite moist soil.
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
