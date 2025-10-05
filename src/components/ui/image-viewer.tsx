"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageViewerProps {
  src: string | File | null;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({
  src,
  alt = "Image",
  isOpen,
  onClose,
}: ImageViewerProps) {
  if (!src) return null;

  const imageSrc = typeof src === "string" ? src : URL.createObjectURL(src);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto max-h-[80vh] w-full max-w-[95vw] p-0">
        <DialogTitle className="sr-only">Bildanzeige - {alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Image viewer with zoom and pan functionality
        </DialogDescription>
        <div className="relative flex h-full w-full items-center justify-center bg-gray-400">
          {/* Zoom + Pan wrapper */}
          <TransformWrapper
            doubleClick={{ disabled: false }}
            initialScale={1}
            maxScale={5}
            minScale={0.5}
            pinch={{ step: 0.2 }}
            wheel={{ step: 0.2 }}
          >
            <TransformComponent>
              <Image
                alt={alt}
                className="h-auto max-h-[80vh] w-full object-contain"
                height={1080}
                sizes="95vw"
                src={imageSrc}
                width={1920}
                onLoad={() => {
                  if (src instanceof File) {
                    setTimeout(() => URL.revokeObjectURL(imageSrc), 1000);
                  }
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
}
