"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  AlertCircle,
  Camera,
  Check,
  FileImage,
  ImageIcon,
  MousePointer2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageCaptureProps {
  className?: string
  value?: File
  onChange?: (file?: File) => void
}

export default function ImageCapture({
  className = "",
  value = undefined,
  onChange,
}: ImageCaptureProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState("capture")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag and drop handlers
  const [dragActive, setDragActive] = useState(false)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Update previewUrl when value changes
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [value])

  const handleDragEvents = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isDragEnterOrOver = e.type === "dragenter" || e.type === "dragover"
    setDragActive(isDragEnterOrOver)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files?.[0]) handleImageFile(files[0])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) handleImageFile(files[0])
  }

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.")
      return
    }
    onChange?.(file)
    setError(null)
    stopCamera()
    setOpen(false)
  }

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch {
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // Start/stop camera on tab or dialog change
  useEffect(() => {
    if (open && tab === "capture" && !previewUrl) {
      startCamera()
    } else {
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab, previewUrl])

  const handleOpen = () => {
    setError(null)
    setOpen(true)
    setTab("capture")
  }

  const handleClose = () => {
    stopCamera()
    setOpen(false)
    setError(null)
  }

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.png`, {
            type: "image/png",
          })
          onChange?.(file)
          setError(null)
          stopCamera()
          setOpen(false)
        }
      }, "image/png")
    }
  }

  const handleRetake = () => {
    onChange?.(undefined)
    setTab("capture")
  }

  const handleRemove = () => {
    onChange?.(undefined)
  }

  return (
    <div className={className}>
      {/* Preview section outside dialog */}
      <div className='space-y-4'>
        {previewUrl && !open && (
          <div className='relative group w-full'>
            <div className='relative overflow-hidden rounded-lg border bg-muted/50 p-2 w-full'>
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt='Captured or Uploaded'
                className='rounded-md w-full h-48 object-cover'
                width={400}
                height={192}
                unoptimized
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg' />
            </div>
            <Button
              variant='destructive'
              size='sm'
              className='absolute top-1 right-1 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
              onClick={handleRemove}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        )}

        <Button
          variant={previewUrl ? "outline" : "default"}
          onClick={handleOpen}
          type='button'
          className='text-base font-medium'
          size='lg'
        >
          <ImageIcon className='mr-2 h-5 w-5' />
          {previewUrl ? "Change Image" : "Add Image"}
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={v => {
          if (!v) handleClose()
        }}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader className='space-y-3'>
            <DialogTitle className='text-xl font-semibold flex items-center gap-2'>
              <ImageIcon className='h-5 w-5' />
              Add Image
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-3 mb-6'>
              <TabsTrigger
                value='capture'
                className='flex items-center gap-1.5 text-sm'
              >
                <Camera className='h-4 w-4' />
                Camera
              </TabsTrigger>
              <TabsTrigger
                value='upload'
                className='flex items-center gap-1.5 text-sm'
              >
                <Upload className='h-4 w-4' />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value='drag'
                className='flex items-center gap-1.5 text-sm'
              >
                <MousePointer2 className='h-4 w-4' />
                Drop
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value='capture' className='space-y-4'>
              {!previewUrl ? (
                <div className='space-y-4'>
                  <div className='relative overflow-hidden rounded-lg border bg-muted/20'>
                    <video
                      ref={videoRef}
                      className='w-full h-64 object-cover bg-muted'
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className='hidden' />
                  </div>
                  <Button
                    onClick={handleCapture}
                    type='button'
                    className='w-full h-12 text-base font-medium'
                    size='lg'
                  >
                    <Camera className='h-5 w-5 mr-2' />
                    Take Photo
                  </Button>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value='upload' className='space-y-4'>
              {!previewUrl ? (
                <div className='space-y-4'>
                  <div
                    className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileImage className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                    <p className='text-sm text-muted-foreground mb-2'>
                      Click to select an image file
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Supports JPG, PNG, GIF, WebP
                    </p>
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                    type='button'
                    className='w-full h-12 text-base'
                    size='lg'
                  >
                    <Upload className='mr-2 h-5 w-5' />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value='drag' className='space-y-4'>
              {!previewUrl ? (
                <div
                  className={`
                    border-2 rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                    ${
                      dragActive
                        ? "border-primary bg-primary/5 border-solid"
                        : "border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20"
                    }
                  `}
                  onDragEnter={handleDragEvents}
                  onDragLeave={handleDragEvents}
                  onDragOver={handleDragEvents}
                  onDrop={handleDrop}
                >
                  <div
                    className={`transition-colors ${dragActive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <MousePointer2 className='mx-auto h-12 w-12 mb-4' />
                    <p className='text-base font-medium mb-2'>
                      {dragActive
                        ? "Drop your image here"
                        : "Drag & drop your image"}
                    </p>
                    <p className='text-sm opacity-75'>
                      Or click to browse files
                    </p>
                  </div>
                </div>
              ) : null}
            </TabsContent>

            {previewUrl && (
              <div className='space-y-4 pt-2'>
                <div className='relative overflow-hidden rounded-lg border bg-muted/20 p-2'>
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt='Preview'
                    className='rounded-md w-full h-48 object-cover'
                    width={400}
                    height={192}
                    unoptimized
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    onClick={handleRetake}
                    type='button'
                    className='flex-1 bg-transparent'
                  >
                    <RefreshCw className='h-4 w-4 mr-2' />
                    Retake
                  </Button>
                  <Button
                    variant='outline'
                    onClick={handleClose}
                    type='button'
                    className='flex-1 bg-transparent'
                  >
                    <X className='h-4 w-4 mr-2' />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setOpen(false)}
                    type='button'
                    className='flex-1'
                  >
                    <Check className='h-4 w-4 mr-2' />
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
