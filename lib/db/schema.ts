import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  contactNumber: text("contact_number").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const churchCoverPhotos = pgTable("church_cover_photos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const churchEvents = pgTable("church_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  place: text("place").notNull(),
  datetime: timestamp("datetime").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const churchLocations = pgTable("church_locations", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  longitude: text("longitude").notNull(),
  latitude: text("latitude").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const contactUs = pgTable("contact_us", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const ministryRanks = pgTable("ministry_ranks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const ministrySkills = pgTable("ministry_skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const genderEnum = text("gender", { enum: ["male", "female"] })
export const civilStatusEnum = text("civil_status", {
  enum: ["single", "married", "widowed", "separated", "divorced"],
})

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  suffix: text("suffix"),
  nickname: text("nickname"),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  address: text("address").notNull(),
  gender: genderEnum.notNull(),
  heightFeet: text("height_feet").notNull(),
  weightKg: text("weight_kg").notNull(),
  civilStatus: civilStatusEnum.notNull(),
  email: text("email"),
  telephone: text("telephone"),
  passportNumber: text("passport_number"),
  sssNumber: text("sss_number"),
  philhealth: text("philhealth"),
  tin: text("tin"),
  presentAddress: text("present_address").notNull(),
  permanentAddress: text("permanent_address"),

  // Family info
  fatherName: text("father_name").notNull(),
  fatherProvince: text("father_province").notNull(),
  fatherBirthday: timestamp("father_birthday").notNull(),
  fatherOccupation: text("father_occupation").notNull(),
  motherName: text("mother_name").notNull(),
  motherProvince: text("mother_province").notNull(),
  motherBirthday: timestamp("mother_birthday").notNull(),
  motherOccupation: text("mother_occupation").notNull(),
  spouseName: text("spouse_name"),
  spouseProvince: text("spouse_province"),
  spouseBirthday: timestamp("spouse_birthday"),
  spouseOccupation: text("spouse_occupation"),
  weddingDate: timestamp("wedding_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Additional fields
  skills: text("skills"),
  hobbies: text("hobbies"),
  sports: text("sports"),
  otherReligiousSecularTraining: text("other_religious_secular_training"),
  certifiedBy: text("certified_by"),
  signatureImageUrl: text("signature_image_url"),
  signatureByCertifiedImageUrl: text("signature_by_certified_image_url"),
  imageUrl: text("image_url"),
})

export const memberChildren = pgTable("member_children", {
  id: serial("id").primaryKey(),
  memberId: serial("member_id")
    .notNull()
    .references(() => members.id),
  name: text("name").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: genderEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const memberEmergencyContacts = pgTable("member_emergency_contacts", {
  id: serial("id").primaryKey(),
  memberId: serial("member_id")
    .notNull()
    .references(() => members.id),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const memberEducationBackgrounds = pgTable(
  "member_education_backgrounds",
  {
    id: serial("id").primaryKey(),
    memberId: serial("member_id")
      .notNull()
      .references(() => members.id),
    schoolName: text("school_name").notNull(),
    educationalAttainment: text("educational_attainment").notNull(),
    dateGraduated: timestamp("date_graduated"),
    description: text("description"),
    course: text("course"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
)

export const memberMinistryExperiences = pgTable(
  "member_ministry_experiences",
  {
    id: serial("id").primaryKey(),
    memberId: serial("member_id")
      .notNull()
      .references(() => members.id),
    title: text("title").notNull(),
    description: text("description"),
    fromYear: text("from_year").notNull(),
    toYear: text("to_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
)

export const memberMinistrySkills = pgTable("member_ministry_skills", {
  id: serial("id").primaryKey(),
  memberId: serial("member_id")
    .notNull()
    .references(() => members.id),
  ministrySkillId: serial("ministry_skill_id")
    .notNull()
    .references(() => ministrySkills.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const memberMinistryRecords = pgTable("member_ministry_records", {
  id: serial("id").primaryKey(),
  memberId: serial("member_id")
    .notNull()
    .references(() => members.id),
  churchLocationId: serial("church_location_id")
    .notNull()
    .references(() => churchLocations.id),
  fromYear: text("from_year").notNull(),
  toYear: text("to_year"),
  contribution: text("contribution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const memberAwardsRecognitions = pgTable("member_awards_recognitions", {
  id: serial("id").primaryKey(),
  memberId: serial("member_id")
    .notNull()
    .references(() => members.id),
  year: text("year").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const memberEmploymentRecords = pgTable("member_employment_records", {
  id: serial("id").primaryKey(),
  memberId: serial("member_id")
    .notNull()
    .references(() => members.id),
  companyName: text("company_name").notNull(),
  fromYear: text("from_year").notNull(),
  toYear: text("to_year"),
  position: text("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const memberSeminarsConferences = pgTable(
  "member_seminars_conferences",
  {
    id: serial("id").primaryKey(),
    memberId: serial("member_id")
      .notNull()
      .references(() => members.id),
    title: text("title").notNull(),
    description: text("description"),
    place: text("place"),
    year: text("year").notNull(),
    numberOfHours: serial("number_of_hours").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
)
