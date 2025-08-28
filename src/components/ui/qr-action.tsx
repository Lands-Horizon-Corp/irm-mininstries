"use client";

import React, { useState } from "react";

import { QrCode } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PersonQRCode } from "@/components/ui/person-qr-code";

interface QRActionProps {
  id: number;
  name: string;
  type: "member" | "minister";
}

export function QRAction({ id, name, type }: QRActionProps) {
  const [isQROpen, setIsQROpen] = useState(false);

  const handleQRClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQROpen(true);
  };

  return (
    <>
      <DropdownMenuItem onClick={handleQRClick}>
        <QrCode className="mr-2 h-4 w-4" />
        Download QR
      </DropdownMenuItem>

      <PersonQRCode
        id={id}
        isOpen={isQROpen}
        name={name}
        type={type}
        onClose={() => setIsQROpen(false)}
      />
    </>
  );
}
