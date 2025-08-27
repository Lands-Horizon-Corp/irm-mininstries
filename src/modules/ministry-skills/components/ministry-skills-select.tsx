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

import { useMinistrySkills } from "../ministry-skills-service";

interface MinistrySkillsSelectProps {
  value?: number | string | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  allowNone?: boolean;
}

export const MinistrySkillsSelect: React.FC<MinistrySkillsSelectProps> = ({
  value,
  onChange,
  placeholder = "Select ministry skill...",
  disabled = false,
  className,
  allowClear = true,
  allowNone = true,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ministry skills with search
  const { data: ministrySkillsResponse, isLoading } = useMinistrySkills({
    search: searchTerm || undefined,
    limit: 50, // Limit results for performance
  });

  // Memoize ministry skills to prevent unnecessary re-renders
  const ministrySkills = useMemo(() => {
    return ministrySkillsResponse?.data || [];
  }, [ministrySkillsResponse?.data]);

  // Find selected ministry skill
  const selectedMinistrySkill = useMemo(() => {
    if (!value) return null;
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;
    return ministrySkills.find((skill) => skill.id === numericValue) || null;
  }, [value, ministrySkills]);

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
    selectedMinistrySkill?.name || (value === null ? "None" : placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !selectedMinistrySkill && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">{displayValue}</span>
          <div className="flex items-center gap-1">
            {allowClear && selectedMinistrySkill && (
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
            placeholder="Search ministry skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="max-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              <span className="text-muted-foreground ml-2 text-sm">
                Loading ministry skills...
              </span>
            </div>
          ) : ministrySkills.length === 0 ? (
            <div className="py-6 text-center text-sm">
              {searchTerm ? (
                <>
                  No ministry skills found for{" "}
                  <span className="font-medium">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                </>
              ) : (
                "No ministry skills available"
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
                      !selectedMinistrySkill ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-medium">
                      None
                    </span>
                    <span className="text-muted-foreground text-xs">
                      No ministry skill assigned
                    </span>
                  </div>
                </div>
              )}

              {/* Ministry skills options */}
              {ministrySkills.map((skill) => (
                <div
                  className="hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  key={skill.id}
                  onClick={() => handleSelect(skill.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMinistrySkill?.id === skill.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{skill.name}</span>
                    {skill.description && (
                      <span className="text-muted-foreground text-xs">
                        {skill.description}
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
