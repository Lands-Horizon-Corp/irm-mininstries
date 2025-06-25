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

const DEFAULT_ACCEPT = "image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.mp4,.avi,.mov"
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024

const FILE_SIZE_UNITS = ["Bytes", "KB", "MB", "GB"] as const

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${FILE_SIZE_UNITS[i]}`
}

const getFileIcon = (type: string, name?: string) => {
  const iconClasses = "size-5"

  if (type.startsWith("image/")) {
    return (
      <ImageIcon
        className={`${iconClasses} text-blue-500 dark:text-blue-400`}
      />
    )
  }

  if (type.startsWith("video/")) {
    return (
      <FileVideo
        className={`${iconClasses} text-purple-500 dark:text-purple-400`}
      />
    )
  }

  if (type === "application/pdf" || name?.match(/\.pdf$/i)) {
    return (
      <FileText className={`${iconClasses} text-red-500 dark:text-red-400`} />
    )
  }

  const isSpreadsheet =
    [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ].includes(type) || name?.match(/\.(xlsx|xls)$/i)

  if (isSpreadsheet) {
    return (
      <FileSpreadsheet
        className={`${iconClasses} text-green-600 dark:text-green-400`}
      />
    )
  }

  const isDocument =
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ].includes(type) || name?.match(/\.(docx|doc)$/i)

  if (isDocument) {
    return (
      <FileText className={`${iconClasses} text-blue-700 dark:text-blue-300`} />
    )
  }

  if (type.startsWith("text/")) {
    return (
      <FileText className={`${iconClasses} text-gray-500 dark:text-gray-300`} />
    )
  }

  return <File className={`${iconClasses} text-muted-foreground`} />
}

export default function FileUpload({
  folder = "uploads",
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
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

  const isDisabled = uploading || !!uploadedFile

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
    if (files?.[0]) {
      handleFiles(files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files
    if (files?.[0]) {
      handleFiles(files)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (isDisabled) return

    const file = files[0]
    if (file.size > maxSize) {
      onUploadError?.(`File size exceeds ${formatFileSize(maxSize)} limit`)
      return
    }

    await uploadFile(file)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    onUploadSuccess?.(null)
    reset()
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  // Component render helpers
  const renderUploadingState = () => (
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
  )

  const renderSuccessState = () => (
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
  )

  const renderIdleState = () => (
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
            onClick={handleBrowseClick}
          >
            browse
          </button>
        </p>
        <p className='text-xs text-muted-foreground mt-1'>
          Max size: {formatFileSize(maxSize)} • One file only
        </p>
      </div>
    </div>
  )

  const renderUploadArea = () => {
    if (uploading) return renderUploadingState()
    if (uploadedFile) return renderSuccessState()
    return renderIdleState()
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
          isDisabled && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDragEvents}
        onDragLeave={handleDragEvents}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          onChange={handleChange}
          className='hidden'
          disabled={isDisabled}
        />
        {renderUploadArea()}
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
            <Button variant='outline' size='sm' onClick={handleRemoveFile}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
