import type { NewChurch } from "@/modules/church/church-schema";
import churchesJsonData from "./churches-clean.json";

// Convert JSON data to NewChurch format with proper type safety
export const churchesSeedData: NewChurch[] = churchesJsonData
  .filter(
    (church): church is typeof church & { name: string } =>
      typeof church.name === "string" && church.name.trim().length > 0
  )
  .map((church) => ({
    name: church.name,
    imageUrl: church.imageUrl || undefined,
    longitude: church.longitude || undefined,
    latitude: church.latitude || undefined,
    address: church.address || undefined,
    email: church.email || undefined,
    description: church.description || undefined,
    link: church.link || undefined,
  }));

// Statistics about the imported data (488 churches total from scraper)
// Churches with images: ~50+ (from the scraper with resolved URLs)
// Churches with addresses: ~488 (extracted from church names)
