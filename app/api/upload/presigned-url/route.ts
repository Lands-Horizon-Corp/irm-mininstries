import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { s3Client, STORAGE_CONFIG } from "@/lib/s3-client"

export async function POST(request: NextRequest) {
  try {
    const { key, expiresIn = 3600 } = await request.json()

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      )
    }

    // Validate expiration time (max 24 hours)
    const maxExpirationTime = 24 * 60 * 60 // 24 hours in seconds
    const expirationTime = Math.min(expiresIn, maxExpirationTime)

    // Generate presigned URL
    const command = new GetObjectCommand({
      Bucket: STORAGE_CONFIG.bucket,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expirationTime,
    })

    return NextResponse.json({
      success: true,
      data: {
        url: signedUrl,
        expiresIn: expirationTime,
        expiresAt: new Date(Date.now() + expirationTime * 1000).toISOString(),
      },
    })
  } catch (error) {
    console.error("Presigned URL error:", error)
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Presigned URL endpoint is running",
    maxExpirationTime: "24 hours",
  })
}
