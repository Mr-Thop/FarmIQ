"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"

export default function SoilUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file")
      return
    }

    setFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        setPreview(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Reset results
    setResults(null)
  }

  const analyzeImage = () => {
    if (!file) return

    setIsAnalyzing(true)

    // Simulate analysis (in a real app, this would call an API)
    setTimeout(() => {
      setIsAnalyzing(false)
      setResults({
        soilType: "Loamy",
        pH: "6.8 (Neutral)",
        organicMatter: "Medium",
        moisture: "Moderate",
        quality: "Good",
        recommendedCrops: ["Tomatoes", "Peppers", "Cucumbers", "Lettuce", "Carrots"],
      })
    }, 2000)
  }

  const resetUpload = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
  }

  return (
    <div className="space-y-6">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-[#2c5d34] bg-[#e6f0d8]" : "border-[#d8e6c0]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-[#e6f0d8] p-3">
              <Upload className="h-6 w-6 text-[#2c5d34]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload Soil Photo</h3>
              <p className="text-sm text-gray-500">Drag and drop your soil photo here, or click to browse</p>
              <p className="text-xs text-gray-400">Supports: JPG, PNG, HEIC (max 10MB)</p>
            </div>
            <Button
              onClick={() => document.getElementById("soil-upload")?.click()}
              className="bg-[#2c5d34] hover:bg-[#1e3f24]"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Photo
            </Button>
            <input id="soil-upload" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Soil Photo</h3>
              <div className="border border-[#d8e6c0] rounded-lg overflow-hidden">
                <img src={preview || "/placeholder.svg"} alt="Soil sample" className="w-full h-64 object-cover" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-500">
                  {file?.name} ({(file?.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <Button variant="outline" size="sm" onClick={resetUpload} className="text-[#2c5d34] border-[#d8e6c0]">
                  Change
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Analysis Results</h3>
              {isAnalyzing ? (
                <div className="border border-[#d8e6c0] rounded-lg p-6 h-64 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#2c5d34] animate-spin mb-4" />
                  <p className="text-gray-600">Analyzing soil sample...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
              ) : results ? (
                <div className="border border-[#d8e6c0] rounded-lg p-6 h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Soil Type:</span>
                      <span className="text-sm">{results.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">pH Level:</span>
                      <span className="text-sm">{results.pH}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Organic Matter:</span>
                      <span className="text-sm">{results.organicMatter}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Moisture:</span>
                      <span className="text-sm">{results.moisture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Overall Quality:</span>
                      <span className="text-sm text-green-600">{results.quality}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">Recommended Crops:</p>
                      <div className="flex flex-wrap gap-2">
                        {results.recommendedCrops.map((crop: string) => (
                          <span key={crop} className="text-xs bg-[#e6f0d8] text-[#2c5d34] px-2 py-1 rounded-full">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-[#d8e6c0] rounded-lg p-6 h-64 flex flex-col items-center justify-center">
                  <p className="text-gray-600 mb-4">Click analyze to process your soil sample</p>
                  <Button onClick={analyzeImage} className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                    Analyze Soil
                  </Button>
                </div>
              )}
            </div>
          </div>

          {results && (
            <div className="border border-[#d8e6c0] rounded-lg p-6 bg-[#f8f9f5]">
              <h3 className="text-lg font-medium mb-3">Recommendations</h3>
              <p className="text-sm text-gray-700 mb-4">
                Based on your soil analysis, here are some recommendations to improve your soil quality and maximize
                crop yield:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Add compost:</strong> Incorporate organic matter to improve soil structure and nutrient
                  content.
                </li>
                <li></li>
                <li>
                  <strong>Adjust pH if needed:</strong> Your soil pH is in the optimal range. Maintain it by avoiding
                  excessive use of chemical fertilizers.
                </li>
                <li>
                  <strong>Crop rotation:</strong> Implement a rotation plan with the recommended crops to prevent soil
                  depletion.
                </li>
                <li>
                  <strong>Mulching:</strong> Apply mulch to help retain moisture and suppress weeds.
                </li>
                <li>
                  <strong>Water management:</strong> Maintain consistent moisture levels, especially during dry periods.
                </li>
              </ul>
              <div className="mt-4">
                <Button className="bg-[#2c5d34] hover:bg-[#1e3f24]">Download Full Report</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
