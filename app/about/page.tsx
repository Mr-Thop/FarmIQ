import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Users, Award, Globe, MessageSquare, ShieldCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f5]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-[#2c5d34] text-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">About FarmIQ</h1>
              <p className="text-lg md:text-xl mb-8">
                Empowering farmers and connecting communities through sustainable agriculture and technology.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-white text-[#2c5d34] hover:bg-[#e6f0d8]">
                  <Link href="/dashboard">For Farmers</Link>
                </Button>
                <Button asChild className="bg-[#e6f0d8] text-[#2c5d34] hover:bg-white">
                  <Link href="/customer">For Customers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2c5d34] mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                FarmIQ is dedicated to revolutionizing agriculture through smart technology, connecting farmers directly
                with consumers, and promoting sustainable farming practices that benefit our planet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-[#d8e6c0]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#e6f0d8] flex items-center justify-center mb-4">
                      <Leaf className="h-8 w-8 text-[#2c5d34]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Sustainable Farming</h3>
                    <p className="text-gray-600">
                      We promote eco-friendly farming practices that preserve natural resources and reduce environmental
                      impact.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#d8e6c0]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#e6f0d8] flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-[#2c5d34]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Community Connection</h3>
                    <p className="text-gray-600">
                      We build bridges between farmers and consumers, fostering direct relationships and supporting
                      local economies.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#d8e6c0]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#e6f0d8] flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-[#2c5d34]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Quality Assurance</h3>
                    <p className="text-gray-600">
                      We ensure high-quality produce by providing farmers with tools to monitor and improve crop health.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-[#f8f9f5]">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-[#2c5d34] mb-4">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    FarmIQ was founded in 2023 by a team of agricultural experts, technologists, and environmental
                    scientists who shared a vision of transforming farming through innovation.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We recognized that farmers face numerous challenges, from unpredictable weather patterns to crop
                    diseases, while consumers increasingly seek fresh, locally-grown produce. Our platform bridges this
                    gap, providing farmers with AI-powered tools to optimize their crops and connecting them directly
                    with customers who value quality and sustainability.
                  </p>
                  <p className="text-gray-600">
                    Today, FarmIQ serves thousands of farmers and customers across the country, fostering a more
                    sustainable and connected food ecosystem.
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Farmers working in field"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2c5d34] mb-4">Our Values</h2>
              <p className="text-lg text-gray-600">
                At FarmIQ, our core values guide everything we do as we work to transform agriculture and build
                sustainable food systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#e6f0d8] flex items-center justify-center">
                    <Globe className="h-6 w-6 text-[#2c5d34]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Environmental Stewardship</h3>
                  <p className="text-gray-600">
                    We believe in farming practices that protect and nurture our planet for future generations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#e6f0d8] flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-[#2c5d34]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    We foster open communication between farmers and consumers, building trust through honesty.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#e6f0d8] flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-[#2c5d34]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We continuously develop and implement new technologies to solve agricultural challenges.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#e6f0d8] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#2c5d34]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2c5d34] mb-2">Community</h3>
                  <p className="text-gray-600">
                    We believe in the power of local communities and work to strengthen connections within them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#2c5d34] text-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join the FarmIQ Community</h2>
              <p className="text-lg mb-8">
                Whether you're a farmer looking to optimize your crops or a consumer seeking fresh, local produce,
                FarmIQ is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-white text-[#2c5d34] hover:bg-[#e6f0d8]">
                  <Link href="/dashboard">Start Farming</Link>
                </Button>
                <Button asChild className="bg-[#e6f0d8] text-[#2c5d34] hover:bg-white">
                  <Link href="/market">Shop Local</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
