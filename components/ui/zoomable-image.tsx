"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ZoomableImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  thumbnailClassName?: string
  showControls?: boolean
  maxZoom?: number
  minZoom?: number
}

export function ZoomableImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  thumbnailClassName = "",
  showControls = true,
  maxZoom = 3,
  minZoom = 0.5,
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, maxZoom))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, minZoom))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`cursor-pointer transition-transform hover:scale-105 ${thumbnailClassName}`}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className={`rounded-lg shadow-lg border ${className}`}
          />
        </div>
      </DialogTrigger>

      <DialogContent className='max-w-4xl w-full h-[80vh] p-0'>
        <DialogTitle className='sr-only'>{alt}</DialogTitle>
        <DialogDescription className='sr-only'>
          Zoomable image viewer with pan and zoom controls
        </DialogDescription>
        <div className='relative w-full h-full bg-black rounded-lg overflow-hidden'>
          {/* Controls */}
          {showControls && (
            <div className='absolute top-4 right-4 z-10 flex gap-2'>
              <Button
                variant='secondary'
                size='icon'
                onClick={handleZoomIn}
                disabled={scale >= maxZoom}
              >
                <ZoomIn className='w-4 h-4' />
              </Button>
              <Button
                variant='secondary'
                size='icon'
                onClick={handleZoomOut}
                disabled={scale <= minZoom}
              >
                <ZoomOut className='w-4 h-4' />
              </Button>
              <Button variant='secondary' size='icon' onClick={handleReset}>
                <RotateCcw className='w-4 h-4' />
              </Button>
              <Button variant='secondary' size='icon' onClick={handleClose}>
                <X className='w-4 h-4' />
              </Button>
            </div>
          )}

          {/* Zoom level indicator */}
          {showControls && (
            <div className='absolute top-4 left-4 z-10 bg-black/50 text-white px-2 py-1 rounded text-sm'>
              {Math.round(scale * 100)}%
            </div>
          )}

          {/* Image container */}
          <div
            className='w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={800}
              height={600}
              className='max-w-full max-h-full object-contain transition-transform duration-200'
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor:
                  scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
              draggable={false}
            />
          </div>

          {/* Instructions */}
          {showControls && (
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded text-sm text-center'>
              Use zoom buttons or drag to pan when zoomed in
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
