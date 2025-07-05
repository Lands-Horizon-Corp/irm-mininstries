import { eq } from "drizzle-orm"

import { hashPassword } from "@/lib/auth-utils"
import {
  churchCoverPhotos,
  churchEvents,
  contactUs,
  db,
  ministryRanks,
  users,
} from "@/lib/db"

const eventSeedData = [
  {
    name: "Sunday Morning Worship",
    description:
      "Join us for our weekly worship service with inspiring music, prayer, and biblical teaching.",
    place: "Main Sanctuary",
    datetime: new Date("2025-01-05T10:00:00"),
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    name: "Youth Group Meeting",
    description:
      "Weekly fellowship and bible study for teens and young adults.",
    place: "Youth Center",
    datetime: new Date("2025-01-08T19:00:00"),
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    name: "Community Outreach Day",
    description:
      "Join us as we serve our local community through food distribution and volunteer work.",
    place: "Community Center",
    datetime: new Date("2025-01-11T09:00:00"),
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    name: "Bible Study Group",
    description:
      "Deep dive into God's word with fellow believers in an intimate small group setting.",
    place: "Fellowship Hall",
    datetime: new Date("2025-01-15T18:30:00"),
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    name: "Prayer and Worship Night",
    description:
      "An evening dedicated to worship, prayer, and seeking God's presence together.",
    place: "Main Sanctuary",
    datetime: new Date("2025-01-18T19:30:00"),
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
]

const contactUsSeedData = [
  {
    name: "John Doe",
    email: "john@example.com",
    contactNumber: "+1234567890",
    description: "Interested in learning more about your ministry.",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    contactNumber: "+1987654321",
    description: "Would like to volunteer for upcoming events.",
  },
]

const ministryRanksSeedData = [
  {
    name: "Volunteer Worker / M.T./ GNMB",
    description:
      "Volunteer Worker, M.T. (Missionary Trainee), or GNMB (General National Missionary Board) rank in ministry experience.",
  },
  {
    name: "Missionary",
    description: "Missionary rank in ministry experience.",
  },
  {
    name: "Pastor / Deaconess (Probationary)",
    description:
      "Probationary Pastor or Deaconess rank in ministry experience.",
  },
  {
    name: "Ordained Pastor / Ordained Deaconess",
    description:
      "Ordained Pastor or Ordained Deaconess rank in ministry experience.",
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
        contactNumber: "000-000-0000",
        password: hashedPassword,
        role: "admin",
      })

      console.log("👤 Admin user created successfully!")
    } else {
      console.log("👤 Admin user already exists, skipping...")
    }

    // Seed church covers
    const existingCovers = await db.select().from(churchCoverPhotos).limit(1)
    if (existingCovers.length === 0) {
      // Skipping seeding church covers because coverImage is required but not present in seedData
      console.log(
        "🖼️ Skipping church covers seeding: coverImage required in schema."
      )
    } else {
      console.log("🖼️ Church covers already exist, skipping...")
    }

    // Seed church events
    const existingEvents = await db.select().from(churchEvents).limit(1)
    if (existingEvents.length === 0) {
      await db.insert(churchEvents).values(eventSeedData)
      console.log("📅 Church events seeded successfully!")
    } else {
      console.log("📅 Church events already exist, skipping...")
    }

    // Seed contact_us
    for (const contact of contactUsSeedData) {
      await db.insert(contactUs).values(contact)
    }
    console.log("📞 Contact us data seeded successfully!")

    // Seed ministry ranks
    const existingRanks = await db.select().from(ministryRanks).limit(1)
    if (existingRanks.length === 0) {
      await db.insert(ministryRanks).values(ministryRanksSeedData)
      console.log("🏅 Ministry ranks seeded successfully!")
    } else {
      console.log("🏅 Ministry ranks already exist, skipping...")
    }

    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seed()
