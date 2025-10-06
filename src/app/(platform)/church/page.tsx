"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import AllChurches from "@/modules/church/components/all-churches";
import type { Church as ChurchType } from "@/modules/church/church-schema";

function ChurchPageContent() {
  const [selectedChurch, setSelectedChurch] = useState<ChurchType | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const churchIdParam = searchParams.get("churchId");

  // Get selectedChurchId from URL or selected church
  const selectedChurchId = churchIdParam
    ? parseInt(churchIdParam, 10)
    : selectedChurch?.id;

  const handleSelectChurch = (church: ChurchType | null) => {
    setSelectedChurch(church);

    const params = new URLSearchParams(searchParams.toString());
    if (church) {
      // Update URL with the selected church ID
      params.set("churchId", church.id.toString());
    } else {
      // Remove churchId param when unselecting
      params.delete("churchId");
    }
    router.push(`/church?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="contact_us__container bg-secondary-background my-16 flex flex-col justify-center">
      <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-20 h-screen w-full bg-radial-[ellipse_at_100%_0%] to-100%" />
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_0%_50%] to-100%" />

      <div className="flex justify-center">
        <AllChurches
          onSelectChurch={handleSelectChurch}
          selectedChurchId={selectedChurchId}
        />
      </div>
    </div>
  );
}

export default function ChurchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChurchPageContent />
    </Suspense>
  );
}
