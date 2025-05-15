import { apiClient } from "./api-client"

export interface SoilAnalysis {
  id?: number
  image_url?: string
  analyzed_at?: string
  soilType?: string
  pH?: string
  organicMatter?: string
  moisture?: string
  quality?: string
  recommendedCrops?: string[]
}

export interface LeafAnalysis {
  id?: number
  image_url?: string
  plant?: string
  disease?: string
  confidence?: string
  severity?: string
  treatments?: string[]
  description?: string
}

class AnalysisService {
  async getSoilAnalyses(): Promise<SoilAnalysis[]> {
    try {
      const response = await apiClient.get("/api/soil-analysis/history")
      console.log("Soil analyses API response:", response.data)
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching soil analyses:", error)
      return []
    }
  }

  async getLeafAnalyses(): Promise<LeafAnalysis[]> {
    try {
      const response = await apiClient.get("/api/leaf-analysis/history")
      console.log("Leaf analyses API response:", response.data)
      // Ensure we always return an array
      if (response.data && response.data.history) {
        return response.data.history
      }
      return []
    } catch (error) {
      console.error("Error fetching leaf analyses:", error)
      return []
    }
  }

  async analyzeSoil(file: File): Promise<SoilAnalysis | null> {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await apiClient.post("/api/soil-analysis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data || null
    } catch (error) {
      console.error("Error analyzing soil:", error)
      return null
    }
  }

  async analyzeLeaf(data: any): Promise<boolean> {
    try {
      // The backend expects a JSON object, not FormData for leaf analysis
      const response = await apiClient.post("/api/leaf-analysis", data)
      return !!response.data
    } catch (error) {
      console.error("Error analyzing leaf:", error)
      return false
    }
  }

  async getSoilAnalysisById(id: number): Promise<SoilAnalysis | null> {
    try {
      const response = await apiClient.get(`/api/soil-analysis/${id}`)
      return response.data || null
    } catch (error) {
      console.error("Error fetching soil analysis:", error)
      return null
    }
  }

  async getLeafAnalysisById(id: number): Promise<LeafAnalysis | null> {
    try {
      const response = await apiClient.get(`/api/leaf-analysis/${id}`)
      return response.data?.analysis || null
    } catch (error) {
      console.error("Error fetching leaf analysis:", error)
      return null
    }
  }
}

export const analysisService = new AnalysisService()
