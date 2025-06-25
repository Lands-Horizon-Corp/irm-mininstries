"use client"

import { useCallback, useState } from "react"
import axios, { AxiosProgressEvent } from "axios"

interface UploadResponse {
  success: boolean
  data?: {
    key: string
    fileName: string
    originalName: string
    size: number
    type: string
    url: string
  }
  error?: string
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
  uploadedFile: UploadResponse["data"] | null
}

interface UseFileUploadOptions {
  folder?: string
  onSuccess?: (file: UploadResponse["data"]) => void
  onError?: (error: string) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { folder = "uploads", onSuccess, onError } = options

  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    uploadedFile: null,
  })

  const uploadFile = useCallback(
    async (file: File) => {
      setState({
        uploading: true,
        progress: 0,
        error: null,
        success: false,
        uploadedFile: null,
      })

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const response = await axios.post<UploadResponse>(
          "/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              )
              setState(prev => ({ ...prev, progress }))
            },
            timeout: 60000, // 60 seconds timeout
          }
        )

        if (response.data.success && response.data.data) {
          setState({
            uploading: false,
            progress: 100,
            error: null,
            success: true,
            uploadedFile: response.data.data,
          })
          onSuccess?.(response.data.data)
        } else {
          throw new Error(response.data.error || "Upload failed")
        }
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : error instanceof Error
              ? error.message
              : "Upload failed"

        setState({
          uploading: false,
          progress: 0,
          error: errorMessage,
          success: false,
          uploadedFile: null,
        })
        onError?.(errorMessage)
      }
    },
    [folder, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      uploadedFile: null,
    })
  }, [])

  return {
    ...state,
    uploadFile,
    reset,
  }
}

// Utility function to get presigned URL for secure downloads
export async function getPresignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  try {
    const response = await axios.post("/api/upload/presigned-url", {
      key,
      expiresIn,
    })

    if (response.data.success) {
      return response.data.data.url
    } else {
      throw new Error("Failed to get presigned URL")
    }
  } catch (error) {
    console.error("Error getting presigned URL:", error)
    throw error
  }
}

// Utility function to delete a file
export async function deleteFile(key: string): Promise<void> {
  try {
    const response = await axios.delete("/api/upload/delete", {
      data: { key },
    })

    if (!response.data.success) {
      throw new Error("Failed to delete file")
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}
