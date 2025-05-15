"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Leaf, ShoppingCart, Microscope } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    icon: Microscope,
    alt: "Farmer using soil analysis technology",
    caption: "Advanced soil analysis for optimal crop selection",
  },
  {
    icon: Leaf,
    alt: "Leaf disease detection in action",
    caption: "AI-powered disease detection to protect your crops",
  },
  {
    icon: ShoppingCart,
    alt: "Farmers marketplace",
    caption: "Connect directly with customers through our marketplace",
  },
]

export default function HomeSlideshow() {
  const [current, setCurrent] = useState(0)

  // Auto-advance the slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      {/* Slideshow container */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        {slides.map((slide, index) => {
          const Icon = slide.icon
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              } bg-gradient-to-r from-[#2c5d34]/10 to-[#e6f0d8]/30`}
              style={{ zIndex: index === current ? 1 : 0 }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <Icon className="h-24 w-24 text-[#2c5d34] mb-6" />
                <p className="text-[#2c5d34] text-xl md:text-2xl font-semibold text-center">{slide.caption}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent p-4">
                <p className="text-[#2c5d34] font-medium text-sm md:text-base">{slide.alt}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-[#2c5d34] rounded-full z-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-[#2c5d34] rounded-full z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === current ? "bg-[#2c5d34]" : "bg-[#2c5d34]/50"
            } transition-all duration-300`}
            onClick={() => setCurrent(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
