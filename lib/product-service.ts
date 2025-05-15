import { apiClient } from "./api-client"

export type Product = {
  id: string
  name: string
  description?: string
  price: number
  unit: string
  farmId: string
  farmName: string
  image: string
  organic: boolean
  category?: string
  available?: boolean
  availableDate?: string
  quantity?: number
  featured?: boolean
}

export type ProductFilters = {
  category?: string
  organic?: boolean
  farmId?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  search?: string
  availability?: string
}

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    console.log("Fetching products with filters:", filters)

    let endpoint = "/api/products"
    if (filters) {
      const params = new URLSearchParams()

      if (filters.category) params.append("category", filters.category)
      if (filters.organic !== undefined) params.append("organic", filters.organic.toString())
      if (filters.farmId) params.append("farmId", filters.farmId)
      if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString())
      if (filters.featured !== undefined) params.append("featured", filters.featured.toString())
      if (filters.search) params.append("search", filters.search)
      if (filters.availability) params.append("availability", filters.availability)

      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }

    try {
      const response = await apiClient.get<{ products: Product[] }>(endpoint)
      return response.data?.products || []
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    console.log(`Fetching product: ${id}`)
    try {
      const response = await apiClient.get<{ product: Product }>(`/api/products/${id}`)
      return response.data?.product || null
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product | null> {
    console.log("Creating product:", product)
    try {
      const response = await apiClient.post<{ product: Product }>("/api/products", product)
      return response.data?.product || null
    } catch (error) {
      console.error("Error creating product:", error)
      return null
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    console.log(`Updating product: ${id}`, product)
    try {
      const response = await apiClient.put<{ product: Product }>(`/api/products/${id}`, product)
      return response.data?.product || null
    } catch (error) {
      console.error("Error updating product:", error)
      return null
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    console.log(`Deleting product: ${id}`)
    try {
      const response = await apiClient.delete(`/api/products/${id}`)
      return response.status === 200
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    console.log("Fetching featured products")
    return this.getProducts({ featured: true })
  }

  async getProductsByFarm(farmId: string): Promise<Product[]> {
    console.log(`Fetching products for farm: ${farmId}`)
    return this.getProducts({ farmId })
  }

  async searchProducts(query: string): Promise<Product[]> {
    console.log(`Searching products: ${query}`)
    return this.getProducts({ search: query })
  }

  async getCategories(): Promise<string[]> {
    console.log("Fetching product categories")
    try {
      const response = await apiClient.get<{ categories: string[] }>("/api/categories")
      return response.data?.categories || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  }
}

export const productService = new ProductService()
