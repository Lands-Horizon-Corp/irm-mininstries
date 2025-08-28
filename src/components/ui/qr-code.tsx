"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";

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
}

export function QRCodeDialog({
  value,
  title = "QR Code",
  description = "Scan this QR code or copy the link below",
  trigger,
  filename,
  size = 256,
  className = "",
}: QRCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

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
    const qrElement = qrRef.current?.querySelector("svg");
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
          const metrics = ctx.measureText(testLine);
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
          ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
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

        URL.revokeObjectURL(svgUrl);
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

  const defaultTrigger = (
    <Button className={className} size="sm" variant="outline">
      <QrCode className="mr-2 h-4 w-4" />
      Show QR Code
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
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
          {/* QR Code */}
          <div className="flex justify-center">
            <div
              className="rounded-lg border-2 border-gray-100 bg-white p-4 shadow-sm"
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
