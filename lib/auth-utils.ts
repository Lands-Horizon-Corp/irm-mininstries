import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export interface UserPayload {
  id: number
  email: string
  role: string
}

/**
 * Hash a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns Promise<boolean> - Whether the password matches the hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 * @param payload - User data to include in the token
 * @returns string - The JWT token
 */
export function generateToken(payload: UserPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required")
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d", // Token expires in 7 days
  })
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns UserPayload | null - The decoded user data or null if invalid
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is required")
    }

    const decoded = jwt.verify(token, secret) as UserPayload
    return decoded
  } catch {
    return null
  }
}
