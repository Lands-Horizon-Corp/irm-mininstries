import { Suspense } from "react"
import { Toaster } from "sonner"

import ChurchValues from "@/components/home/church_values"
import ChurchHeroCarousel from "@/components/home/home_hero"

// Uncomment the line below to add file upload to your home page
// import FileUpload from "@/components/ui/file-upload"

// Sample data - replace with your actual data
const churchCovers = [
  {
    name: "Grace Community Church",
    description:
      "A place where faith meets community, and hearts find their home in God's love.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "New Life Fellowship",
    description:
      "Transforming lives through the power of Christ and building lasting relationships.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "Hope Baptist Church",
    description:
      "Spreading hope and joy through worship, service, and fellowship in our community.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "Trinity Methodist Church",
    description:
      "United in faith, strengthened by tradition, and committed to serving others.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "Cornerstone Assembly",
    description:
      "Building lives on the solid foundation of Christ's love and teachings.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
]

export default function Home() {
  // Example function to handle file uploads
  // const handleFileUpload = (files: any[]) => {
  //   console.log("Files uploaded successfully:", files)
  //   // Handle uploaded files here - maybe save to database
  // }

  return (
    <div>
      <Suspense>
        <ChurchHeroCarousel churchCovers={churchCovers} />
        <ChurchValues />

        {/* Uncomment to add file upload functionality to your home page */}
        {/* 
        <div className="container mx-auto p-6 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Upload Church Photos</h2>
          <FileUpload
            folder="church-photos"
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            onUploadSuccess={handleFileUpload}
            onUploadError={(error) => console.error("Upload error:", error)}
          />
        </div>
        */}

        <Toaster />
      </Suspense>
    </div>
  )
}
