"use client"

import type React from "react"
import { useState } from "react"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"

import { MapPicker, type LatLng } from "./map-picker"

interface MapPickerTriggerProps {
  value?: LatLng | null
  onChange: (location: LatLng | null) => void
  mapId?: string
  placeholder?: string
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  className?: string
}

export const MapPickerTrigger: React.FC<MapPickerTriggerProps> = ({
  value,
  onChange,
  mapId,
  placeholder = "Select location",
  variant = "outline",
  size = "default",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const formatLocation = (location: LatLng): string => {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <MapPin className='h-4 w-4 mr-2' />
        {value ? formatLocation(value) : placeholder}
      </Button>

      {isOpen && (
        <MapPicker
          value={value}
          onChange={onChange}
          mapId={mapId}
          showAddress={true}
        />
      )}
    </>
  )
}

export default MapPickerTrigger
