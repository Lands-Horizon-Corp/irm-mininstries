import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"

import { s3Client, STORAGE_CONFIG } from "@/lib/s3-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json(
        { error: "Missing key parameter" },
        { status: 400 }
      )
    }

    console.log("Fetching image with key:", key)
    console.log("Using bucket:", STORAGE_CONFIG.bucket)

    // Get the object from S3/Tigris
    const command = new GetObjectCommand({
      Bucket: STORAGE_CONFIG.bucket,
      Key: key,
    })

    const response = await s3Client.send(command)

    if (!response.Body) {
      console.error("Object not found for key:", key)
      return NextResponse.json({ error: "Object not found" }, { status: 404 })
    }

    // Convert the stream to a buffer
    const chunks: Uint8Array[] = []
    const reader = response.Body.transformToWebStream().getReader()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }

    const buffer = Buffer.concat(chunks)

    // Return the image with proper headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return NextResponse.json(
      {
        error: "Failed to serve image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
