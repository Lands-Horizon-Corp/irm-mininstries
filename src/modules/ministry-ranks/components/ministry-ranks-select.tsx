"use client";

import React, { useMemo, useState } from "react";

import { Check, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useMinistryRanks } from "../ministry-ranks-service";

interface MinistryRanksSelectProps {
  value?: number | string | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  allowNone?: boolean;
}

export const MinistryRanksSelect: React.FC<MinistryRanksSelectProps> = ({
  value,
  onChange,
  placeholder = "Select ministry rank...",
  disabled = false,
  className,
  allowClear = true,
  allowNone = true,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ministry ranks with search
  const { data: ministryRanksResponse, isLoading } = useMinistryRanks({
    search: searchTerm || undefined,
    limit: 50, // Limit results for performance
  });

  // Memoize ministry ranks to prevent unnecessary re-renders
  const ministryRanks = useMemo(() => {
    return ministryRanksResponse?.data || [];
  }, [ministryRanksResponse?.data]);

  // Find selected ministry rank
  const selectedMinistryRank = useMemo(() => {
    if (!value) return null;
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;
    return ministryRanks.find((rank) => rank.id === numericValue) || null;
  }, [value, ministryRanks]);

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

  const displayValue =
    selectedMinistryRank?.name || (value === null ? "None" : placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !selectedMinistryRank && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">{displayValue}</span>
          <div className="flex items-center gap-1">
            {allowClear && selectedMinistryRank && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="placeholder:text-muted-foreground h-10 w-full border-0 bg-transparent py-3 text-sm outline-none focus:ring-0"
            placeholder="Search ministry ranks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="max-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              <span className="text-muted-foreground ml-2 text-sm">
                Loading ministry ranks...
              </span>
            </div>
          ) : ministryRanks.length === 0 ? (
            <div className="py-6 text-center text-sm">
              {searchTerm ? (
                <>
                  No ministry ranks found for{" "}
                  <span className="font-medium">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                </>
              ) : (
                "No ministry ranks available"
              )}
            </div>
          ) : (
            <div className="p-1">
              {/* None option */}
              {allowNone && (
                <div
                  className="hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleSelect(null)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !selectedMinistryRank ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-medium">
                      None
                    </span>
                    <span className="text-muted-foreground text-xs">
                      No ministry rank assigned
                    </span>
                  </div>
                </div>
              )}

              {/* Ministry ranks options */}
              {ministryRanks.map((rank) => (
                <div
                  className="hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  key={rank.id}
                  onClick={() => handleSelect(rank.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMinistryRank?.id === rank.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{rank.name}</span>
                    {rank.description && (
                      <span className="text-muted-foreground text-xs">
                        {rank.description}
                      </span>
                    )}
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
