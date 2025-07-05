import type React from "react"

export interface LatLng {
  lat: number
  lng: number
}

export interface PlaceSuggestion {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  types: string[]
}

export interface GoogleMapsEvent {
  latLng: {
    lat(): number
    lng(): number
  }
}

export interface GoogleGeocodeResult {
  formatted_address: string
}

export interface GooglePlaceDetails {
  place_id: string
  geometry: {
    location: {
      lat(): number
      lng(): number
    }
  }
  name?: string
  formatted_address?: string
  types: string[]
}

export interface MapPickerProps {
  /** Current selected location */
  value?: LatLng | null
  /** Callback when location changes */
  onChange: (location: LatLng | null) => void
  /** Google Maps Map ID for custom styling */
  mapId?: string
  /** Default map center */
  defaultCenter?: LatLng
  /** Default zoom level */
  defaultZoom?: number
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Modal title */
  title?: string
  /** Show address in selected location info */
  showAddress?: boolean
  /** Map container styling */
  mapContainerStyle?: React.CSSProperties
  /** Button text when no location is selected */
  placeholder?: string
  /** Button variant */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon"
  /** Whether the button is disabled */
  disabled?: boolean
  /** Custom button class name */
  className?: string
}
