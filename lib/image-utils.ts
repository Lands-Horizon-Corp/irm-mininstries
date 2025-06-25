/**
 * Converts a Tigris storage URL to use our image proxy API
 */
export function getProxiedImageUrl(tigrisUrl: string): string {
  try {
    const url = new URL(tigrisUrl)
    const pathParts = url.pathname.split("/").filter(part => part !== "")

    // Extract the key from the URL path
    // URL format: https://fly.storage.tigris.dev/bucket-name/folder/filename
    // or: https://t3.storage.dev/bucket-name/folder/filename

    // For Tigris URLs, the first part after the domain is usually the bucket name
    // Skip the bucket name and get the rest as the key
    if (pathParts.length < 2) {
      console.warn("Invalid Tigris URL format:", tigrisUrl)
      return tigrisUrl // Return original URL as fallback
    }

    // Assume first part is bucket, rest is the key
    const key = pathParts.slice(1).join("/")
    return `/api/images?key=${encodeURIComponent(key)}`
  } catch (error) {
    console.error("Error processing image URL:", error)
    return tigrisUrl // Return original URL as fallback
  }
}

/**
 * Checks if a URL is a Tigris storage URL
 */
export function isTigrisUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return (
      urlObj.hostname === "fly.storage.tigris.dev" ||
      urlObj.hostname === "t3.storage.dev" ||
      urlObj.hostname.includes("tigris") ||
      urlObj.hostname.includes("storage")
    )
  } catch {
    return false
  }
}
