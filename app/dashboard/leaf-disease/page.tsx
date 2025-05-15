"use client"

import { useState, useEffect } from "react"
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
import { analysisService } from "@/lib/analysis-service"
import { useToast } from "@/components/ui/use-toast"
import ErrorBoundary from "@/components/error-boundary"

export default function LeafDiseasePage() {
  return (
    <ErrorBoundary>
      <LeafDiseaseContent />
    </ErrorBoundary>
  )
}

function LeafDiseaseContent() {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated)
  const { toast } = useToast()

  // State for data - initialize as empty array
  const [leafAnalyses, setLeafAnalyses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const fetchLeafAnalyses = async () => {
      if (!isAuthenticated) return

      setIsLoading(true)
      try {
        const analyses = await analysisService.getLeafAnalyses()
        // Ensure we always set an array, even if the API returns undefined
        setLeafAnalyses(analyses || [])
        console.log("Leaf analyses loaded:", analyses)
      } catch (error) {
        console.error("Error fetching leaf analyses:", error)
        // Set empty array on error
        setLeafAnalyses([])
        toast({
          title: "Error",
          description: "Failed to load leaf disease analyses. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeafAnalyses()
  }, [isAuthenticated, toast])

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
                      {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Loading analyses...</div>
                      ) : leafAnalyses && leafAnalyses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {leafAnalyses.map((analysis, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ y: -5 }}
                              className="border border-[#d8e6c0] rounded-md overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="h-40 bg-[#e6f0d8] flex items-center justify-center">
                                <img
                                  src={analysis.image_url || "/images/placeholder-leaf.jpg"}
                                  alt={`Leaf sample ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <p className="font-medium">{analysis.plant_type || "Plant"}</p>
                                <p className="text-sm text-gray-500">
                                  Analyzed on {new Date(analysis.analyzed_at).toLocaleDateString()}
                                </p>
                                <div className="flex items-center mt-2">
                                  <span className="text-sm font-medium mr-2">Diagnosis:</span>
                                  <span className="text-sm text-red-600">{analysis.diagnosis}</span>
                                </div>
                                <Button variant="link" className="p-0 h-auto text-[#2c5d34]">
                                  View Details
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">No leaf analyses found</div>
                      )}
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
