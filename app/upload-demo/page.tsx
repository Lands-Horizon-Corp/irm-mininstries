"use client"

import { Suspense } from "react"

import FileUpload from "@/components/ui/file-upload"

interface UploadedFile {
  key: string
  fileName: string
  originalName: string
  size: number
  type: string
  url: string
}

function UploadDemoContent() {
  const handleUploadSuccess = (files: UploadedFile[]) => {
    console.log("Uploaded files:", files)
    // Handle successful uploads here
  }

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error)
    // Handle upload errors here
  }

  return (
    <div className='container mx-auto p-6 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-8'>File Upload Demo</h1>

      <div className='space-y-8'>
        <div>
          <h2 className='text-xl font-semibold mb-4'>General File Upload</h2>
          <FileUpload
            folder='general'
            accept='image/*,.pdf,.doc,.docx,.txt'
            maxSize={10 * 1024 * 1024} // 10MB
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Image Upload Only</h2>
          <FileUpload
            folder='images'
            accept='image/*'
            maxSize={5 * 1024 * 1024} // 5MB
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Document Upload</h2>
          <FileUpload
            folder='documents'
            accept='.pdf,.doc,.docx,.txt'
            maxSize={20 * 1024 * 1024} // 20MB
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>
      </div>
    </div>
  )
}

export default function UploadDemo() {
  return (
    <Suspense fallback={<div>Loading upload demo...</div>}>
      <UploadDemoContent />
    </Suspense>
  )
}
