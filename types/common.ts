export interface Language {
  code: string
  label: string
  countryCode: string
  title: string
}

export interface ChurchCoverPhoto {
  id: number
  name: string
  description: string
  coverImage: string
  createdAt: Date
  updatedAt: Date
}

export interface ChurchEvent {
  id: number
  name: string
  description: string
  place: string
  datetime: Date
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChurchLocation {
  id: number
  imageUrl: string
  longitude: string
  latitude: string
  address: string
  email: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface ContactUs {
  id: number
  name: string
  email: string
  contactNumber: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface MinistryRanks {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface MinistrySkills {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberChild {
  id: number
  memberId: number
  name: string
  placeOfBirth: string
  dateOfBirth: Date
  gender: "male" | "female"
  createdAt: Date
  updatedAt: Date
}

export interface MemberEmergencyContact {
  id: number
  memberId: number
  name: string
  relationship: string
  address: string
  contactNumber: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberEducationBackground {
  id: number
  memberId: number
  schoolName: string
  educationalAttainment: string
  dateGraduated?: Date
  description?: string
  course?: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberMinistryExperience {
  id: number
  memberId: number
  title: string
  description?: string
  fromYear: string
  toYear?: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberMinistrySkill {
  id: number
  memberId: number
  ministrySkillId: number
  ministrySkill?: MinistrySkills
  createdAt: Date
  updatedAt: Date
}

export interface MemberMinistryRecord {
  id: number
  memberId: number
  churchLocationId: number
  churchLocation?: ChurchLocation
  fromYear: string
  toYear?: string
  contribution?: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberAwardsRecognition {
  id: number
  memberId: number
  year: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberEmploymentRecord {
  id: number
  memberId: number
  companyName: string
  fromYear: string
  toYear?: string
  position: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberSeminarConference {
  id: number
  memberId: number
  title: string
  description?: string
  place?: string
  year: string
  numberOfHours: number
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  id: number
  firstName: string
  lastName: string
  middleName?: string
  suffix?: string
  nickname?: string
  dateOfBirth: Date
  placeOfBirth: string
  address: string
  gender: "male" | "female"
  heightFeet: string
  weightKg: string
  civilStatus: string
  email?: string
  telephone?: string
  passportNumber?: string
  sssNumber?: string
  philhealth?: string
  tin?: string
  presentAddress: string
  permanentAddress?: string
  fatherName: string
  fatherProvince: string
  fatherBirthday: Date
  fatherOccupation: string
  motherName: string
  motherProvince: string
  motherBirthday: Date
  motherOccupation: string
  spouseName?: string
  spouseProvince?: string
  spouseBirthday?: Date
  spouseOccupation?: string
  weddingDate?: Date
  skills?: string
  hobbies?: string
  sports?: string
  otherReligiousSecularTraining?: string
  certifiedBy?: string
  signatureImageUrl?: string
  signatureByCertifiedImageUrl?: string
  createdAt: Date
  updatedAt: Date
  children?: MemberChild[]
  emergencyContacts?: MemberEmergencyContact[]
  educationBackgrounds?: MemberEducationBackground[]
  ministryExperiences?: MemberMinistryExperience[]
  ministrySkills?: MemberMinistrySkill[]
  ministryRecords?: MemberMinistryRecord[]
  awardsRecognitions?: MemberAwardsRecognition[]
  employmentRecords?: MemberEmploymentRecord[]
  seminarsConferences?: MemberSeminarConference[]
  parent?: Member
  childrenMembers?: Member[]
  pictureUrl?: string
}
