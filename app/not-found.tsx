import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9f5] p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#2c5d34] mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-[#2c5d34] hover:bg-[#1e3f24]">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline" className="border-[#2c5d34] text-[#2c5d34]">
          <Link href="/market">Browse Market</Link>
        </Button>
      </div>
    </div>
  )
}
