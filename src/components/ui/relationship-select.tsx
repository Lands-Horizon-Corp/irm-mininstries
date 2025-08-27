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

// Relationship options for emergency contacts and family relationships
const RELATIONSHIP_OPTIONS = [
  "Husband",
  "Wife",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Children",
  "Guardian",
  "Friend",
  "Girlfriend",
  "Boyfriend",
  "Partner",
  "Spouse",
  "Grandparent",
  "Grandmother",
  "Grandfather",
  "Grandchild",
  "Uncle",
  "Aunt",
  "Nephew",
  "Niece",
  "Cousin",
  "In-law",
  "Stepparent",
  "Stepchild",
  "Colleague",
  "Neighbor",
  "Other",
];

interface RelationshipSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RelationshipSelect({
  value,
  onChange,
  placeholder = "Select relationship",
  className,
  disabled = false,
}: RelationshipSelectProps) {
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
            ? RELATIONSHIP_OPTIONS.find(
                (relationship) =>
                  relationship.toLowerCase() === value.toLowerCase()
              )
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            className="h-9 w-full"
            placeholder="Search relationship..."
          />
          <CommandList>
            <CommandEmpty>No relationship found.</CommandEmpty>
            <CommandGroup>
              {RELATIONSHIP_OPTIONS.map((relationship) => (
                <CommandItem
                  key={relationship}
                  value={relationship}
                  onSelect={() => {
                    onChange(relationship);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === relationship.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {relationship}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default RelationshipSelect;
