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
import { useMinistrySkills } from "@/modules/ministry-skills/ministry-skills-service";

interface MinistrySkillSelectProps {
  value?: number | null;
  onValueChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MinistrySkillSelect: React.FC<MinistrySkillSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Search ministry skills...",
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ministry skills with search
  const { data: ministrySkillsResponse, isLoading } = useMinistrySkills({
    search: searchTerm || undefined,
    page: 1,
    limit: 200, // Get all skills since we have 161 skills
  });

  // Memoize ministry skills to prevent unnecessary re-renders
  const ministrySkills = useMemo(() => {
    return ministrySkillsResponse?.data || [];
  }, [ministrySkillsResponse?.data]);

  // Find selected ministry skill
  const selectedMinistrySkill = useMemo(() => {
    if (!value) return null;
    return ministrySkills.find((skill) => skill.id === value) || null;
  }, [value, ministrySkills]);

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
            !selectedMinistrySkill && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">
            {selectedMinistrySkill?.name || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search ministry skills..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="text-muted-foreground ml-2 text-sm">
                  Loading ministry skills...
                </span>
              </div>
            ) : (
              <>
                <CommandEmpty>No ministry skills found.</CommandEmpty>
                <CommandGroup>
                  {ministrySkills.map((skill) => (
                    <CommandItem
                      key={skill.id}
                      value={`${skill.name}-${skill.id}`}
                      onSelect={() => handleSelect(skill.id)}
                    >
                      <div className="flex w-full items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMinistrySkill?.id === skill.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{skill.name}</div>
                          {skill.description && (
                            <div className="text-muted-foreground text-xs">
                              {skill.description}
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
