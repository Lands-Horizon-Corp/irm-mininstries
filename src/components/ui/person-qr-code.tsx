"use client";

import { QRCodeDialog } from "@/components/ui/qr-code";

interface PersonQRCodeProps {
  id: number;
  type: "member" | "minister";
  name?: string;
  trigger?: React.ReactNode;
  filename?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function PersonQRCode({
  id,
  type,
  name,
  trigger,
  filename,
  isOpen,
  onClose,
}: PersonQRCodeProps) {
  // Generate QR code data
  const qrData = JSON.stringify({
    id,
    type,
  });

  const title = `${type === "member" ? "Member" : "Minister"} QR Code`;
  const description = name
    ? `QR code for ${name} - ${type}`
    : `Scan this QR code to view ${type} profile`;

  const defaultFilename =
    filename ||
    `${type}-${id}-${name?.toLowerCase().replace(/\s+/g, "-") || "profile"}`;

  return (
    <QRCodeDialog
      description={description}
      filename={defaultFilename}
      isOpen={isOpen}
      title={title}
      trigger={trigger}
      value={qrData}
      onClose={onClose}
    />
  );
}
