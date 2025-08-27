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
import { useChurches } from "@/modules/church/church-service";

interface ChurchSelectProps {
  value?: number | null;
  onValueChange?: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ChurchSelect: React.FC<ChurchSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Search churches...",
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch churches with search
  const { data: churchesResponse, isLoading } = useChurches({
    search: searchTerm || undefined,
    page: 1,
    limit: 100,
  });

  // Memoize churches to prevent unnecessary re-renders
  const churches = useMemo(() => {
    return churchesResponse?.data || [];
  }, [churchesResponse?.data]);

  // Find selected church
  const selectedChurch = useMemo(() => {
    if (!value) return null;
    return churches.find((church) => church.id === value) || null;
  }, [value, churches]);

  const handleSelect = (selectedValue: number) => {
    onValueChange?.(selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !selectedChurch && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">
            {selectedChurch?.name || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search churches..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="text-muted-foreground ml-2 text-sm">
                  Loading churches...
                </span>
              </div>
            ) : (
              <>
                <CommandEmpty>No churches found.</CommandEmpty>
                <CommandGroup>
                  {churches.map((church) => (
                    <CommandItem
                      key={church.id}
                      value={`${church.name}-${church.id}`}
                      onSelect={() => handleSelect(church.id)}
                    >
                      <div className="flex w-full items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedChurch?.id === church.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{church.name}</div>
                          {church.address && (
                            <div className="text-muted-foreground text-xs">
                              {church.address}
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
