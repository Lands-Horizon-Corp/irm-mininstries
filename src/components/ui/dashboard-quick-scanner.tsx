"use client";

import { useState } from "react";

import { Scan, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRScanner } from "@/components/ui/qr-scanner";
import type { Member } from "@/modules/member/member-validation";
import type { Minister } from "@/modules/ministry/ministry-validation";

interface DashboardQuickScannerProps {
  onMemberAction?: (action: string, member: Member) => void;
  onMinisterAction?: (action: string, minister: Minister) => void;
}

export function DashboardQuickScanner({
  onMemberAction,
  onMinisterAction,
}: DashboardQuickScannerProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="text-primary h-5 w-5" />
            Quick Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            Scan member or minister QR codes for instant access to profiles and
            actions.
          </p>
          <Button className="w-full" onClick={() => setIsScannerOpen(true)}>
            <Scan className="mr-2 h-4 w-4" />
            Start QR Scanner
          </Button>
        </CardContent>
      </Card>

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onMemberAction={onMemberAction}
        onMinisterAction={onMinisterAction}
      />
    </>
  );
}
