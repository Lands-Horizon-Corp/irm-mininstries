"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Image from "next/image";
import {
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const transformFunctionsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetTransform: () => void;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFlipHorizontal(false);
      setFlipVertical(false);
      setRotation(0);
      setDimensions(null);
    }
  }, [isOpen]);

  if (!src) return null;

  const imageSrc = typeof src === "string" ? src : URL.createObjectURL(src);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTransform = () => {
    const transforms = [];
    if (flipHorizontal) transforms.push("scaleX(-1)");
    if (flipVertical) transforms.push("scaleY(-1)");
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    return transforms.join(" ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-auto max-h-[90vh] w-full max-w-[95vw] flex-col p-0">
        <DialogTitle className="sr-only">Bildanzeige - {alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Image viewer with zoom, pan, flip, and rotation functionality
        </DialogDescription>

        {/* Image Container */}
        <div className="bg-muted relative flex h-full min-h-[60vh] w-full flex-1 items-center justify-center">
          <TransformWrapper
            doubleClick={{ disabled: false }}
            initialScale={1}
            maxScale={5}
            minScale={0.5}
            pinch={{ step: 0.2 }}
            wheel={{ step: 0.2 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => {
              // Store the transform functions for the toolbar using ref
              transformFunctionsRef.current = {
                zoomIn,
                zoomOut,
                resetTransform,
              };

              return (
                <TransformComponent>
                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                      alt={alt}
                      className="max-h-[75vh] w-auto object-contain"
                      height={1080}
                      sizes="95vw"
                      src={imageSrc || "/placeholder.svg"}
                      width={1920}
                      style={{
                        transform: getTransform(),
                        transition: "transform 0.3s ease",
                      }}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        setDimensions({
                          width: img.naturalWidth,
                          height: img.naturalHeight,
                        });

                        if (src instanceof File) {
                          setTimeout(() => URL.revokeObjectURL(imageSrc), 1000);
                        }
                      }}
                    />
                  </div>
                </TransformComponent>
              );
            }}
          </TransformWrapper>
        </div>

        {/* Bottom Toolbar */}
        <DialogFooter className="bg-background/50 border-t p-4 backdrop-blur">
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFlipHorizontal(!flipHorizontal)}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFlipVertical(!flipVertical)}
              title="Flip Vertical"
            >
              <FlipVertical className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              title="Rotate 90°"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <div className="bg-border mx-2 h-6 w-px" />

            <Button
              size="icon"
              variant="ghost"
              onClick={() => transformFunctionsRef.current?.zoomIn()}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => transformFunctionsRef.current?.zoomOut()}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => transformFunctionsRef.current?.resetTransform()}
              title="Reset Zoom"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            <div className="bg-border mx-2 h-6 w-px" />

            <Button
              size="icon"
              variant="ghost"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>

            {dimensions && (
              <>
                <div className="bg-border mx-2 h-6 w-px" />
                <div className="text-muted-foreground px-2 text-sm">
                  {dimensions.width} × {dimensions.height}
                </div>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
