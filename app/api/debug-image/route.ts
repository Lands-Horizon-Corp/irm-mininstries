import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const testUrl = searchParams.get("url")

  if (!testUrl) {
    return NextResponse.json({
      message: "Image debug endpoint",
      usage: "Add ?url=<image-url> to test URL parsing",
      example:
        "/api/debug-image?url=https://fly.storage.tigris.dev/irm-ministries/uploads/test.jpg",
    })
  }

  try {
    const url = new URL(testUrl)
    const pathParts = url.pathname.split("/").filter(part => part !== "")

    return NextResponse.json({
      originalUrl: testUrl,
      hostname: url.hostname,
      pathname: url.pathname,
      pathParts,
      extractedKey:
        pathParts.length > 1
          ? pathParts.slice(1).join("/")
          : "Could not extract key",
      proxyUrl: `/api/images?key=${encodeURIComponent(pathParts.slice(1).join("/"))}`,
      env: {
        storageUrl: process.env.STORAGE_URL,
        storageBucket: process.env.STORAGE_BUCKET,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    )
  }
}
