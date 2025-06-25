import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"

import { s3Client, STORAGE_CONFIG } from "@/lib/s3-client"
import { UploadSecurity } from "@/lib/upload-security"
import {
  generateSecureFileName,
  sanitizeFileName,
  validateFileSize,
  validateFileType,
} from "@/lib/upload-utils"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    // Security validation
    const securityCheck = UploadSecurity.validateRequest(request, {
      maxFileSize: STORAGE_CONFIG.maxSize,
      allowedTypes: STORAGE_CONFIG.allowedTypes,
      rateLimitPerMinute: 10, // 10 uploads per minute per IP
    })

    if (!securityCheck.valid) {
      return NextResponse.json({ error: securityCheck.error }, { status: 429 })
    }

    // Check content type
    const contentType = request.headers.get("content-type")
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content type must be multipart/form-data" },
        { status: 400 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Additional file validation using security middleware
    const fileValidation = UploadSecurity.validateFile(file, {
      maxFileSize: STORAGE_CONFIG.maxSize,
      allowedTypes: STORAGE_CONFIG.allowedTypes,
      rateLimitPerMinute: 10,
    })

    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 })
    }

    // Validate file type
    if (!validateFileType(file, STORAGE_CONFIG.allowedTypes)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      )
    }

    // Validate file size
    if (!validateFileSize(file, STORAGE_CONFIG.maxSize)) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum limit of ${STORAGE_CONFIG.maxSize} bytes`,
        },
        { status: 400 }
      )
    }

    // Generate secure file name
    const sanitizedOriginalName = UploadSecurity.sanitizeFileName(file.name)
    const secureFileName = generateSecureFileName(sanitizedOriginalName)
    const key = `${sanitizeFileName(folder)}/${secureFileName}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: STORAGE_CONFIG.bucket,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      Metadata: {
        originalName: sanitizedOriginalName,
        uploadedAt: new Date().toISOString(),
        securityChecked: "true",
      },
    })

    await s3Client.send(uploadCommand)

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        key,
        fileName: secureFileName,
        originalName: sanitizedOriginalName,
        size: file.size,
        type: file.type,
        url: `https://${process.env.STORAGE_URL}/${STORAGE_CONFIG.bucket}/${key}`,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: "Upload endpoint is running",
    maxSize: STORAGE_CONFIG.maxSize,
    allowedTypes: STORAGE_CONFIG.allowedTypes,
  })
}
