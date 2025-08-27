"use client";

import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

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
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function ChurchSelect({
  value,
  onValueChange,
  placeholder = "Select a church...",
  disabled = false,
  className,
  searchPlaceholder = "Search churches...",
  emptyMessage = "No churches found.",
}: ChurchSelectProps) {
  const [open, setOpen] = useState(false);
  const { data: churchesResponse, isLoading } = useChurches({
    page: 1,
    limit: 100,
  });
  const churches = churchesResponse?.data || [];

  const selectedChurch = churches.find((church) => church.id === value);

  const handleSelect = (currentValue: string) => {
    const churchId = currentValue === "none" ? null : Number(currentValue);
    const newValue = churchId === value ? null : churchId;
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedChurch && "text-muted-foreground",
            className
          )}
          disabled={disabled || isLoading}
          role="combobox"
          variant="outline"
        >
          {selectedChurch ? (
            <span className="truncate">
              {selectedChurch.name}
              {selectedChurch.address && (
                <span className="text-muted-foreground ml-1">
                  - {selectedChurch.address}
                </span>
              )}
            </span>
          ) : (
            <span>{isLoading ? "Loading churches..." : placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[300px] w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput className="h-9" placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                className="text-muted-foreground"
                value="none"
                onSelect={() => handleSelect("none")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === null ? "opacity-100" : "opacity-0"
                  )}
                />
                None selected
              </CommandItem>
              {churches.map((church) => (
                <CommandItem
                  className="flex flex-col items-start gap-1 py-2"
                  key={church.id}
                  value={church.id.toString()}
                  onSelect={handleSelect}
                >
                  <div className="flex w-full items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === church.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">
                        {church.name}
                      </span>
                      {church.address && (
                        <span className="text-muted-foreground truncate text-sm">
                          {church.address}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
