"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { ExternalLink, Navigation } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { GOOGLE_MAPS_LOADER_CONFIG } from "@/lib/google-maps-config";

export interface MapViewerProps {
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
  /** Map container height */
  height?: string;
  /** Map container width */
  width?: string;
  /** Default zoom level */
  zoom?: number;
  /** Show external links (Google Maps, Directions) */
  showActions?: boolean;
  /** Custom marker title */
  markerTitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Map container style override */
  style?: React.CSSProperties;
  /** Custom map options */
  mapOptions?: google.maps.MapOptions;
}

const defaultMapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "300px",
};

export const MapViewer: React.FC<MapViewerProps> = ({
  lat,
  lng,
  height = "300px",
  width = "100%",
  zoom = 15,
  showActions = true,
  markerTitle,
  className,
  style,
  mapOptions = {},
}) => {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_CONFIG);
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const center = { lat, lng };

  const createMarker = useCallback(async () => {
    if (!mapRef.current || !window.google?.maps || !isLoaded) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }

    try {
      // Import the marker library dynamically
      const { AdvancedMarkerElement } = (await window.google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // Create new advanced marker
      markerRef.current = new AdvancedMarkerElement({
        map: mapRef.current,
        position: center,
        title: markerTitle || "Location",
      });
    } catch {
      // Silently handle marker creation failure
      // The map will still be functional without the marker
    }
  }, [center, markerTitle, isLoaded]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      // Create marker after map loads
      setTimeout(() => createMarker(), 100);
    },
    [createMarker]
  );

  // Update marker when coordinates change
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      createMarker();
    }
  }, [lat, lng, createMarker, isLoaded]);

  // Cleanup marker on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
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
    fullscreenControl: false,
    gestureHandling: "cooperative" as const,
    clickableIcons: false,
    colorScheme: resolvedTheme === "dark" ? "DARK" : "LIGHT",
    mapId: "7315fed6ff6d5145e4c926ff",
    ...mapOptions,
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

  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Map Container */}
      <div className="overflow-hidden rounded-lg border">
        <GoogleMap
          center={center}
          mapContainerStyle={mapContainerStyle}
          options={defaultOptions}
          zoom={zoom}
          onLoad={onMapLoad}
        />
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm" variant="outline">
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Maps
            </a>
          </Button>
          <Button asChild className="flex-1" size="sm" variant="outline">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
