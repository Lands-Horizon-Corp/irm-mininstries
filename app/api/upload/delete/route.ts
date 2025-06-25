import { NextRequest, NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { s3Client, STORAGE_CONFIG } from "@/lib/s3-client"

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      )
    }

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: STORAGE_CONFIG.bucket,
      Key: key,
    })

    await s3Client.send(deleteCommand)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Delete endpoint is running",
  })
}
