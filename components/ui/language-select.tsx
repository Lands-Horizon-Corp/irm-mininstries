import React from "react"
import ReactCountryFlag from "react-country-flag"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Language = {
  code: string
  label: string
  countryCode: string
  title: string
}

type LanguageSelectProps = {
  languages: Language[]
  value: string
  onChange: (code: string) => void
  className?: string
  triggerProps?: React.ComponentProps<typeof SelectTrigger>
}

export function LanguageFlagLabel({
  lang,
  flagClass = "",
}: {
  lang: Language
  flagClass?: string
}) {
  return (
    <span className='flex items-center'>
      <ReactCountryFlag
        countryCode={lang.countryCode}
        svg
        className={cn("mr-2 rounded-full", flagClass)} // removed size-5
        title={lang.title}
        aria-label={`${lang.title} flag`}
      />
      <span className='font-semibold'>{lang.label}</span>
    </span>
  )
}

export function LanguageSelect({
  languages,
  value,
  onChange,
  className = "",
  triggerProps = {},
}: LanguageSelectProps) {
  const currentLanguage = languages.find(l => l.code === value) || languages[0]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`flex w-full items-center rounded-md border px-3 py-1 text-base font-medium transition hover:bg-[#F5F7FA] focus:ring-2 focus:ring-[#3f8ffd] md:w-full ${className}`}
        {...triggerProps}
      >
        <SelectValue asChild>
          <LanguageFlagLabel
            lang={currentLanguage}
            flagClass='mr-2 h-10 w-10 rounded-sm'
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className='w-full'>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            <LanguageFlagLabel lang={lang} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
