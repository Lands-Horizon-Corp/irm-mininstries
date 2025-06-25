import { eq } from "drizzle-orm"

import { hashPassword } from "@/lib/auth-utils"
import { churchCoverPhotos, db, users } from "@/lib/db"

const seedData = [
  {
    name: "Grace Community Church",
    description:
      "A place where faith meets community, and hearts find their home in God's love.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "New Life Fellowship",
    description:
      "Transforming lives through the power of Christ and building lasting relationships.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "Hope Baptist Church",
    description:
      "Spreading hope and joy through worship, service, and fellowship in our community.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "Trinity Methodist Church",
    description:
      "United in faith, strengthened by tradition, and committed to serving others.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    name: "Cornerstone Assembly",
    description:
      "Building lives on the solid foundation of Christ's love and teachings.",
    coverImage: "/placeholder.svg?height=1080&width=1920",
  },
]

async function seed() {
  try {
    console.log("🌱 Seeding database...")

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required"
      )
    }

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1)

    if (existingAdmin.length === 0) {
      const hashedPassword = await hashPassword(adminPassword)

      await db.insert(users).values({
        email: adminEmail,
        contactNumber: "000-000-0000", // Default contact number, can be updated later
        password: hashedPassword,
        role: "admin",
      })

      console.log("👤 Admin user created successfully!")
    } else {
      console.log("👤 Admin user already exists, skipping...")
    }
    await db.insert(churchCoverPhotos).values(seedData)
    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seed()
