"use client"

import React, { useRef, useState } from "react"
import {
  File,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"

interface UploadedFile {
  key: string
  fileName: string
  originalName: string
  size: number
  type: string
  url: string
}

interface FileUploadProps {
  folder?: string
  accept?: string
  maxSize?: number
  className?: string
  onUploadSuccess?: (file: UploadedFile | null) => void
  onUploadError?: (error: string) => void
}

export default function FileUpload({
  folder = "uploads",
  accept = "image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.mp4,.avi,.mov",
  maxSize = 10 * 1024 * 1024,
  className = "",
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  const { uploading, progress, error, uploadFile, reset } = useFileUpload({
    folder,
    onSuccess: file => {
      if (file) {
        setUploadedFile(file)
        onUploadSuccess?.(file)
      }
    },
    onError: error => {
      onUploadError?.(error)
    },
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (uploading || uploadedFile) return
    const file = files[0]
    if (file.size > maxSize) {
      onUploadError?.(`File size exceeds ${formatFileSize(maxSize)} limit`)
      return
    }
    await uploadFile(file)
  }

  const removeFile = () => {
    setUploadedFile(null)
    onUploadSuccess?.(null)
    reset()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // File type icon logic
  const getFileIcon = (type: string, name?: string) => {
    if (type.startsWith("image/"))
      return <ImageIcon className='size-5 text-blue-500 dark:text-blue-400' />
    if (type.startsWith("video/"))
      return (
        <FileVideo className='size-5 text-purple-500 dark:text-purple-400' />
      )
    if (type === "application/pdf" || (name && name.match(/\.pdf$/i)))
      return <FileText className='size-5 text-red-500 dark:text-red-400' />
    if (
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.ms-excel" ||
      (name && name.match(/\.(xlsx|xls)$/i))
    )
      return (
        <FileSpreadsheet className='size-5 text-green-600 dark:text-green-400' />
      )
    if (
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword" ||
      (name && name.match(/\.(docx|doc)$/i))
    )
      return <FileText className='size-5 text-blue-700 dark:text-blue-300' />
    if (type.startsWith("text/"))
      return <FileText className='size-5 text-gray-500 dark:text-gray-300' />
    return <File className='size-5 text-muted-foreground' />
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive
            ? "border-primary bg-accent"
            : "border-border bg-background hover:border-accent",
          (uploading || uploadedFile) && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          onChange={handleChange}
          className='hidden'
          disabled={uploading || !!uploadedFile}
        />

        {uploading ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <Upload className='size-8 animate-spin text-primary' />
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Uploading...</p>
              <div className='w-full bg-muted rounded-full h-2'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className='text-xs text-muted-foreground'>{progress}%</p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <Upload className='size-8 text-green-600 dark:text-green-400' />
            </div>
            <div>
              <p className='text-sm text-green-700 dark:text-green-400 font-medium'>
                File uploaded successfully!
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Remove the current file to upload a new one
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <Upload className='size-8 text-muted-foreground' />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>
                Drag and drop your file here, or{" "}
                <button
                  type='button'
                  className='text-primary hover:underline font-medium'
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Max size: {formatFileSize(maxSize)} • One file only
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className='mt-4 p-3 bg-destructive/10 border border-destructive rounded-md'>
          <p className='text-sm text-destructive'>{error}</p>
          <Button variant='outline' size='sm' onClick={reset} className='mt-2'>
            Try Again
          </Button>
        </div>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && (
        <div className='mt-4'>
          <h4 className='text-sm font-medium text-muted-foreground mb-2'>
            Uploaded File:
          </h4>
          <div className='flex items-center justify-between p-3 bg-accent border border-border rounded-md'>
            <div className='flex items-center space-x-3'>
              {getFileIcon(uploadedFile.type, uploadedFile.fileName)}
              <div>
                <p className='text-sm font-medium text-foreground'>
                  {uploadedFile.originalName}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <Button variant='outline' size='sm' onClick={removeFile}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
