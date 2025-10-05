"use client";

import React, { useState } from "react";
import { Church } from "lucide-react";

import AllChurches from "@/modules/church/components/all-churches";
import type { Church as ChurchType } from "@/modules/church/church-schema";

export default function ChurchPage() {
  const [selectedChurch, setSelectedChurch] = useState<ChurchType | null>(null);

  const handleSelectChurch = (church: ChurchType) => {
    setSelectedChurch(church);
    // You can add additional logic here like navigation or state updates
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Church className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-bold">Churches</h1>
              <p className="text-muted-foreground">
                Explore and manage churches in our network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        <AllChurches
          onSelectChurch={handleSelectChurch}
          selectedChurchId={selectedChurch?.id}
        />
      </main>
    </div>
  );
}
