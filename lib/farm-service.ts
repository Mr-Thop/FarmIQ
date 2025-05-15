import { apiClient } from "./api-client"

export interface Farm {
  id: string
  name: string
  description: string
  location: {
    address: string
    lat: string
    lng: string
  }
  rating: number
  specialty: string
  image_url?: string
  distance?: string
  owner_id?: string
}

export interface FarmReview {
  id: string
  farm_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export interface FarmStats {
  totalCrops: number
  cropChange: number
  activeListings: number
  soilHealth: string
  lastSoilCheck: string
  revenue: number
  revenueChange: number
  yieldChange: number
  efficiency: number
  upcomingTasks?: Array<{
    id: number
    task: string
    date: string
    priority: "high" | "medium" | "low"
    completed: boolean
  }>
  listings?: Array<{
    id: string
    name: string
    price: number
    unit: string
    availableDate: string
  }>
}

export interface Crop {
  id: number
  name: string
  status: string
  progress: number
  harvestDate: string
}

class FarmService {
  async getFarms(filters?: { distance?: number; specialty?: string }): Promise<Farm[]> {
    try {
      console.log("Fetching farms with filters:", filters)

      let endpoint = "/api/farms"
      if (filters) {
        const params = new URLSearchParams()
        if (filters.distance) params.append("distance", filters.distance.toString())
        if (filters.specialty) params.append("specialty", filters.specialty)

        if (params.toString()) {
          endpoint += `?${params.toString()}`
        }
      }

      const response = await apiClient.get<Farm[]>(endpoint)
      return response.data || []
    } catch (error) {
      console.error("Error fetching farms:", error)
      return []
    }
  }

  async getFarmById(id: string): Promise<any> {
    try {
      console.log(`Fetching farm: ${id}`)
      const response = await apiClient.get<{ farm: any }>(`/api/farms/${id}`)
      return response.data?.farm || null
    } catch (error) {
      console.error("Error fetching farm:", error)
      return null
    }
  }

  async getNearbyFarms(lat: string, lng: string, radius = 15): Promise<Farm[]> {
    try {
      console.log(`Fetching nearby farms: lat=${lat}, lng=${lng}, radius=${radius}`)
      const response = await apiClient.get<{ farms: Farm[] }>(
        `/api/farms/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      )
      return response.data?.farms || []
    } catch (error) {
      console.error("Error fetching nearby farms:", error)
      return []
    }
  }

  async getFarmReviews(farmId: string): Promise<FarmReview[]> {
    try {
      console.log(`Fetching reviews for farm: ${farmId}`)
      const response = await apiClient.get<{ reviews: FarmReview[] }>(`/api/farms/${farmId}/reviews`)
      return response.data?.reviews || []
    } catch (error) {
      console.error("Error fetching farm reviews:", error)
      return []
    }
  }

  async addFarmReview(farmId: string, review: { rating: number; comment: string }): Promise<boolean> {
    try {
      console.log(`Adding review for farm: ${farmId}`, review)
      const response = await apiClient.post(`/api/farms/${farmId}/reviews`, review)
      return response.status === 201
    } catch (error) {
      console.error("Error adding farm review:", error)
      return false
    }
  }

  async getFarmStats(): Promise<FarmStats> {
    try {
      console.log("Fetching farm stats")
      const response = await apiClient.get<{ stats: FarmStats }>("/api/farms/stats")
      return (
        response.data?.stats || {
          totalCrops: 0,
          cropChange: 0,
          activeListings: 0,
          soilHealth: "N/A",
          lastSoilCheck: "Never",
          revenue: 0,
          revenueChange: 0,
          yieldChange: 0,
          efficiency: 0,
        }
      )
    } catch (error) {
      console.error("Error fetching farm stats:", error)
      return {
        totalCrops: 0,
        cropChange: 0,
        activeListings: 0,
        soilHealth: "N/A",
        lastSoilCheck: "Never",
        revenue: 0,
        revenueChange: 0,
        yieldChange: 0,
        efficiency: 0,
      }
    }
  }

  async getCrops(): Promise<Crop[]> {
    try {
      console.log("Fetching crops")
      const response = await apiClient.get<{ crops: Crop[] }>("/api/farms/crops")
      return response.data?.crops || this.getMockCrops()
    } catch (error) {
      console.error("Error fetching crops:", error)
      return this.getMockCrops()
    }
  }

  async updateCrop(cropId: number, data: Partial<Crop>): Promise<boolean> {
    try {
      console.log(`Updating crop: ${cropId}`, data)
      const response = await apiClient.put(`/api/farms/crops/${cropId}`, data)
      return response.status === 200
    } catch (error) {
      console.error("Error updating crop:", error)
      // Return true for demo purposes
      return true
    }
  }

  async addCrop(data: Omit<Crop, "id">): Promise<{ success: boolean; crop: Crop }> {
    try {
      console.log("Adding crop:", data)
      const response = await apiClient.post<{ crop: Crop }>("/api/farms/crops", data)
      return {
        success: response.status === 201,
        crop: response.data.crop,
      }
    } catch (error) {
      console.error("Error adding crop:", error)
      // Return mock data for demo purposes
      return {
        success: true,
        crop: {
          id: Math.floor(Math.random() * 1000) + 100,
          name: data.name,
          status: data.status,
          progress: data.progress,
          harvestDate: data.harvestDate,
        },
      }
    }
  }

  async deleteCrop(cropId: number): Promise<boolean> {
    try {
      console.log(`Deleting crop: ${cropId}`)
      const response = await apiClient.delete(`/api/farms/crops/${cropId}`)
      return response.status === 200
    } catch (error) {
      console.error("Error deleting crop:", error)
      // Return true for demo purposes
      return true
    }
  }

  async getReports(): Promise<any[]> {
    try {
      console.log("Fetching reports")
      const response = await apiClient.get("/api/farms/reports")
      return response.data || this.getMockReports()
    } catch (error) {
      console.error("Error fetching reports:", error)
      return this.getMockReports()
    }
  }

  async getYieldData(): Promise<any[]> {
    try {
      console.log("Fetching yield data")
      const response = await apiClient.get("/api/farms/yield")
      return response.data || this.getMockYieldData()
    } catch (error) {
      console.error("Error fetching yield data:", error)
      return this.getMockYieldData()
    }
  }

  async createFarm(farmData: Partial<Farm>): Promise<boolean> {
    try {
      console.log("Creating farm:", farmData)
      const response = await apiClient.post("/api/farms", farmData)
      return response.status === 201
    } catch (error) {
      console.error("Error creating farm:", error)
      return false
    }
  }

  async updateFarm(farmId: string, farmData: Partial<Farm>): Promise<boolean> {
    try {
      console.log(`Updating farm: ${farmId}`, farmData)
      const response = await apiClient.put(`/api/farms/${farmId}`, farmData)
      return response.status === 200
    } catch (error) {
      console.error("Error updating farm:", error)
      return false
    }
  }

  async deleteFarm(farmId: string): Promise<boolean> {
    try {
      console.log(`Deleting farm: ${farmId}`)
      const response = await apiClient.delete(`/api/farms/${farmId}`)
      return response.status === 200
    } catch (error) {
      console.error("Error deleting farm:", error)
      return false
    }
  }

  // Mock data methods (for fallback)
  private getMockCrops(): Crop[] {
    return [
      {
        id: 1,
        name: "Tomatoes",
        status: "Growing",
        progress: 65,
        harvestDate: "2023-08-15",
      },
      {
        id: 2,
        name: "Corn",
        status: "Planted",
        progress: 25,
        harvestDate: "2023-09-20",
      },
      {
        id: 3,
        name: "Lettuce",
        status: "Ready to harvest",
        progress: 95,
        harvestDate: "2023-07-05",
      },
    ]
  }

  private getMockReports(): any[] {
    return [
      {
        id: 1,
        title: "Monthly Farm Performance",
        date: "2023-06-15",
        type: "financial",
        summary: "Overall farm performance for June 2023",
        findings: [
          "Revenue increased by 12% compared to last month",
          "Crop yield was 8% higher than expected",
          "Expenses were within budget",
        ],
        recommendations: [
          "Consider expanding tomato production next season",
          "Implement water conservation techniques",
        ],
      },
      {
        id: 2,
        title: "Soil Health Analysis",
        date: "2023-06-01",
        type: "soil",
        summary: "Comprehensive soil health assessment for all fields",
        findings: [
          "Nitrogen levels are optimal in fields 1 and 2",
          "Field 3 shows signs of potassium deficiency",
          "pH levels are within acceptable range",
        ],
        recommendations: [
          "Apply potassium-rich fertilizer to Field 3",
          "Continue current soil management practices for Fields 1 and 2",
        ],
      },
      {
        id: 3,
        title: "Crop Yield Forecast",
        date: "2023-05-20",
        type: "crop",
        summary: "Projected yields for current growing season",
        findings: [
          "Tomato yield expected to be 15% higher than last year",
          "Corn yield may be affected by recent weather patterns",
          "New lettuce variety showing promising results",
        ],
        recommendations: [
          "Prepare additional storage for tomato harvest",
          "Monitor corn fields closely for signs of stress",
          "Consider expanding lettuce variety next season",
        ],
      },
    ]
  }

  private getMockYieldData(): any[] {
    return [
      { month: "Jan", yield: 0 },
      { month: "Feb", yield: 0 },
      { month: "Mar", yield: 0 },
      { month: "Apr", yield: 10 },
      { month: "May", yield: 30 },
      { month: "Jun", yield: 70 },
      { month: "Jul", yield: 90 },
      { month: "Aug", yield: 70 },
      { month: "Sep", yield: 50 },
      { month: "Oct", yield: 20 },
      { month: "Nov", yield: 0 },
      { month: "Dec", yield: 0 },
    ]
  }
}

export const farmService = new FarmService()

export const getLocalFarms = async () => {
  try {
    const response = await apiClient.get<{ farms: any[] }>("/api/farms?distance=15")
    return response.data?.farms || []
  } catch (error) {
    console.error("Error fetching local farms:", error)
    return []
  }
}
