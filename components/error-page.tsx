"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorPageProps {
  error?: Error
  reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error)
  }, [error])

  const is500 = error?.message === "Internal Server Error" || (error as any)?.status === 500

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9f5] p-4">
      {is500 ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">500 Internal Server Error</h1>
          <div className="relative w-64 h-64 mx-auto mb-8">
            <motion.div
              className="absolute inset-0"
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Panda body */}
                <circle cx="100" cy="100" r="80" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />

                {/* Panda ears */}
                <circle cx="40" cy="40" r="25" fill="#000000" />
                <circle cx="160" cy="40" r="25" fill="#000000" />

                {/* Panda eyes - closed for sleeping */}
                <motion.path
                  d="M70 90 Q 80 100 90 90"
                  stroke="#000000"
                  strokeWidth="3"
                  fill="transparent"
                  animate={{ d: ["M70 90 Q 80 100 90 90", "M70 85 Q 80 95 90 85", "M70 90 Q 80 100 90 90"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.path
                  d="M110 90 Q 120 100 130 90"
                  stroke="#000000"
                  strokeWidth="3"
                  fill="transparent"
                  animate={{ d: ["M110 90 Q 120 100 130 90", "M110 85 Q 120 95 130 85", "M110 90 Q 120 100 130 90"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* Panda nose */}
                <circle cx="100" cy="110" r="10" fill="#000000" />

                {/* Panda mouth */}
                <path d="M90 120 Q 100 130 110 120" stroke="#000000" strokeWidth="2" fill="transparent" />

                {/* Snoring Z's */}
                <motion.g
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 20, 40, 60],
                    y: [0, -20, -40, -60],
                    scale: [0.5, 0.7, 0.9, 1.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <text x="130" y="60" fontSize="24" fontWeight="bold" fill="#000000">
                    Z
                  </text>
                </motion.g>
                <motion.g
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 20, 40, 60],
                    y: [0, -20, -40, -60],
                    scale: [0.5, 0.7, 0.9, 1.1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <text x="150" y="40" fontSize="18" fontWeight="bold" fill="#000000">
                    z
                  </text>
                </motion.g>
                <motion.g
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 20, 40, 60],
                    y: [0, -20, -40, -60],
                    scale: [0.5, 0.7, 0.9, 1.1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <text x="170" y="20" fontSize="12" fontWeight="bold" fill="#000000">
                    z
                  </text>
                </motion.g>
              </svg>
            </motion.div>
          </div>
          <p className="text-gray-600 mb-6">Oops! Our server is taking a nap. We'll wake it up soon.</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2c5d34] mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We're sorry, but we encountered an error while processing your request.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {reset && (
          <Button onClick={reset} className="bg-[#2c5d34] hover:bg-[#1e3f24]">
            Try Again
          </Button>
        )}
        <Button asChild variant="outline" className="border-[#2c5d34] text-[#2c5d34]">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
