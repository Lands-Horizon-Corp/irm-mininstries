import { eq } from "drizzle-orm"

import { db } from "./db"
import {
  memberAwardsRecognitions,
  memberChildren,
  memberEducationBackgrounds,
  memberEmergencyContacts,
  memberEmploymentRecords,
  memberMinistryExperiences,
  memberMinistryRecords,
  memberMinistrySkills,
  members,
  memberSeminarsConferences,
} from "./db/schema"
import { Member, memberSchema } from "./member-schema"

export const memberService = {
  async getAll() {
    return db.select().from(members)
  },

  async getById(id: number) {
    const result = await db.select().from(members).where(eq(members.id, id))
    return result[0] || null
  },

  async create(data: Omit<Member, "id" | "createdAt" | "updatedAt">) {
    // Extract nested arrays
    const {
      children = [],
      emergencyContacts = [],
      educationBackgrounds = [],
      ministryExperiences = [],
      ministrySkills = [],
      ministryRecords = [],
      awardsRecognitions = [],
      employmentRecords = [],
      seminarsConferences = [],
      ...memberData
    } = data

    // Validate member data only
    const parsed = memberSchema
      .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        children: true,
        emergencyContacts: true,
        educationBackgrounds: true,
        ministryExperiences: true,
        ministrySkills: true,
        ministryRecords: true,
        awardsRecognitions: true,
        employmentRecords: true,
        seminarsConferences: true,
      })
      .parse(memberData)

    // Insert member
    const [created] = await db.insert(members).values(parsed).returning()
    const memberId = created.id

    // Insert nested arrays if present
    if (children.length)
      await db
        .insert(memberChildren)
        .values(children.map(c => ({ ...c, memberId })))
    if (emergencyContacts.length)
      await db
        .insert(memberEmergencyContacts)
        .values(emergencyContacts.map(c => ({ ...c, memberId })))
    if (educationBackgrounds.length)
      await db
        .insert(memberEducationBackgrounds)
        .values(educationBackgrounds.map(c => ({ ...c, memberId })))
    if (ministryExperiences.length)
      await db
        .insert(memberMinistryExperiences)
        .values(ministryExperiences.map(c => ({ ...c, memberId })))
    if (ministrySkills.length)
      await db
        .insert(memberMinistrySkills)
        .values(ministrySkills.map(c => ({ ...c, memberId })))
    if (ministryRecords.length)
      await db
        .insert(memberMinistryRecords)
        .values(ministryRecords.map(c => ({ ...c, memberId })))
    if (awardsRecognitions.length)
      await db
        .insert(memberAwardsRecognitions)
        .values(awardsRecognitions.map(c => ({ ...c, memberId })))
    if (employmentRecords.length)
      await db
        .insert(memberEmploymentRecords)
        .values(employmentRecords.map(c => ({ ...c, memberId })))
    if (seminarsConferences.length)
      await db
        .insert(memberSeminarsConferences)
        .values(seminarsConferences.map(c => ({ ...c, memberId })))

    return created
  },

  async update(
    id: number,
    data: Partial<Omit<Member, "id" | "createdAt" | "updatedAt">>
  ) {
    const parsed = memberSchema
      .partial()
      .omit({ id: true, createdAt: true, updatedAt: true })
      .parse(data)
    const [updated] = await db
      .update(members)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning()
    return updated
  },

  async delete(id: number) {
    const [deleted] = await db
      .delete(members)
      .where(eq(members.id, id))
      .returning()
    return deleted
  },
}
