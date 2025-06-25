"use client"

import React, { useRef, useState } from "react"
import { File, Image as ImageIcon, Upload, X } from "lucide-react"

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
  multiple?: boolean
  className?: string
  onUploadSuccess?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
}

export default function FileUpload({
  folder = "uploads",
  accept = "image/*,.pdf,.doc,.docx,.txt",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  className = "",
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const { uploading, progress, error, uploadFile, reset } = useFileUpload({
    folder,
    onSuccess: file => {
      if (file) {
        const newFiles = [...uploadedFiles, file]
        setUploadedFiles(newFiles)
        onUploadSuccess?.(newFiles)
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
    if (uploading) return

    const file = files[0] // For now, handle one file at a time

    // Validate file size
    if (file.size > maxSize) {
      onUploadError?.(`File size exceeds ${formatFileSize(maxSize)} limit`)
      return
    }

    await uploadFile(file)
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUploadSuccess?.(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className='h-4 w-4' />
    }
    return <File className='h-4 w-4' />
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className='hidden'
          disabled={uploading}
        />

        {uploading ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <Upload className='h-8 w-8 animate-spin text-blue-500' />
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>Uploading...</p>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className='text-xs text-gray-500'>{progress}%</p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <Upload className='h-8 w-8 text-gray-400' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>
                Drag and drop your file here, or{" "}
                <button
                  type='button'
                  className='text-blue-600 hover:text-blue-800 font-medium'
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                Max size: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-sm text-red-600'>{error}</p>
          <Button variant='outline' size='sm' onClick={reset} className='mt-2'>
            Try Again
          </Button>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className='mt-4 space-y-2'>
          <h4 className='text-sm font-medium text-gray-700'>Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md'
            >
              <div className='flex items-center space-x-3'>
                {getFileIcon(file.type)}
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {file.originalName}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => removeFile(index)}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
