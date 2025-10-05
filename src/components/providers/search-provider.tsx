"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import type { Member } from "@/modules/member/member-schema";
import type { ministers } from "@/modules/ministry/ministry-schema";
import { toast } from "sonner";

type Minister = typeof ministers.$inferSelect;

interface SearchResult {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  profilePicture?: string | null;
  imageUrl?: string | null;
  dateOfBirth: string | Date;
  churchName?: string | null;
  type: "member" | "minister";
}

interface SearchContextType {
  // Search state
  memberSearchQuery: string;
  ministerSearchQuery: string;
  memberResults: SearchResult[];
  ministerResults: SearchResult[];
  isSearchingMembers: boolean;
  isSearchingMinisters: boolean;

  // Search actions
  setMemberSearchQuery: (query: string) => void;
  setMinisterSearchQuery: (query: string) => void;
  searchMembers: (query: string) => Promise<void>;
  searchMinisters: (query: string) => Promise<void>;
  clearMemberSearch: () => void;
  clearMinisterSearch: () => void;
  clearAllSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [ministerSearchQuery, setMinisterSearchQuery] = useState("");
  const [memberResults, setMemberResults] = useState<SearchResult[]>([]);
  const [ministerResults, setMinisterResults] = useState<SearchResult[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const [isSearchingMinisters, setIsSearchingMinisters] = useState(false);

  const searchMembers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setMemberResults([]);
      return;
    }

    setIsSearchingMembers(true);
    try {
      const response = await fetch(
        `/api/member/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        const results: SearchResult[] = data.data.map(
          (member: Member & { churchName?: string }) => ({
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            middleName: member.middleName,
            profilePicture: member.profilePicture,
            dateOfBirth: member.birthdate || new Date(),
            churchName: member.churchName,
            type: "member" as const,
          })
        );
        setMemberResults(results);
      } else {
        setMemberResults([]);
      }
    } catch {
      toast.error("Error searching members. Please try again.");
      setMemberResults([]);
    } finally {
      setIsSearchingMembers(false);
    }
  }, []);

  const searchMinisters = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setMinisterResults([]);
      return;
    }

    setIsSearchingMinisters(true);
    try {
      const response = await fetch(
        `/api/minister/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        const results: SearchResult[] = data.data.map(
          (minister: Minister & { churchName?: string }) => ({
            id: minister.id,
            firstName: minister.firstName,
            lastName: minister.lastName,
            middleName: minister.middleName,
            imageUrl: minister.imageUrl,
            dateOfBirth: minister.dateOfBirth,
            churchName: minister.churchName,
            type: "minister" as const,
          })
        );
        setMinisterResults(results);
      } else {
        setMinisterResults([]);
      }
    } catch {
      toast.error("Error searching ministers. Please try again.");
      setMinisterResults([]);
    } finally {
      setIsSearchingMinisters(false);
    }
  }, []);

  const clearMemberSearch = useCallback(() => {
    setMemberSearchQuery("");
    setMemberResults([]);
  }, []);

  const clearMinisterSearch = useCallback(() => {
    setMinisterSearchQuery("");
    setMinisterResults([]);
  }, []);

  const clearAllSearches = useCallback(() => {
    clearMemberSearch();
    clearMinisterSearch();
  }, [clearMemberSearch, clearMinisterSearch]);

  const value: SearchContextType = {
    memberSearchQuery,
    ministerSearchQuery,
    memberResults,
    ministerResults,
    isSearchingMembers,
    isSearchingMinisters,
    setMemberSearchQuery,
    setMinisterSearchQuery,
    searchMembers,
    searchMinisters,
    clearMemberSearch,
    clearMinisterSearch,
    clearAllSearches,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
