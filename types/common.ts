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
