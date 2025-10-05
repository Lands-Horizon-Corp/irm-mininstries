"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Navigation, Maximize2 } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { GOOGLE_MAPS_LOADER_CONFIG } from "@/lib/google-maps-config";

export interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  imageUrl?: string;
}

export interface MultiMapViewerProps {
  /** Array of locations to display */
  locations: MapLocation[];
  /** Map container height */
  height?: string;
  /** Map container width */
  width?: string;
  /** Default zoom level */
  zoom?: number;
  /** Selected location ID to focus on */
  selectedLocationId?: number;
  /** Callback when a location is selected on the map */
  onLocationSelect?: (location: MapLocation) => void;
  /** Show external links (Google Maps, Directions) */
  showActions?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Map container style override */
  style?: React.CSSProperties;
  /** Custom map options */
  mapOptions?: google.maps.MapOptions;
}

const defaultMapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
};

export const MultiMapViewer: React.FC<MultiMapViewerProps> = ({
  locations,
  height = "400px",
  width = "100%",
  zoom = 10,
  selectedLocationId,
  onLocationSelect,
  showActions = true,
  className,
  style,
  mapOptions = {},
}) => {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_CONFIG);
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<
    Map<number, google.maps.marker.AdvancedMarkerElement>
  >(new Map());
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );

  // Calculate center from locations
  const center = React.useMemo(() => {
    if (locations.length === 0) {
      return { lat: 0, lng: 0 };
    }

    if (locations.length === 1) {
      return { lat: locations[0].lat, lng: locations[0].lng };
    }

    // Calculate center manually for multiple locations
    const latSum = locations.reduce((sum, loc) => sum + loc.lat, 0);
    const lngSum = locations.reduce((sum, loc) => sum + loc.lng, 0);

    return {
      lat: latSum / locations.length,
      lng: lngSum / locations.length,
    };
  }, [locations]);

  // Create bounds after Google Maps is loaded
  const createBounds = useCallback(() => {
    if (!window.google?.maps || locations.length <= 1) {
      return null;
    }

    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((location) => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    return bounds;
  }, [locations]);

  const createMarkers = useCallback(async () => {
    if (
      !mapRef.current ||
      !window.google?.maps ||
      !isLoaded ||
      locations.length === 0
    )
      return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current.clear();

    try {
      // Import the marker library dynamically
      const { AdvancedMarkerElement, PinElement } =
        (await window.google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

      // Create markers for each location
      locations.forEach((location) => {
        const isSelected = selectedLocationId === location.id;

        // Create pin element with custom styling
        const pinElement = new PinElement({
          background: isSelected ? "#ef4444" : "#3b82f6",
          borderColor: isSelected ? "#dc2626" : "#1d4ed8",
          glyphColor: "white",
          scale: isSelected ? 1.2 : 1,
        });

        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position: { lat: location.lat, lng: location.lng },
          title: location.name,
          content: pinElement.element,
        });

        // Add click listener to marker
        marker.addListener("click", () => {
          setSelectedLocation(location);
          onLocationSelect?.(location);
        });

        markersRef.current.set(location.id, marker);
      });

      // Focus on selected location if provided
      if (selectedLocationId) {
        const selectedLoc = locations.find(
          (loc) => loc.id === selectedLocationId
        );
        if (selectedLoc && mapRef.current) {
          mapRef.current.panTo({ lat: selectedLoc.lat, lng: selectedLoc.lng });
          mapRef.current.setZoom(15);
        }
      }
    } catch {
      // Silently handle marker creation failure
      // The map will still be functional without the markers
    }
  }, [locations, selectedLocationId, onLocationSelect, isLoaded]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const bounds = createBounds();
        if (bounds) {
          map.fitBounds(bounds, 50);
        }
      }

      // Create markers after a short delay
      setTimeout(() => createMarkers(), 100);
    },
    [locations.length, createBounds, createMarkers]
  );

  // Update markers when locations or selection changes
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      createMarkers();
    }
  }, [locations, selectedLocationId, createMarkers, isLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current.clear();
    };
  }, []);

  const mapContainerStyle: React.CSSProperties = {
    ...defaultMapContainerStyle,
    width,
    height,
    ...style,
  };

  const defaultOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    gestureHandling: "cooperative" as const,
    clickableIcons: false,
    colorScheme: resolvedTheme === "dark" ? "DARK" : "LIGHT",
    mapId: "7315fed6ff6d5145e4c926ff",
    ...mapOptions,
  };

  const handleViewAll = () => {
    if (mapRef.current && locations.length > 1) {
      const bounds = createBounds();
      if (bounds) {
        mapRef.current.fitBounds(bounds, 50);
      }
    }
  };

  if (!GOOGLE_MAPS_LOADER_CONFIG.googleMapsApiKey) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400 ${className || ""}`}
        style={mapContainerStyle}
      >
        Google Maps API key is missing
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400 ${className || ""}`}
        style={mapContainerStyle}
      >
        Failed to load Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`bg-muted text-muted-foreground flex items-center justify-center rounded ${className || ""}`}
        style={mapContainerStyle}
      >
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div
        className={`bg-muted/50 flex items-center justify-center rounded border p-8 ${className || ""}`}
        style={mapContainerStyle}
      >
        <div className="text-center">
          <MapPin className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            No locations to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className || ""}`}>
      {/* Map Container */}
      <div className="relative overflow-hidden rounded-lg border">
        <GoogleMap
          center={center}
          mapContainerStyle={mapContainerStyle}
          options={defaultOptions}
          zoom={zoom}
          onLoad={onMapLoad}
        />

        {/* View All Button - Absolute positioned inside map */}
        {locations.length > 1 && (
          <div className="absolute top-3 left-3 z-10">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewAll}
              className="bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              View All ({locations.length})
            </Button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-wrap gap-2">
          {selectedLocation && (
            <>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Maps
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiMapViewer;
