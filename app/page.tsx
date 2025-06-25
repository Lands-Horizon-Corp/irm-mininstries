import ChurchValues from "@/components/home/church_values"
import ChurchHeroCarousel from "@/components/home/home_hero"

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
  return (
    <div>
      <ChurchHeroCarousel churchCovers={churchCovers} />
      <ChurchValues />
    </div>
  )
}
