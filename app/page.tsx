import { Toaster } from "sonner"

import { churchCoverPhotos, db } from "@/lib/db"
import ChurchValues from "@/components/home/church_values"
import ChurchHeroCarousel from "@/components/home/home_hero"

async function getChurchCovers() {
  try {
    const covers = await db.select().from(churchCoverPhotos)
    return covers.length > 0 ? covers : []
  } catch (error) {
    console.log("Database not accessible, using fallback data:", error)
    return []
  }
}

export default async function Home() {
  const churchCovers = await getChurchCovers()

  return (
    <div>
      <ChurchHeroCarousel churchCovers={churchCovers} />
      <ChurchValues />
      <Toaster />
    </div>
  )
}
