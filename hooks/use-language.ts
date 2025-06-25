"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Language } from "@/components/ui/language-select"

/**
 * Custom hook to manage language selection and sync with URL query.
 * - Initializes from the `lang` query param, `initial` prop, or first language.
 * - Updates the URL query string when the language changes.
 */
export function useLanguage(languages: Language[], initial?: string) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getInitialLang = () => {
    const langFromQuery = searchParams.get("lang")
    if (langFromQuery && languages.some(l => l.code === langFromQuery)) {
      return langFromQuery
    }
    if (initial && languages.some(l => l.code === initial)) {
      return initial
    }
    // Default to English if available, otherwise first language
    const englishLang = languages.find(l => l.code === "en")
    return englishLang?.code || languages[0]?.code
  }

  const [selected, setSelected] = useState<string>(getInitialLang())

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (selected === "en") {
      params.delete("lang")
    } else {
      params.set("lang", selected)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    router.replace(newUrl, { scroll: false })
  }, [selected, router, searchParams])

  const currentLanguage =
    languages.find(l => l.code === selected) || languages[0]

  return {
    selected,
    setSelected,
    currentLanguage,
    languages,
  }
}
