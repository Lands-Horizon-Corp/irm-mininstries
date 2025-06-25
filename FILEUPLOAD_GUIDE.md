# FileUpload Component Usage Guide

The `FileUpload` component is a flexible, reusable file upload component with drag & drop support, progress tracking, and error handling.

## Basic Usage

```tsx
import FileUpload from "@/components/ui/file-upload"

function MyComponent() {
  const handleUploadSuccess = file => {
    if (file) {
      console.log("File uploaded:", file)
      // Handle successful upload
    } else {
      console.log("File removed")
      // Handle file removal
    }
  }

  const handleUploadError = error => {
    console.error("Upload failed:", error)
    // Handle upload error
  }

  return (
    <FileUpload
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
    />
  )
}
```

## Props

| Prop              | Type                                   | Default                                                    | Description                                    |
| ----------------- | -------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `folder`          | `string`                               | `"uploads"`                                                | S3 folder to upload to                         |
| `accept`          | `string`                               | `"image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.mp4,.avi,.mov"` | File types to accept                           |
| `maxSize`         | `number`                               | `10 * 1024 * 1024` (10MB)                                  | Maximum file size in bytes                     |
| `className`       | `string`                               | `""`                                                       | Additional CSS classes                         |
| `onUploadSuccess` | `(file: UploadedFile \| null) => void` | -                                                          | Called when upload succeeds or file is removed |
| `onUploadError`   | `(error: string) => void`              | -                                                          | Called when upload fails                       |

## UploadedFile Interface

```tsx
interface UploadedFile {
  key: string // S3 object key
  fileName: string // Generated filename
  originalName: string // Original filename
  size: number // File size in bytes
  type: string // MIME type
  url: string // Public URL to access the file
}
```

## Examples

### Image Upload Only

```tsx
<FileUpload
  folder='images'
  accept='image/*'
  maxSize={5 * 1024 * 1024} // 5MB
  onUploadSuccess={file => {
    if (file) {
      console.log("Image uploaded:", file.url)
    }
  }}
/>
```

### Document Upload

```tsx
<FileUpload
  folder='documents'
  accept='.pdf,.doc,.docx,.xlsx,.xls'
  maxSize={20 * 1024 * 1024} // 20MB
  onUploadSuccess={file => {
    if (file) {
      // Save document info to database
      saveDocument(file)
    }
  }}
/>
```

### Video Upload

```tsx
<FileUpload
  folder='videos'
  accept='video/*'
  maxSize={100 * 1024 * 1024} // 100MB
  onUploadSuccess={file => {
    if (file) {
      console.log("Video uploaded:", file.url)
    }
  }}
/>
```

### With State Management

```tsx
function MyForm() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = file => {
    setUploadedFile(file)
  }

  const submitForm = async () => {
    if (!uploadedFile) {
      alert("Please upload a file")
      return
    }

    setIsSubmitting(true)
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileKey: uploadedFile.key,
          fileName: uploadedFile.originalName,
          // ... other form data
        }),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <FileUpload onUploadSuccess={handleFileUpload} />
      <button onClick={submitForm} disabled={!uploadedFile || isSubmitting}>
        Submit
      </button>
    </div>
  )
}
```

## Features

- **Drag & Drop**: Users can drag files onto the upload area
- **File Type Validation**: Automatically validates file types based on `accept` prop
- **Size Validation**: Validates file size based on `maxSize` prop
- **Progress Tracking**: Shows upload progress with animated progress bar
- **Error Handling**: Displays error messages with retry functionality
- **File Preview**: Shows uploaded file info with removal option
- **Responsive**: Works on all device sizes
- **Accessible**: Keyboard navigation and screen reader support

## Styling

The component uses Tailwind CSS classes and follows your design system. You can:

1. Add custom classes via the `className` prop
2. Modify the component's CSS classes directly
3. Use CSS variables for theming

## Backend Requirements

The component expects your upload API (`/api/upload`) to:

1. Accept `multipart/form-data` with a `file` field
2. Accept an optional `folder` field
3. Return a JSON response with this structure:

```json
{
  "success": true,
  "data": {
    "key": "uploads/filename.jpg",
    "fileName": "generated-filename.jpg",
    "originalName": "original-filename.jpg",
    "size": 1234567,
    "type": "image/jpeg",
    "url": "https://your-s3-bucket.s3.amazonaws.com/uploads/filename.jpg"
  }
}
```

## Error Handling

The component handles various error scenarios:

- File too large
- Invalid file type
- Network errors
- Server errors
- Upload timeouts

All errors are displayed to the user with appropriate messaging and retry options.
