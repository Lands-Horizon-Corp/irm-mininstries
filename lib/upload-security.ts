import { NextRequest } from "next/server"

export interface SecurityConfig {
  maxFileSize: number
  allowedTypes: string[]
  rateLimitPerMinute: number
  requireAuth?: boolean
}

export class UploadSecurity {
  private static uploadCounts = new Map<
    string,
    { count: number; resetTime: number }
  >()

  static validateRequest(
    request: NextRequest,
    config: SecurityConfig
  ): { valid: boolean; error?: string } {
    // Rate limiting based on IP
    const ip = this.getClientIP(request)
    const now = Date.now()
    const minute = Math.floor(now / 60000)

    const key = `${ip}-${minute}`
    const current = this.uploadCounts.get(key) || {
      count: 0,
      resetTime: now + 60000,
    }

    if (current.count >= config.rateLimitPerMinute) {
      return {
        valid: false,
        error: "Rate limit exceeded. Please try again later.",
      }
    }

    // Update count
    this.uploadCounts.set(key, { ...current, count: current.count + 1 })

    // Clean up old entries
    this.cleanupOldEntries(now)

    return { valid: true }
  }

  static validateFile(
    file: File,
    config: SecurityConfig
  ): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum limit of ${this.formatFileSize(config.maxFileSize)}`,
      }
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      }
    }

    // Check for suspicious file names
    if (this.hasSuspiciousFileName(file.name)) {
      return {
        valid: false,
        error: "File name contains invalid characters",
      }
    }

    return { valid: true }
  }

  static sanitizeFileName(fileName: string): string {
    // Remove path traversal attempts and dangerous characters
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/\.+/g, ".")
      .replace(/^\./, "")
      .substring(0, 255)
  }

  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return "unknown"
  }

  private static hasSuspiciousFileName(fileName: string): boolean {
    const suspiciousPatterns = [
      /\.\./, // Path traversal
      /\/|\\|\|/, // Path separators and pipes
      /<|>|\|/, // Redirection operators
      /\$\(|\`/, // Command substitution
      /\.php$|\.asp$|\.jsp$|\.exe$|\.bat$|\.sh$/i, // Executable extensions
    ]

    return suspiciousPatterns.some(pattern => pattern.test(fileName))
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  private static cleanupOldEntries(now: number): void {
    const cutoff = now - 120000 // Keep entries for 2 minutes
    for (const [key, value] of this.uploadCounts.entries()) {
      if (value.resetTime < cutoff) {
        this.uploadCounts.delete(key)
      }
    }
  }
}
