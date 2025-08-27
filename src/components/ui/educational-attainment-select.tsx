"use client";

import * as React from "react";

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

// Educational attainment options for forms
const EDUCATIONAL_ATTAINMENT_OPTIONS = [
  "No Formal Education",
  "Preschool",
  "Elementary Undergraduate (Grades 1-5)",
  "Elementary Graduate (Grade 6)",
  "Junior High School Undergraduate (Grades 7-9)",
  "Junior High School Graduate (Grade 10)",
  "Senior High School Undergraduate (Grade 11)",
  "Senior High School Graduate (Grade 12)",
  "Vocational/Technical/Trade School Undergraduate",
  "Vocational/Technical/Trade School Graduate",
  "College Undergraduate",
  "College Graduate (Bachelor's Degree)",
  "Master's Degree Undergraduate",
  "Master's Degree Graduate",
  "Doctorate Degree Undergraduate",
  "Doctorate Degree Graduate (PhD, EdD, etc.)",
  "Postdoctoral Studies",
];

interface EducationalAttainmentSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function EducationalAttainmentSelect({
  value,
  onChange,
  placeholder = "Select educational attainment",
  className,
  disabled = false,
}: EducationalAttainmentSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          {value
            ? EDUCATIONAL_ATTAINMENT_OPTIONS.find(
                (option) => option.toLowerCase() === value.toLowerCase()
              )
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command>
          <CommandInput
            className="h-9"
            placeholder="Search educational level..."
          />
          <CommandList>
            <CommandEmpty>No educational level found.</CommandEmpty>
            <CommandGroup>
              {EDUCATIONAL_ATTAINMENT_OPTIONS.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === option.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default EducationalAttainmentSelect;
