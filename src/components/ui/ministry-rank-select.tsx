"use client";

import React, { useMemo, useState } from "react";

import { Check, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMinistryRanks } from "@/modules/ministry-ranks/ministry-ranks-service";

interface MinistryRankSelectProps {
  value?: number | null;
  onValueChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MinistryRankSelect: React.FC<MinistryRankSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Search ministry ranks...",
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ministry ranks with search
  const { data: ministryRanksResponse, isLoading } = useMinistryRanks({
    search: searchTerm || undefined,
    page: 1,
    limit: 100, // Get all ranks since we only have 4
  });

  // Memoize ministry ranks to prevent unnecessary re-renders
  const ministryRanks = useMemo(() => {
    return ministryRanksResponse?.data || [];
  }, [ministryRanksResponse?.data]);

  // Find selected ministry rank
  const selectedMinistryRank = useMemo(() => {
    if (!value) return null;
    return ministryRanks.find((rank) => rank.id === value) || null;
  }, [value, ministryRanks]);

  const handleSelect = (selectedValue: number) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

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
          <span className="truncate">
            {selectedMinistryRank?.name || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search ministry ranks..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="text-muted-foreground ml-2 text-sm">
                  Loading ministry ranks...
                </span>
              </div>
            ) : (
              <>
                <CommandEmpty>No ministry ranks found.</CommandEmpty>
                <CommandGroup>
                  {ministryRanks.map((rank) => (
                    <CommandItem
                      key={rank.id}
                      value={`${rank.name}-${rank.id}`}
                      onSelect={() => handleSelect(rank.id)}
                    >
                      <div className="flex w-full items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMinistryRank?.id === rank.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{rank.name}</div>
                          {rank.description && (
                            <div className="text-muted-foreground text-xs">
                              {rank.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
