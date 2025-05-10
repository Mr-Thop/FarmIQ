"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"

export type FilterState = {
  categories: string[]
  priceRange: [number, number]
  distance: number
  availability: string
  organic: boolean
  sortBy: string
}

interface ProductFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  applyFilters: () => void
  resetFilters: () => void
  className?: string
}

export default function ProductFilters({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
  className,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, categories: [...filters.categories, category] })
    } else {
      setFilters({
        ...filters,
        categories: filters.categories.filter((c) => c !== category),
      })
    }
  }

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleDistanceChange = (value: number[]) => {
    setFilters({ ...filters, distance: value[0] })
  }

  const handleAvailabilityChange = (value: string) => {
    setFilters({ ...filters, availability: value })
  }

  const handleOrganicChange = (checked: boolean) => {
    setFilters({ ...filters, organic: checked })
  }

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value })
  }

  const handleApply = () => {
    applyFilters()
    setIsOpen(false)
  }

  const handleReset = () => {
    resetFilters()
  }

  // Categories for filtering
  const categories = [
    { id: "vegetables", label: "Vegetables" },
    { id: "fruits", label: "Fruits" },
    { id: "dairy", label: "Dairy & Eggs" },
    { id: "meat", label: "Meat & Poultry" },
    { id: "honey", label: "Honey & Preserves" },
    { id: "herbs", label: "Herbs & Spices" },
  ]

  // Sorting options
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "distance", label: "Distance" },
    { value: "rating", label: "Rating" },
  ]

  // Mobile filter sheet
  const mobileFilters = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden border-[#d8e6c0]">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>Narrow down products to find exactly what you need</SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`mobile-category-${category.id}`}>{category.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                max={50}
                step={1}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Distance */}
          <div>
            <h3 className="font-medium mb-3">Distance (miles)</h3>
            <div className="px-2">
              <Slider defaultValue={[filters.distance]} max={50} step={5} onValueChange={handleDistanceChange} />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>0 miles</span>
                <span>{filters.distance} miles</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div>
            <h3 className="font-medium mb-3">Availability</h3>
            <RadioGroup value={filters.availability} onValueChange={handleAvailabilityChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="mobile-availability-all" />
                <Label htmlFor="mobile-availability-all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="available-now" id="mobile-availability-now" />
                <Label htmlFor="mobile-availability-now">Available Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pre-order" id="mobile-availability-preorder" />
                <Label htmlFor="mobile-availability-preorder">Pre-order</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Organic */}
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile-organic"
                checked={filters.organic}
                onCheckedChange={(checked) => handleOrganicChange(checked as boolean)}
              />
              <Label htmlFor="mobile-organic">Organic Products Only</Label>
            </div>
          </div>

          <Separator />

          {/* Sort By */}
          <div>
            <h3 className="font-medium mb-3">Sort By</h3>
            <RadioGroup value={filters.sortBy} onValueChange={handleSortChange} className="space-y-2">
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mobile-sort-${option.value}`} />
                  <Label htmlFor={`mobile-sort-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset
          </Button>
          <Button onClick={handleApply} className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

  // Desktop filters
  const desktopFilters = (
    <div className={`hidden md:block space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-[#2c5d34]">
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Price Range</h4>
        <div className="px-2">
          <Slider
            defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
            max={50}
            step={1}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Distance */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Distance (miles)</h4>
        <div className="px-2">
          <Slider defaultValue={[filters.distance]} max={50} step={5} onValueChange={handleDistanceChange} />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>0 miles</span>
            <span>{filters.distance} miles</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Availability</h4>
        <RadioGroup value={filters.availability} onValueChange={handleAvailabilityChange} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="availability-all" />
            <Label htmlFor="availability-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="available-now" id="availability-now" />
            <Label htmlFor="availability-now">Available Now</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pre-order" id="availability-preorder" />
            <Label htmlFor="availability-preorder">Pre-order</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Organic */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="organic"
            checked={filters.organic}
            onCheckedChange={(checked) => handleOrganicChange(checked as boolean)}
          />
          <Label htmlFor="organic">Organic Products Only</Label>
        </div>
      </div>

      <Separator />

      {/* Sort By */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Sort By</h4>
        <RadioGroup value={filters.sortBy} onValueChange={handleSortChange} className="space-y-2">
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
              <Label htmlFor={`sort-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button onClick={applyFilters} className="w-full mt-4 bg-[#2c5d34] hover:bg-[#1e3f24]">
        Apply Filters
      </Button>
    </div>
  )

  return (
    <>
      {mobileFilters}
      {desktopFilters}
    </>
  )
}
