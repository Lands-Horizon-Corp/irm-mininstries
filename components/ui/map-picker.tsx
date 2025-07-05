"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"
import { Building, Globe, MapPin, Navigation, Search, X } from "lucide-react"

import type {
  GoogleGeocodeResult,
  GooglePlaceDetails,
  LatLng,
  MapPickerProps,
  PlaceSuggestion,
} from "@/types/map-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

const defaultCenter: LatLng = { lat: 37.7749, lng: -122.4194 }
const defaultMapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
}
const libraries: ("places" | "geometry")[] = ["places", "geometry"]

export const MapPicker: React.FC<MapPickerProps> = ({
  value,
  onChange,
  mapId,
  defaultCenter: propDefaultCenter = defaultCenter,
  defaultZoom = 10,
  searchPlaceholder = "Search for a location...",
  title = "Select Location",
  showAddress = true,
  mapContainerStyle = defaultMapContainerStyle,
  placeholder = "Select location",
  variant = "outline",
  size = "default",
  disabled = false,
  className,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: apiKey ?? "",
    libraries,
  })

  // Internal modal state
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    value || null
  )
  const [mapCenter, setMapCenter] = useState<LatLng>(value || propDefaultCenter)
  const [mapZoom, setMapZoom] = useState<number>(value ? 15 : defaultZoom)
  const [address, setAddress] = useState<string>("")
  const [searchValue, setSearchValue] = useState<string>("")
  const [isLoadingAddr, setIsLoadingAddr] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geocoderRef = useRef<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placesServiceRef = useRef<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteServiceRef = useRef<any | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const justOpenedRef = useRef(false)

  const formatLocation = (location: LatLng): string => {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  }

  const createOrMoveMarker = useCallback((location: LatLng) => {
    if (!mapRef.current || !window.google?.maps) return

    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }

    if (window.google.maps.Marker) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: location,
        draggable: true,
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      markerRef.current.addListener("dragend", (e: any) => {
        const newLoc: LatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
        setSelectedLocation(newLoc)
        reverseGeocode(newLoc)
      })
    }
  }, [])

  const reverseGeocode = useCallback(
    (loc: LatLng) => {
      if (!geocoderRef.current || !showAddress) return

      setIsLoadingAddr(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geocoderRef.current.geocode(
        { location: loc },
        (
          results: GoogleGeocodeResult[] | null,
          status: google.maps.GeocoderStatus
        ) => {
          setIsLoadingAddr(false)
          if (status === "OK" && results && results[0]) {
            setAddress(results[0].formatted_address)
          } else {
            setAddress("Address not found")
          }
        }
      )
    },
    [showAddress]
  )

  const searchPlaces = useCallback((query: string) => {
    if (!autocompleteServiceRef.current || !query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)

    const request = {
      input: query,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autocompleteServiceRef.current.getPlacePredictions(
      request,
      (
        predictions: PlaceSuggestion[],
        status: google.maps.places.PlacesServiceStatus
      ) => {
        setIsLoadingSuggestions(false)

        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions.slice(0, 5))
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      }
    )
  }, [])

  const selectPlace = useCallback(
    (placeId: string, description: string) => {
      if (!placesServiceRef.current) {
        return
      }

      setIsLoadingSuggestions(true)

      const request = {
        placeId: placeId,
        fields: ["place_id", "geometry", "name", "formatted_address", "types"],
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      placesServiceRef.current.getDetails(
        request,
        (
          place: GooglePlaceDetails,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          setIsLoadingSuggestions(false)

          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place.geometry
          ) {
            const newLoc: LatLng = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }

            setSelectedLocation(newLoc)
            setMapCenter(newLoc)
            setMapZoom(15)
            setSearchValue(description)
            setShowSuggestions(false)
            setSuggestions([])

            if (mapRef.current) {
              mapRef.current.panTo(newLoc)
              mapRef.current.setZoom(15)
            }

            setTimeout(() => {
              createOrMoveMarker(newLoc)
            }, 100)

            if (showAddress) {
              setAddress(place.formatted_address || place.name || description)
            }
          } else {
            setSearchValue(description)
            setShowSuggestions(false)
            setSuggestions([])
          }
        }
      )
    },
    [createOrMoveMarker, showAddress]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          searchPlaces(value)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      }, 300)
    },
    [searchPlaces]
  )

  const getPlaceIcon = (types: string[]) => {
    if (
      types.includes("establishment") ||
      types.includes("point_of_interest")
    ) {
      return <Building className='h-4 w-4 text-blue-500' />
    }
    if (
      types.includes("locality") ||
      types.includes("administrative_area_level_1")
    ) {
      return <Globe className='h-4 w-4 text-green-500' />
    }
    return <Navigation className='h-4 w-4 text-gray-500' />
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map

    if (window.google?.maps) {
      geocoderRef.current = new window.google.maps.Geocoder()
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        map
      )
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService()
    }
  }, [])

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const loc: LatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
        setSelectedLocation(loc)
        createOrMoveMarker(loc)
        reverseGeocode(loc)
        setShowSuggestions(false)
      }
    },
    [createOrMoveMarker, reverseGeocode]
  )

  // Sync internal state with external value
  useEffect(() => {
    if (isOpen) {
      justOpenedRef.current = true
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && justOpenedRef.current) {
      // Ignore the first value change after opening
      justOpenedRef.current = false
      return
    }
    setSelectedLocation(value || null)
  }, [value, isOpen])

  useEffect(() => {
    if (isOpen) {
      setSelectedLocation(value || null)
      setMapCenter(value || propDefaultCenter)
      setMapZoom(value ? 15 : defaultZoom)
      setAddress("")
      setSearchValue("")
      setSuggestions([])
      setShowSuggestions(false)

      if (value && isLoaded) {
        setTimeout(() => createOrMoveMarker(value), 300)
      }
    } else {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [
    isOpen,
    value,
    propDefaultCenter,
    defaultZoom,
    isLoaded,
    createOrMoveMarker,
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const searchContainer = searchInputRef.current?.parentElement

      if (searchContainer && !searchContainer.contains(target)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showSuggestions])

  // Auto-close modal and call onChange when location is selected
  const handleConfirm = () => {
    onChange(selectedLocation)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedLocation(value || null) // Reset to original value
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedLocation(null)
    setAddress("")
    setSearchValue("")
    setSuggestions([])
    setShowSuggestions(false)
    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
  }

  // Quick select - automatically confirm when location is selected via search or click
  const handleQuickSelect = (location: LatLng) => {
    onChange(location)
    setIsOpen(false)
  }

  const mapOptions = {
    mapId,
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "cooperative" as const,
    clickableIcons: true,
  }

  if (!apiKey) {
    return (
      <div className='text-red-600 text-sm p-2 border border-red-200 rounded'>
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing
      </div>
    )
  }

  if (loadError) {
    return (
      <div className='text-red-600 text-sm p-2 border border-red-200 rounded'>
        Failed to load Google Maps
      </div>
    )
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={className}
        onClick={() => setIsOpen(true)}
        type='button'
      >
        <MapPin className='h-4 w-4 mr-2' />
        {value ? formatLocation(value) : placeholder}
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-7xl max-h-[90vh] overflow-hidden'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' /> {title}
            </DialogTitle>
            <DialogDescription>
              Search or click on the map to pick a location. Drag the marker to
              fine-tune.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='location-search'>Search Location</Label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10' />

                <Input
                  id='location-search'
                  ref={searchInputRef}
                  placeholder={isLoaded ? searchPlaceholder : "Loading..."}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true)
                    }
                  }}
                  disabled={!isLoaded}
                  className='pl-10 pr-10'
                  autoComplete='off'
                />

                {searchValue && (
                  <Button
                    variant='ghost'
                    type='button'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 z-10'
                    onClick={() => {
                      setSearchValue("")
                      setSuggestions([])
                      setShowSuggestions(false)
                      if (searchInputRef.current) {
                        searchInputRef.current.focus()
                      }
                    }}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}

                {showSuggestions &&
                  (suggestions.length > 0 || isLoadingSuggestions) && (
                    <div className='absolute top-full left-0 right-0 mt-1 z-[9999] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg'>
                      <ScrollArea className='max-h-60'>
                        {isLoadingSuggestions ? (
                          <div className='p-3 text-sm text-muted-foreground text-center'>
                            Searching...
                          </div>
                        ) : (
                          <div className='py-1'>
                            {suggestions.map(suggestion => (
                              <div
                                key={suggestion.place_id}
                                className='w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-start gap-3 border-b last:border-b-0 cursor-pointer'
                                onClick={e => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  selectPlace(
                                    suggestion.place_id,
                                    suggestion.description
                                  )
                                }}
                                onMouseDown={e => {
                                  e.preventDefault()
                                }}
                              >
                                <div className='mt-0.5'>
                                  {getPlaceIcon(suggestion.types)}
                                </div>
                                <div className='flex-1 min-w-0'>
                                  <div className='font-medium text-sm truncate text-gray-900 dark:text-gray-100'>
                                    {suggestion.structured_formatting.main_text}
                                  </div>
                                  <div className='text-xs text-muted-foreground truncate'>
                                    {
                                      suggestion.structured_formatting
                                        .secondary_text
                                    }
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  )}
              </div>

              <div className='text-xs text-muted-foreground'>
                Status: Maps {isLoaded ? "✓" : "⏳"} | Places Service{" "}
                {placesServiceRef.current ? "✓" : "⏳"}
                {isLoaded && " | Try typing 'New York' or 'London'"}
              </div>
            </div>

            <div className='border rounded-lg overflow-hidden'>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={mapZoom}
                  onLoad={onMapLoad}
                  onClick={onMapClick}
                  options={mapOptions}
                />
              ) : (
                <div
                  style={mapContainerStyle}
                  className='flex items-center justify-center bg-muted text-muted-foreground'
                >
                  Loading map…
                </div>
              )}
            </div>

            {selectedLocation && (
              <div className='space-y-2 p-4 bg-muted rounded-lg'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm font-medium'>
                    Selected Location
                  </Label>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleClear}
                      className='h-8 px-2'
                    >
                      Clear
                    </Button>
                    <Button
                      type='button'
                      size='sm'
                      onClick={() => handleQuickSelect(selectedLocation)}
                      className='h-8 px-3'
                    >
                      Use This Location
                    </Button>
                  </div>
                </div>
                <div className='text-sm text-muted-foreground'>
                  <div>Latitude: {selectedLocation.lat.toFixed(6)}</div>
                  <div>Longitude: {selectedLocation.lng.toFixed(6)}</div>
                </div>
                {showAddress && (
                  <div className='text-sm'>
                    <Label className='text-xs text-muted-foreground'>
                      Address:
                    </Label>
                    <div className='mt-1'>
                      {isLoadingAddr ? (
                        <span className='text-muted-foreground'>
                          Loading address...
                        </span>
                      ) : (
                        <span>{address || "Address not available"}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className='text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg'>
              <p className='font-medium mb-1'>How to use:</p>
              <ul className='space-y-1 text-xs'>
                <li>• Type in the search box to see location suggestions</li>
                <li>• Click on any suggestion to select it automatically</li>
                <li>• Click anywhere on the map to select a location</li>
                <li>• Drag the marker to fine-tune the position</li>
                <li>
                  • Click &quot;Use This Location&quot; for quick selection
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type='button'
              disabled={!selectedLocation}
              onClick={handleConfirm}
              className='min-w-[100px]'
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export type { LatLng }
export default MapPicker
