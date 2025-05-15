"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Leaf, Sprout, Sun, CloudRain, Tractor, TreesIcon as Plant, Wheat } from "lucide-react"
import Image from "next/image"
import HomeSlideshow from "@/components/home-slideshow"
import Navbar from "@/components/navbar"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (user) {
      if (user.role === "farmer") {
        router.push("/dashboard")
      } else {
        router.push("/customer")
      }
    } else {
      // Open login modal
      document.getElementById("login-trigger")?.click()
    }
  }

  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-green-500" />,
      title: "Soil Analysis",
      description: "Get detailed insights about your soil health and recommendations for improvement.",
    },
    {
      icon: <Sprout className="h-10 w-10 text-green-500" />,
      title: "Crop Management",
      description: "Track and optimize your crop growth with AI-powered recommendations.",
    },
    {
      icon: <CloudRain className="h-10 w-10 text-green-500" />,
      title: "Weather Forecasts",
      description: "Access accurate weather predictions tailored for agricultural needs.",
    },
    {
      icon: <Sun className="h-10 w-10 text-green-500" />,
      title: "Planting Calendar",
      description: "Plan your planting schedule based on optimal growing conditions.",
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-green-300"
        />
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-yellow-200"
        />
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
          className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-blue-200"
        />
      </div>
      <div className="flex flex-col bg-[#f8f9f5]">
            <Navbar />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="mb-6 text-4xl md:text-6xl font-bold tracking-tight text-green-900">
              Smart Farming Solutions for a <br />
              <span className="text-green-600">Sustainable Future</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              FarmIQ combines cutting-edge technology with agricultural expertise to help farmers increase productivity,
              reduce costs, and practice sustainable farming.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleGetStarted} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated farm elements */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32"
        >
          <Tractor className="w-full h-full text-green-700 opacity-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute bottom-10 right-10 w-16 h-16 md:w-24 md:h-24"
        >
          <Plant className="w-full h-full text-green-600 opacity-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="absolute top-20 right-5 w-16 h-16 md:w-20 md:h-20"
        >
          <Wheat className="w-full h-full text-yellow-600 opacity-20" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Revolutionize Your Farming</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Our comprehensive suite of tools helps you make data-driven decisions for your farm.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">See FarmIQ in Action</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Explore how our platform is helping farmers around the world.
            </p>
          </motion.div>

          <HomeSlideshow />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{
            rotate: 360,
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-green-500"
        />
        <motion.div
          animate={{
            rotate: -360,
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-green-400"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Farm?</h2>
              <p className="text-green-100 mb-6 text-lg">
                Join thousands of farmers who are already using FarmIQ to increase yields and reduce costs.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleGetStarted} size="lg" className="bg-white text-green-600 hover:bg-green-50">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="FarmIQ Dashboard Preview"
                  width={600}
                  height={400}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-bold">FarmIQ Dashboard</p>
                    <p className="text-sm">Powerful insights at your fingertips</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">What Farmers Are Saying</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Hear from farmers who have transformed their operations with FarmIQ.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                role: "Corn Farmer, Iowa",
                quote:
                  "FarmIQ has increased my crop yield by 20% in just one season. The soil analysis tool is a game-changer.",
              },
              {
                name: "Maria Rodriguez",
                role: "Organic Farmer, California",
                quote:
                  "The planting calendar and weather forecasts have helped me optimize my growing schedule and reduce water usage.",
              },
              {
                name: "Robert Johnson",
                role: "Dairy Farmer, Wisconsin",
                quote:
                  "The comprehensive analytics have given me insights I never had before. My farm is more profitable than ever.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <span className="text-green-600 font-bold text-lg">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-green-800">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Farm Scene */}
      <section className="py-16 bg-white relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-green-100">
          {/* Sun */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 30 }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute top-0 right-1/4 w-20 h-20 rounded-full bg-yellow-300 shadow-lg"
          />

          {/* Clouds */}
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-10 left-0 flex gap-16"
          >
            <div className="w-24 h-10 bg-white rounded-full" />
            <div className="w-16 h-8 bg-white rounded-full" />
            <div className="w-20 h-12 bg-white rounded-full" />
          </motion.div>

          {/* Hills */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-green-300 rounded-t-[50%]" />
          <div className="absolute bottom-0 left-1/4 right-0 h-24 bg-green-400 rounded-t-[40%]" />

          {/* Tractor */}
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: "calc(100vw + 100px)" }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute bottom-20 left-0 flex flex-col items-center"
          >
            <Tractor className="w-16 h-16 text-red-600" />
          </motion.div>

          {/* Plants */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: i * 0.2,
                  duration: 1,
                }}
                className="relative"
              >
                <Plant className="w-10 h-10 text-green-600" />
                <motion.div
                  animate={{
                    rotate: [-5, 5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                  className="absolute top-0 left-0"
                >
                  <Plant className="w-10 h-10 text-green-600" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
