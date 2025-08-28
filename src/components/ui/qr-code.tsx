"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import NextImage from "next/image";

import { Check, Copy, Download, QrCode } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QRCodeDialogProps {
  value: string;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  filename?: string;
  size?: number;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function QRCodeDialog({
  value,
  title = "QR Code",
  description = "Scan this QR code or copy the link below",
  trigger,
  filename,
  size = 256,
  isOpen,
  onClose,
}: QRCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Use controlled state if provided, otherwise use internal state
  const dialogIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const handleOpenChange = (open: boolean) => {
    if (onClose !== undefined) {
      if (!open) onClose();
    } else {
      setInternalIsOpen(open);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
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

      // Set canvas size with padding for text
      const padding = 40;
      const textHeight = 60;
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
          // Calculate logo position and size (smaller for better scanning)
          const logoSize = size * 0.15; // Reduced to 15% of QR code size
          const logoX = padding + (size - logoSize) / 2;
          const logoY = padding + (size - logoSize) / 2;

          // Draw white background circle for logo
          const centerX = logoX + logoSize / 2;
          const centerY = logoY + logoSize / 2;
          const radius = logoSize / 2 + 4; // Reduced padding

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fill();

          // Optional: Add subtle shadow/border
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw logo
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

          // Continue with text rendering and download
          renderTextAndDownload();
        };

        logo.onerror = () => {
          console.warn("Logo failed to load, proceeding without logo");
          renderTextAndDownload();
        };

        // Set logo source
        logo.src = "/images/logo-white.webp";

        // Function to render text and download
        function renderTextAndDownload() {
          if (!ctx) return; // Add null check for TypeScript

          // Add text below QR code
          ctx.fillStyle = "#000000";
          ctx.font = "14px Arial, sans-serif";
          ctx.textAlign = "center";

          // Split long URLs into multiple lines
          const maxWidth = canvas.width - padding * 2;
          const words = value.split("/");
          let lines: string[] = [];
          let currentLine = "";

          words.forEach((word) => {
            const testLine = currentLine + (currentLine ? "/" : "") + word;
            const metrics = ctx!.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine) {
            lines.push(currentLine);
          }

          // Limit to 3 lines and add ellipsis if needed
          if (lines.length > 3) {
            lines = lines.slice(0, 2);
            lines.push("...");
          }

          // Draw text lines
          const lineHeight = 16;
          const startY = size + padding + 20;
          lines.forEach((line, index) => {
            ctx!.fillText(line, canvas.width / 2, startY + index * lineHeight);
          });

          // Download the canvas as PNG
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = filename || `qr-code-${Date.now()}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success("QR Code downloaded successfully!");
            }
          }, "image/png");

          // Clean up the SVG URL
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
    <Dialog open={dialogIsOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code with Logo Overlay */}
          <div className="flex justify-center">
            <div
              className="relative rounded-lg border-2 border-gray-100 bg-white p-4 shadow-sm"
              ref={qrRef}
            >
              <QRCode
                size={size}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                value={value}
              />

              {/* Logo Overlay in the Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white p-1 shadow-sm">
                  <NextImage
                    alt="Logo"
                    className="h-6 w-auto object-contain"
                    height={24}
                    src="/images/logo-white.webp"
                    width={60}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Link Input with Copy Button */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                className="flex-1 font-mono text-xs"
                value={value}
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
                Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Download Button */}
          <div className="flex justify-center pt-2">
            <Button className="w-full" onClick={downloadQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simplified version for just displaying QR code without dialog
interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 128,
  className = "",
}: QRCodeDisplayProps) {
  return (
    <div className={`inline-block rounded-lg border bg-white p-2 ${className}`}>
      <QRCode
        size={size}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
        }}
        value={value}
      />
    </div>
  );
}

export default QRCodeDialog;
