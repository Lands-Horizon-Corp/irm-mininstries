"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

import { Check, CheckCircle, Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemberSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberId: number | null;
  mode?: "create" | "edit";
}

export function MemberSuccessDialog({
  isOpen,
  onClose,
  memberName,
  memberId,
  mode = "create",
}: MemberSuccessDialogProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR code data
  const qrData = JSON.stringify({
    id: memberId,
    type: "member",
  });

  const handleReturnHome = () => {
    router.push("/");
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      toast.success("QR data copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy QR data:", error);
      toast.error("Failed to copy QR data");
    }
  };

  const downloadQRCode = () => {
    const qrContainer = qrRef.current;
    const qrElement = qrContainer?.querySelector("svg");
    if (!qrElement) {
      toast.error("QR Code not found");
      return;
    }

    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Canvas not supported");
        return;
      }

      const size = 256;
      const padding = 40;
      const textHeight = 80;
      canvas.width = size + padding * 2;
      canvas.height = size + padding * 2 + textHeight;

      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(qrElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Draw QR code
        ctx.drawImage(img, padding, padding, size, size);

        // Load and draw the logo in the center
        const logo = new Image();
        logo.onload = () => {
          const logoSize = size * 0.15;
          const logoX = padding + (size - logoSize) / 2;
          const logoY = padding + (size - logoSize) / 2;

          // Draw white background circle for logo
          const centerX = logoX + logoSize / 2;
          const centerY = logoY + logoSize / 2;
          const radius = logoSize / 2 + 4;

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fill();

          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw logo
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

          renderTextAndDownload();
        };

        logo.onerror = () => {
          console.warn("Logo failed to load, proceeding without logo");
          renderTextAndDownload();
        };

        logo.src = "/images/logo-white.webp";

        function renderTextAndDownload() {
          if (!ctx) return;

          // Add member name and ID below QR code
          ctx.fillStyle = "#000000";
          ctx.font = "16px Arial, sans-serif";
          ctx.textAlign = "center";

          const textY = size + padding + 30;
          ctx.fillText(`Member: ${memberName}`, canvas.width / 2, textY);
          ctx.font = "12px Arial, sans-serif";
          ctx.fillText(`ID: ${memberId}`, canvas.width / 2, textY + 25);

          // Download the canvas as PNG
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `member-qr-${memberId}-${memberName
                .toLowerCase()
                .replace(/\s+/g, "-")}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success("QR Code downloaded successfully!");
            }
          }, "image/png");

          URL.revokeObjectURL(svgUrl);
        }
      };

      img.onerror = () => {
        toast.error("Failed to generate QR Code image");
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR Code");
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="my-0 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="!my-0 text-xl font-semibold text-gray-900">
            Member Registration {mode === "edit" ? "Updated" : "Completed"}{" "}
            Successfully!
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-500">
            The registration for <strong>{memberName}</strong> has been
            successfully {mode === "edit" ? "updated" : "completed"} and saved
            to the member database.
          </DialogDescription>
        </DialogHeader>

        {/* QR Code Section */}
        {memberId && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Member QR Code
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Use this QR code to quickly access member information
              </p>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center">
              <div
                className="relative rounded-lg border-2 border-gray-100 bg-white p-4 shadow-sm"
                ref={qrRef}
              >
                <QRCode
                  size={200}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  value={qrData}
                />

                {/* Logo Overlay in the Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white p-1 shadow-sm">
                    <NextImage
                      alt="Logo"
                      className="h-5 w-auto object-contain"
                      height={20}
                      src="/images/logo-white.webp"
                      width={50}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QR Data Input with Copy Button */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">QR Data</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  className="flex-1 font-mono text-xs"
                  value={qrData}
                />
                <Button
                  className="shrink-0"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600">
                  QR data copied to clipboard!
                </p>
              )}
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <Button
                className="w-full"
                variant="outline"
                onClick={downloadQRCode}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button className="w-full sm:w-auto" onClick={handleReturnHome}>
            Return Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
