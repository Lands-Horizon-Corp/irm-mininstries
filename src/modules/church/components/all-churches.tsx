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
} from "lucide-react";

import { ImageViewer } from "@/components/ui/image-viewer";

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
        className={`group cursor-pointer transition-shadow hover:shadow-md ${
          isSelected ? "ring-primary shadow-md ring-2" : ""
        }`}
        onClick={() => onSelect(church)}
      >
        <CardContent className="p-2">
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
          <div className="space-y-2">
            <h3 className="line-clamp-1 text-sm font-medium">{church.name}</h3>

            {church.address && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <MapPin className="h-2.5 w-2.5" />
                <span className="line-clamp-1">{church.address}</span>
              </div>
            )}

            {(church.address || (church.latitude && church.longitude)) && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-full text-xs"
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

  const handleSelectChurch = (church: Church) => {
    onSelectChurch?.(church);
  };

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
    <Container className="py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-semibold">All Churches</h1>
          <p className="text-muted-foreground text-sm">
            Browse and explore registered churches
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search churches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
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
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        {/* Churches Carousel */}
        {!isLoading && filteredChurches.length > 0 && (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {filteredChurches.map((church) => (
                <CarouselItem
                  key={church.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              {filteredChurches.length} church
              {filteredChurches.length !== 1 ? "es" : ""}
              {search && " found"}
            </Badge>
          </div>
        )}
      </div>
    </Container>
  );
}

export default AllChurches;
