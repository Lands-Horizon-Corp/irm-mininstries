import { S3Client } from "@aws-sdk/client-s3"

// S3 client configuration for Tigris
export const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || "auto",
  endpoint: `https://${process.env.STORAGE_URL}`,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for Tigris
})

export const STORAGE_CONFIG = {
  bucket: process.env.STORAGE_BUCKET!,
  maxSize: parseInt(process.env.STORAGE_MAX_SIZE || "1000000000"),
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
}
