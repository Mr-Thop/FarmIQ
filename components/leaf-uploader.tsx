"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { analysisService } from "@/lib/analysis-service"
import { toast } from "@/components/ui/use-toast"

export default function LeafUploader() {
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
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
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

  const analyzeImage = async () => {
    if (!file) return

    setIsAnalyzing(true)

    try {
      // Create a data URL for the image
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async (e) => {
        if (!e.target) return

        const imageUrl = e.target.result as string

        // Prepare the analysis data in the format expected by the backend
        const analysisData = {
          image_url: imageUrl,
          plant: "Tomato",
          disease: "Early Blight",
          confidence: "92%",
          severity: "Moderate",
          treatments: [
            "Remove and destroy affected leaves",
            "Apply fungicide specifically labeled for early blight",
            "Improve air circulation around plants",
            "Water at the base of plants to keep foliage dry",
            "Rotate crops annually",
          ],
        }

        // Send the analysis data to the backend
        const success = await analysisService.analyzeLeaf(analysisData)

        if (success) {
          setResults({
            plant: analysisData.plant,
            disease: analysisData.disease,
            confidence: analysisData.confidence,
            severity: analysisData.severity,
            description:
              "Early blight is a fungal disease that affects tomatoes, potatoes, and other nightshade plants. It's characterized by brown spots with concentric rings, often on lower leaves.",
            treatments: analysisData.treatments,
          })
        } else {
          toast({
            title: "Analysis failed",
            description: "Could not save leaf analysis result",
            variant: "destructive",
          })
        }

        setIsAnalyzing(false)
      }
    } catch (error) {
      console.error("Leaf analysis error:", error)
      toast({
        title: "Analysis error",
        description: "An error occurred during analysis",
        variant: "destructive",
      })
      setIsAnalyzing(false)
    }
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
              <h3 className="text-lg font-medium">Upload Leaf Photo</h3>
              <p className="text-sm text-gray-500">Drag and drop your leaf photo here, or click to browse</p>
              <p className="text-xs text-gray-400">Supports: JPG, PNG, HEIC (max 10MB)</p>
            </div>
            <Button
              onClick={() => document.getElementById("leaf-upload")?.click()}
              className="bg-[#2c5d34] hover:bg-[#1e3f24]"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Photo
            </Button>
            <input id="leaf-upload" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Leaf Photo</h3>
              <div className="border border-[#d8e6c0] rounded-lg overflow-hidden">
                <img
                  src={preview || "/placeholder.svg?height=300&width=400"}
                  alt="Leaf sample"
                  className="w-full h-64 object-cover"
                />
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
                  <p className="text-gray-600">Analyzing leaf sample...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
              ) : results ? (
                <div className="border border-[#d8e6c0] rounded-lg p-6 h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Plant:</span>
                      <span className="text-sm">{results.plant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Disease:</span>
                      <span className="text-sm text-red-600">{results.disease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Confidence:</span>
                      <span className="text-sm">{results.confidence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Severity:</span>
                      <span className="text-sm">{results.severity}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Description:</p>
                      <p className="text-sm text-gray-600">{results.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-[#d8e6c0] rounded-lg p-6 h-64 flex flex-col items-center justify-center">
                  <p className="text-gray-600 mb-4">Click analyze to process your leaf sample</p>
                  <Button onClick={analyzeImage} className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                    Analyze Leaf
                  </Button>
                </div>
              )}
            </div>
          </div>

          {results && (
            <div className="border border-[#d8e6c0] rounded-lg p-6 bg-[#f8f9f5]">
              <h3 className="text-lg font-medium mb-3">Treatment Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {results.treatments &&
                  results.treatments.map((treatment: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#2c5d34] text-white h-5 w-5 text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      {treatment}
                    </li>
                  ))}
              </ul>
              <div className="mt-6 p-4 bg-[#e6f0d8] rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Prevention tips:</strong> Practice crop rotation, ensure proper spacing between plants, and
                  remove plant debris at the end of the growing season to prevent disease recurrence.
                </p>
              </div>
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
