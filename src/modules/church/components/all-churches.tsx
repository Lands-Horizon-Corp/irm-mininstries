"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Church as ChurchIcon,
  Navigation,
  ZoomIn,
  Building2,
  UsersIcon,
  UserCheck,
} from "lucide-react";

import { ImageViewer } from "@/components/ui/image-viewer";
import { MultiMapViewer } from "@/components/ui/multi-map-viewer";
import type { MapLocation } from "@/components/ui/multi-map-viewer";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useAllChurches } from "../church-service";
import type { Church } from "../church-schema";
import Link from "next/link";

interface AllChurchesProps {
  onSelectChurch?: (church: Church) => void;
  selectedChurchId?: number;
}

interface ChurchCardProps {
  church: Church;
  onSelect: (church: Church) => void;
  isSelected: boolean;
}

function ChurchCard({ church, onSelect, isSelected }: ChurchCardProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (church.latitude && church.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`;
      window.open(url, "_blank");
    } else if (church.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;
      window.open(url, "_blank");
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (church.imageUrl) {
      setImageViewerOpen(true);
    }
  };

  return (
    <>
      <Card
        className={`group cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
          isSelected ? "ring-primary shadow-md ring-2" : ""
        }`}
        onClick={() => onSelect(church)}
      >
        <CardContent className="p-2 sm:p-3">
          {/* Church Image */}
          <div className="bg-muted/50 mb-2 aspect-[5/3] w-full overflow-hidden rounded-lg">
            {church.imageUrl ? (
              <div
                className="relative h-full w-full cursor-pointer transition-opacity hover:opacity-90"
                onClick={handleImageClick}
                title="Click to view full image"
              >
                <Image
                  fill
                  alt={`${church.name} church`}
                  className="object-cover"
                  src={church.imageUrl}
                />
                {/* Overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/10 hover:opacity-100">
                  <div className="bg-background/20 rounded-full p-2 backdrop-blur-sm">
                    <ZoomIn className="text-foreground h-4 w-4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Building2 className="text-muted-foreground h-4 w-4" />
              </div>
            )}
          </div>

          {/* Church Info */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="line-clamp-1 text-sm leading-tight font-medium">
              {church.name}
            </h3>

            {church.address && (
              <div className="text-muted-foreground flex items-start gap-1 truncate text-xs">
                <MapPin className="mt-0.5 h-2.5 w-2.5 flex-shrink-0" />
                <span className="line-clamp-2 leading-relaxed">
                  {church.address}
                </span>
              </div>
            )}

            {(church.address || (church.latitude && church.longitude)) && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 min-h-[32px] w-full text-xs transition-transform active:scale-95"
                onClick={handleDirections}
              >
                <Navigation className="mr-1 h-2.5 w-2.5" />
                Directions
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Viewer */}
      <ImageViewer
        src={church.imageUrl || null}
        alt={church.name}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
      />
    </>
  );
}

function AllChurches({ onSelectChurch, selectedChurchId }: AllChurchesProps) {
  const [search, setSearch] = useState("");

  const {
    data: churchesResponse,
    isLoading,
    error,
  } = useAllChurches(search || undefined);
  const churches = churchesResponse?.data || [];

  const filteredChurches = useMemo(() => {
    if (!search.trim()) return churches;
    const searchTerm = search.toLowerCase();
    return churches.filter(
      (church) =>
        church.name.toLowerCase().includes(searchTerm) ||
        church.description?.toLowerCase().includes(searchTerm) ||
        church.address?.toLowerCase().includes(searchTerm)
    );
  }, [churches, search]);

  // Convert churches to map locations
  const mapLocations = useMemo((): MapLocation[] => {
    return filteredChurches
      .filter((church) => church.latitude && church.longitude)
      .map((church) => ({
        id: church.id,
        name: church.name,
        lat: parseFloat(church.latitude!),
        lng: parseFloat(church.longitude!),
        address: church.address || undefined,
        imageUrl: church.imageUrl || undefined,
      }));
  }, [filteredChurches]);

  const handleSelectChurch = (church: Church) => {
    onSelectChurch?.(church);
  };

  const handleMapLocationSelect = (location: MapLocation) => {
    const church = filteredChurches.find((c) => c.id === location.id);
    if (church) {
      handleSelectChurch(church);
    }
  };

  // Dynamic carousel configuration based on content
  const getCarouselOptions = (itemCount: number) => ({
    align: "start" as const,
    slidesToScroll: "auto" as const,
    dragFree: true,
    containScroll: "trimSnaps" as const,
    skipSnaps: false,
    // Show navigation only if there are more items than can fit on screen
    loop: itemCount > 4,
  });

  if (error) {
    return (
      <Container>
        <Card className="border-destructive/20">
          <CardContent className="p-8 text-center">
            <ChurchIcon className="text-muted-foreground mx-auto mb-4 h-8 w-8" />
            <h3 className="text-destructive mb-2 font-medium">
              Failed to load churches
            </h3>
            <p className="text-muted-foreground text-sm">
              Please try refreshing the page
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4 sm:py-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Search */}
        <div className="mx-auto max-w-md px-4 sm:px-0">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search churches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10 sm:h-10"
            />
          </div>
          {search && (
            <div className="mt-2 text-center">
              <Badge variant="secondary" className="text-xs">
                {filteredChurches.length} result
                {filteredChurches.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
              dragFree: true,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-4/5 pl-1 min-[480px]:basis-1/2 sm:basis-2/5 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="p-1">
                    <Card className="animate-pulse">
                      <CardContent className="p-2">
                        <div className="bg-muted mb-2 aspect-[5/3] w-full rounded-lg"></div>
                        <div className="space-y-1.5">
                          <div className="bg-muted h-3 w-3/4 rounded"></div>
                          <div className="bg-muted h-2.5 w-1/2 rounded"></div>
                          <div className="bg-muted h-6 w-full rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        )}

        {/* Map Section */}
        {!isLoading && mapLocations.length > 0 && (
          <div className="relative">
            <MultiMapViewer
              locations={mapLocations}
              height="400px"
              selectedLocationId={selectedChurchId}
              onLocationSelect={handleMapLocationSelect}
            >
              <div className="absolute top-10 z-10 w-48 max-w-xs sm:w-64">
                {selectedChurchId &&
                  (() => {
                    const selectedChurch = filteredChurches.find(
                      (c) => c.id === selectedChurchId
                    );
                    return selectedChurch ? (
                      <div className="rounded-lg border p-2 shadow-lg backdrop-blur sm:p-3">
                        {/* Header with image and basic info */}
                        <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                          <div
                            className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border sm:size-10"
                            aria-hidden="true"
                          >
                            {selectedChurch.imageUrl ? (
                              <Image
                                src={selectedChurch.imageUrl}
                                alt={selectedChurch.name}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover sm:h-10 sm:w-10"
                              />
                            ) : (
                              <Building2 className="opacity-60" size={16} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="mb-0.5 text-xs leading-tight font-medium sm:mb-1 sm:text-sm">
                              {selectedChurch.name}
                            </h3>
                            {selectedChurch.email && (
                              <p className="text-muted-foreground truncate text-[10px] sm:text-xs">
                                {selectedChurch.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Address and directions */}
                        {selectedChurch.address && (
                          <div className="mb-2 sm:mb-3">
                            <p className="text-muted-foreground mb-0.5 line-clamp-2 text-[10px] sm:mb-1 sm:text-xs">
                              {selectedChurch.address}
                            </p>
                          </div>
                        )}

                        {/* Action buttons - stacked vertically */}
                        <div className="space-y-1 sm:space-y-2">
                          <Link
                            href={`/join/worker?churchId=${selectedChurch.id}`}
                            className="block"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-full px-2 text-[10px] sm:h-8 sm:text-xs"
                            >
                              <UsersIcon className="mr-1 h-2.5 w-2.5 sm:mr-1.5 sm:h-3 sm:w-3" />
                              <span className="hidden sm:inline">
                                Join as Worker
                              </span>
                              <span className="sm:hidden">Worker</span>
                            </Button>
                          </Link>
                          <Link
                            href={`/join/member?churchId=${selectedChurch.id}`}
                            className="block"
                          >
                            <Button
                              size="sm"
                              className="h-6 w-full px-2 text-[10px] sm:h-8 sm:text-xs"
                            >
                              <UserCheck className="mr-1 h-2.5 w-2.5 sm:mr-1.5 sm:h-3 sm:w-3" />
                              <span className="hidden sm:inline">
                                Join as Member
                              </span>
                              <span className="sm:hidden">Member</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : null;
                  })()}
              </div>
            </MultiMapViewer>
          </div>
        )}

        {/* Churches Section */}
        {!isLoading && filteredChurches.length > 0 && (
          <div className="sm:space-y-4">
            <Carousel
              opts={getCarouselOptions(filteredChurches.length)}
              className="w-full"
            >
              <CarouselContent className="-ml-1 pb-2">
                {filteredChurches.map((church) => (
                  <CarouselItem
                    key={church.id}
                    className="basis-4/5 pl-1 min-[480px]:basis-1/2 sm:basis-2/5 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <div className="p-1">
                      <ChurchCard
                        church={church}
                        onSelect={handleSelectChurch}
                        isSelected={selectedChurchId === church.id}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredChurches.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ChurchIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 font-medium">
                {search ? "No churches found" : "No churches available"}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {search
                  ? `No churches match "${search}"`
                  : "There are no churches registered yet"}
              </p>
              {search && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer Stats */}
        {!isLoading && filteredChurches.length > 0 && (
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-xs">
              {filteredChurches.length} church
              {filteredChurches.length !== 1 ? "es" : ""} total
            </Badge>
            {mapLocations.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {mapLocations.length} with locations
              </Badge>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}

export default AllChurches;
