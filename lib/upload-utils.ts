import crypto from "crypto"

export function generateSecureFileName(originalName: string): string {
  const ext = originalName.split(".").pop()
  const timestamp = Date.now()
  const randomBytes = crypto.randomBytes(16).toString("hex")
  return `${timestamp}-${randomBytes}.${ext}`
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

export function sanitizeFileName(fileName: string): string {
  // Remove any path traversal attempts and special characters
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.+/g, ".")
    .replace(/^\./, "")
    .substring(0, 255)
}

export function generateUploadToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
