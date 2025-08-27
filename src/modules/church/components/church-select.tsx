"use client";

import React, { useMemo, useState } from "react";

import { Building2, Check, ChevronDown, MapPin, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { Church } from "../church-schema";
import { useChurches } from "../church-service";

interface ChurchSelectProps {
  value?: number | string | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  allowNone?: boolean;
}

export const ChurchSelect: React.FC<ChurchSelectProps> = ({
  value,
  onChange,
  placeholder = "Select church...",
  disabled = false,
  className,
  allowClear = true,
  allowNone = true,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch churches with search
  const { data: churchesResponse, isLoading } = useChurches({
    search: searchTerm || undefined,
    limit: 50, // Limit results for performance
  });

  // Memoize churches to prevent unnecessary re-renders
  const churches = useMemo(() => {
    return churchesResponse?.data || [];
  }, [churchesResponse?.data]);

  // Find selected church
  const selectedChurch = useMemo(() => {
    if (!value) return null;
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;
    return churches.find((church) => church.id === numericValue) || null;
  }, [value, churches]);

  const handleSelect = (selectedValue: number | null) => {
    if (selectedValue === value) {
      // If clicking the same value, close the popover
      setOpen(false);
      return;
    }

    onChange(selectedValue);
    setOpen(false);
    setSearchTerm(""); // Clear search after selection
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm("");
  };

  // Helper function to get display name for church
  const getChurchDisplayName = (church: Church) => {
    // Since church doesn't have a name field, we'll use address or description
    if (church.address) {
      // Try to get a short version of the address (first part before comma)
      const addressParts = church.address.split(",");
      return addressParts[0].trim();
    }
    return `Church #${church.id}`;
  };

  const displayValue = selectedChurch
    ? getChurchDisplayName(selectedChurch)
    : value === null
      ? "None"
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "h-11 w-full justify-between font-normal",
            !selectedChurch && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="truncate">{displayValue}</span>
          </div>
          <div className="flex items-center gap-1">
            {allowClear && selectedChurch && (
              <X
                className="hover:bg-destructive/10 h-4 w-4 shrink-0 rounded opacity-50 transition-colors hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0 shadow-lg">
        <div className="bg-muted/30 flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="placeholder:text-muted-foreground h-10 w-full border-0 bg-transparent py-3 text-sm outline-none focus:ring-0"
            placeholder="Search churches by address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
              <span className="text-muted-foreground ml-3 text-sm">
                Loading churches...
              </span>
            </div>
          ) : churches.length === 0 ? (
            <div className="py-8 text-center text-sm">
              {searchTerm ? (
                <>
                  <Building2 className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
                  <p className="font-medium">No churches found</p>
                  <p className="text-muted-foreground">
                    No churches found for{" "}
                    <span className="font-medium">
                      &ldquo;{searchTerm}&rdquo;
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <Building2 className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
                  <p className="font-medium">No churches available</p>
                  <p className="text-muted-foreground text-xs">
                    Add churches to get started
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="p-2">
              {/* None option */}
              {allowNone && (
                <div
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm transition-colors outline-none select-none",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                  onClick={() => handleSelect(null)}
                >
                  <Check
                    className={cn(
                      "mr-3 h-4 w-4",
                      !selectedChurch ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-medium">
                      None
                    </span>
                    <span className="text-muted-foreground text-xs">
                      No church assigned
                    </span>
                  </div>
                </div>
              )}

              {/* Churches options */}
              {churches.map((church) => (
                <div
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors outline-none select-none",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                  key={church.id}
                  onClick={() => handleSelect(church.id)}
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      selectedChurch?.id === church.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <Building2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-foreground font-medium">
                          {getChurchDisplayName(church)}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <MapPin className="text-muted-foreground h-3 w-3 shrink-0" />
                          <span className="text-muted-foreground truncate text-xs">
                            {church.address}
                          </span>
                        </div>
                        {church.description && (
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                            {church.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
