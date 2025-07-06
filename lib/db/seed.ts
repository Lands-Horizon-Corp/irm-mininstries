import { eq } from "drizzle-orm"

import { hashPassword } from "@/lib/auth-utils"
import {
  churchCoverPhotos,
  churchEvents,
  contactUs,
  db,
  ministryRanks,
  ministrySkills,
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

const ministrySkillsSeedData = [
  {
    name: "Preaching",
    description: "Delivering sermons and messages to inspire and teach.",
  },
  {
    name: "Teaching",
    description: "Educating others in biblical truths and Christian living.",
  },
  {
    name: "Planning",
    description: "Organizing ministry events and activities.",
  },
  {
    name: "Administration",
    description: "Managing church operations and resources.",
  },
  {
    name: "Value Formation",
    description: "Instilling Christian values and character.",
  },
  {
    name: "Advocacy",
    description: "Promoting social justice and community welfare.",
  },
  {
    name: "Counseling",
    description: "Providing spiritual and personal guidance.",
  },
  {
    name: "Music Ministry",
    description: "Leading worship through music and song.",
  },
  {
    name: "Youth Ministry",
    description: "Mentoring and guiding young people.",
  },
  {
    name: "Children's Ministry",
    description: "Teaching and caring for children in the church.",
  },
  {
    name: "Evangelism",
    description: "Sharing the gospel and reaching out to the lost.",
  },
  { name: "Discipleship", description: "Helping others grow in their faith." },
  {
    name: "Hospitality",
    description: "Welcoming and serving guests and members.",
  },
  {
    name: "Prayer Ministry",
    description: "Leading and organizing prayer efforts.",
  },
  {
    name: "Media Ministry",
    description: "Managing church communications and technology.",
  },
  {
    name: "Missions",
    description: "Serving in local and global mission fields.",
  },
  {
    name: "Community Service",
    description: "Engaging in outreach and service projects.",
  },
  {
    name: "Event Coordination",
    description: "Planning and executing church events.",
  },
  {
    name: "Small Group Leadership",
    description: "Facilitating small group studies and fellowship.",
  },
  {
    name: "Ushering",
    description: "Assisting with church services and logistics.",
  },
  { name: "Finance", description: "Managing church finances and budgeting." },
  {
    name: "Mentoring",
    description: "Guiding and supporting spiritual growth.",
  },
  {
    name: "Pastoral Care",
    description: "Providing care and support to members.",
  },
  {
    name: "Outreach",
    description: "Connecting with the community and new members.",
  },
  {
    name: "Creative Arts",
    description: "Using art, drama, and creativity in ministry.",
  },
  {
    name: "Technical Support",
    description: "Supporting audio, video, and IT needs.",
  },
  {
    name: "Writing",
    description: "Creating content for church publications and media.",
  },
  {
    name: "Translation",
    description: "Translating materials for multilingual ministry.",
  },
  {
    name: "Logistics",
    description: "Coordinating resources and transportation.",
  },
  {
    name: "Leadership",
    description: "Guiding teams and ministries effectively.",
  },
  {
    name: "Conflict Resolution",
    description: "Mediating and resolving disputes within the church.",
  },
  {
    name: "Fundraising",
    description: "Organizing and leading fundraising efforts.",
  },
  {
    name: "Church Planting",
    description: "Establishing new churches and ministries.",
  },
  {
    name: "Volunteer Coordination",
    description: "Recruiting and managing volunteers.",
  },
  {
    name: "Social Media Management",
    description: "Promoting church activities online.",
  },
  {
    name: "Graphic Design",
    description: "Creating visual content for ministry use.",
  },
  {
    name: "Website Management",
    description: "Maintaining church websites and online presence.",
  },
  {
    name: "Audio/Visual Production",
    description: "Operating sound and video equipment.",
  },
  { name: "Security", description: "Ensuring safety during church events." },
  {
    name: "Facility Management",
    description: "Overseeing church buildings and grounds.",
  },
  {
    name: "Bookkeeping",
    description: "Tracking financial records and transactions.",
  },
  {
    name: "Public Speaking",
    description: "Communicating effectively to groups.",
  },
  {
    name: "Bible Translation",
    description: "Translating scripture into local languages.",
  },
  {
    name: "Church History Teaching",
    description: "Educating about the history of the church.",
  },
  {
    name: "Apologetics",
    description: "Defending the faith through reasoned arguments.",
  },
  {
    name: "Spiritual Direction",
    description: "Guiding others in their spiritual journey.",
  },
  {
    name: "Retreat Leadership",
    description: "Organizing and leading spiritual retreats.",
  },
  {
    name: "Marriage Counseling",
    description: "Supporting couples in their relationships.",
  },
  {
    name: "Crisis Intervention",
    description: "Helping those in urgent need or distress.",
  },
  {
    name: "Elderly Care",
    description: "Ministering to senior members of the church.",
  },
  {
    name: "Disaster Relief",
    description: "Coordinating aid during emergencies.",
  },
  {
    name: "Prison Ministry",
    description: "Serving those who are incarcerated.",
  },
  {
    name: "Hospital Visitation",
    description: "Visiting and praying for the sick.",
  },
  {
    name: "Grief Counseling",
    description: "Supporting those who are grieving.",
  },
  {
    name: "Stewardship",
    description: "Teaching about responsible use of resources.",
  },
  {
    name: "Environmental Stewardship",
    description: "Promoting care for God's creation.",
  },
  {
    name: "Sports Ministry",
    description: "Using sports as a tool for outreach.",
  },
  {
    name: "Drama Ministry",
    description: "Using drama and skits for teaching.",
  },
  { name: "Dance Ministry", description: "Expressing worship through dance." },
  {
    name: "Photography",
    description: "Capturing church events and activities.",
  },
  {
    name: "Video Editing",
    description: "Producing and editing ministry videos.",
  },
  { name: "Podcasting", description: "Creating audio content for ministry." },
  { name: "Newsletter Editing", description: "Producing church newsletters." },
  {
    name: "Resource Development",
    description: "Creating materials for ministry use.",
  },
  {
    name: "Grant Writing",
    description: "Securing funding through grant proposals.",
  },
  {
    name: "Networking",
    description: "Building relationships with other ministries.",
  },
  {
    name: "Partnership Development",
    description: "Forming partnerships for greater impact.",
  },
  {
    name: "Missionary Support",
    description: "Assisting missionaries in the field.",
  },
  {
    name: "Church Governance",
    description: "Participating in church leadership and decision-making.",
  },
  {
    name: "Policy Development",
    description: "Creating policies for church operations.",
  },
  { name: "Risk Management", description: "Identifying and mitigating risks." },
  {
    name: "Legal Compliance",
    description: "Ensuring ministry activities follow laws.",
  },
  {
    name: "Cultural Awareness",
    description: "Understanding and respecting diverse cultures.",
  },
  {
    name: "Language Teaching",
    description: "Teaching languages for ministry outreach.",
  },
  { name: "Intercessory Prayer", description: "Praying on behalf of others." },
  { name: "Church Decor", description: "Beautifying worship spaces." },
  {
    name: "Transportation Coordination",
    description: "Arranging rides for members and events.",
  },
  {
    name: "Food Service",
    description: "Preparing and serving meals for ministry.",
  },
  {
    name: "Child Protection",
    description: "Ensuring safety for children in ministry.",
  },
  {
    name: "Conflict Mediation",
    description: "Helping resolve interpersonal conflicts.",
  },
  {
    name: "Peer Counseling",
    description: "Supporting others through peer relationships.",
  },
  {
    name: "Retreat Planning",
    description: "Organizing spiritual retreats and camps.",
  },
  {
    name: "Resource Management",
    description: "Overseeing ministry resources and supplies.",
  },
  {
    name: "Sponsorship Coordination",
    description: "Managing sponsorship programs.",
  },
  {
    name: "Altar Ministry",
    description: "Serving during altar calls and ministry times.",
  },
  {
    name: "Baptism Preparation",
    description: "Preparing candidates for baptism.",
  },
  {
    name: "Communion Preparation",
    description: "Preparing elements for communion services.",
  },
  {
    name: "Church Announcements",
    description: "Communicating important information to the congregation.",
  },
  {
    name: "Greeting Ministry",
    description: "Welcoming attendees at church services.",
  },
  {
    name: "Follow-up Ministry",
    description: "Connecting with visitors and new members.",
  },
  {
    name: "Bible Storytelling",
    description: "Sharing Bible stories in engaging ways.",
  },
  {
    name: "Faith Sharing",
    description: "Testifying and sharing personal faith stories.",
  },
  {
    name: "Apprenticeship",
    description: "Training others for ministry roles.",
  },
  {
    name: "Church Library Management",
    description: "Organizing and maintaining church libraries.",
  },
  {
    name: "Resource Lending",
    description: "Managing lending of ministry resources.",
  },
  {
    name: "Special Needs Ministry",
    description: "Serving those with special needs.",
  },
  {
    name: "Health Education",
    description: "Promoting health and wellness in the church.",
  },
  {
    name: "First Aid",
    description: "Providing basic medical assistance during events.",
  },
  {
    name: "Emergency Preparedness",
    description: "Planning for emergencies and disasters.",
  },
  {
    name: "Community Networking",
    description: "Connecting with local organizations and leaders.",
  },
  {
    name: "Church Cleaning",
    description: "Maintaining cleanliness of church facilities.",
  },
  {
    name: "Gardening Ministry",
    description: "Caring for church gardens and landscaping.",
  },
  {
    name: "Sermon Illustration",
    description: "Creating visuals and props for sermons.",
  },
  {
    name: "Banner Making",
    description: "Designing and creating banners for events.",
  },
  {
    name: "Fund Distribution",
    description: "Allocating funds for ministry needs.",
  },
  {
    name: "Church Inventory",
    description: "Tracking church assets and supplies.",
  },
  {
    name: "Ministry Evaluation",
    description: "Assessing effectiveness of ministry programs.",
  },
  {
    name: "Vision Casting",
    description: "Communicating and inspiring vision for ministry.",
  },
  {
    name: "Team Building",
    description: "Fostering unity and collaboration among teams.",
  },
  {
    name: "Time Management",
    description: "Helping others use time wisely for ministry.",
  },
  {
    name: "Personal Development",
    description: "Encouraging growth in skills and character.",
  },
  {
    name: "Church Branding",
    description: "Developing and maintaining church identity.",
  },
  {
    name: "Public Relations",
    description: "Managing the church's public image.",
  },
  {
    name: "Community Research",
    description: "Studying community needs for outreach.",
  },
  {
    name: "Needs Assessment",
    description: "Identifying needs within the church and community.",
  },
  {
    name: "Church Policy Teaching",
    description: "Educating members about church policies.",
  },
  {
    name: "Ministry Documentation",
    description: "Keeping records of ministry activities.",
  },
  {
    name: "Annual Reporting",
    description: "Preparing yearly reports for the church.",
  },
  {
    name: "Church Anniversary Planning",
    description: "Organizing anniversary celebrations.",
  },
  {
    name: "Special Event Planning",
    description: "Coordinating unique and seasonal events.",
  },
  {
    name: "Church History Documentation",
    description: "Recording the history of the church.",
  },
  {
    name: "Ministry Networking",
    description: "Connecting with other ministries for collaboration.",
  },
  {
    name: "Church Policy Review",
    description: "Reviewing and updating church policies.",
  },
  {
    name: "Ministry Research",
    description: "Studying best practices for ministry.",
  },
  {
    name: "Church Growth Strategies",
    description: "Developing plans for church growth.",
  },
  {
    name: "Church Safety",
    description: "Implementing safety protocols for all activities.",
  },
  {
    name: "Ministry Innovation",
    description: "Introducing new ideas and methods in ministry.",
  },
  {
    name: "Digital Ministry",
    description:
      "Using online platforms to reach and minister to people virtually.",
  },
  {
    name: "Intercultural Ministry",
    description:
      "Engaging and serving diverse cultural groups within the church and community.",
  },
  {
    name: "Volunteer Training",
    description:
      "Educating and equipping volunteers to serve effectively in ministry.",
  },
  {
    name: "Church Health Assessment",
    description:
      "Evaluating the spiritual and organizational health of the church.",
  },
  {
    name: "Public Relations Management",
    description:
      "Managing media relations and public perception of the church.",
  },
  {
    name: "Christian Counseling Certification",
    description:
      "Offering counseling based on Christian principles, with certifications for professional support.",
  },
  {
    name: "Community Engagement",
    description:
      "Building relationships and partnerships with local organizations for the church’s outreach.",
  },
  {
    name: "Crisis Communication",
    description:
      "Effectively communicating with the congregation during crises or emergencies.",
  },
  {
    name: "Church Planting Support",
    description:
      "Providing support, training, and resources to individuals or teams planting new churches.",
  },
  {
    name: "Grief Support Ministry",
    description:
      "Offering comfort and support to individuals navigating loss and grief.",
  },
  {
    name: "Biblical Research",
    description:
      "Conducting deep biblical research for sermon preparation and study groups.",
  },
  {
    name: "Leadership Development",
    description:
      "Developing leadership skills and mentoring leaders within the church.",
  },
  {
    name: "Bible Quiz Ministry",
    description:
      "Organizing Bible trivia or quiz events to promote Bible literacy in the church.",
  },
  {
    name: "Health and Wellness Ministry",
    description:
      "Providing resources and programs focused on mental, emotional, and physical health.",
  },
  {
    name: "Community Outreach Strategy",
    description:
      "Developing and executing effective community outreach programs.",
  },
  {
    name: "Spiritual Gift Assessment",
    description:
      "Helping individuals identify their spiritual gifts and how they can be used in ministry.",
  },
  {
    name: "Church Media Outreach",
    description:
      "Managing media outreach for the church through various platforms (TV, radio, YouTube, etc.).",
  },
  {
    name: "Sustainable Ministry Practices",
    description:
      "Incorporating environmentally and financially sustainable practices into ministry operations.",
  },
  {
    name: "Conflict Prevention",
    description:
      "Implementing strategies to prevent conflicts within ministry teams and the church.",
  },
  {
    name: "Multi-Site Ministry",
    description:
      "Managing ministry across multiple church locations or campuses.",
  },
  {
    name: "Discipleship Curriculum Development",
    description:
      "Creating and adapting curriculum for discipleship programs for all age groups.",
  },
  {
    name: "Apologetics Ministry",
    description:
      "Training and preparing individuals to defend the Christian faith in conversations and debates.",
  },
  {
    name: "Church Security Planning",
    description:
      "Developing strategies to keep members safe during church services and events.",
  },
  {
    name: "Global Mission Strategy",
    description:
      "Developing strategies for international missions and supporting global missionaries.",
  },
  {
    name: "Church Leadership Succession Planning",
    description: "Preparing and mentoring future leaders for church positions.",
  },
  {
    name: "Marriage and Family Ministry",
    description:
      "Providing support for families and couples through counseling, retreats, and programs.",
  },
  {
    name: "Spiritual Mentoring",
    description:
      "Providing one-on-one spiritual mentoring to individuals in need of guidance.",
  },
  {
    name: "Fellowship Events",
    description:
      "Organizing and coordinating social events that foster community and relationships in the church.",
  },
  {
    name: "Social Justice Advocacy",
    description:
      "Promoting the church’s role in advocating for social justice issues.",
  },
  {
    name: "Church Development Consulting",
    description:
      "Offering expertise and advice to churches seeking to improve or expand their ministries.",
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

    // Seed ministry skills
    const existingSkills = await db.select().from(ministrySkills).limit(1)
    if (existingSkills.length === 0) {
      await db.insert(ministrySkills).values(ministrySkillsSeedData)
      console.log("🛠️ Ministry skills seeded successfully!")
    } else {
      console.log("🛠️ Ministry skills already exist, skipping...")
    }

    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seed()
