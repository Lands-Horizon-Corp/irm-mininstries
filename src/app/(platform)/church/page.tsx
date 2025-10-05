"use client";

import React, { useState } from "react";

import AllChurches from "@/modules/church/components/all-churches";
import type { Church as ChurchType } from "@/modules/church/church-schema";

export default function ChurchPage() {
  const [selectedChurch, setSelectedChurch] = useState<ChurchType | null>(null);

  const handleSelectChurch = (church: ChurchType) => {
    setSelectedChurch(church);
  };

  return (
    <div className="contact_us__container bg-secondary-background my-16 flex flex-col justify-center">
      <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-20 h-screen w-full bg-radial-[ellipse_at_100%_0%] to-100%" />
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_0%_50%] to-100%" />

      <div className="flex justify-center">
        <AllChurches
          onSelectChurch={handleSelectChurch}
          selectedChurchId={selectedChurch?.id}
        />
      </div>
    </div>
  );
}
