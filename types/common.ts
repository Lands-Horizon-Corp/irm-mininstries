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
