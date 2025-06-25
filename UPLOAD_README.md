# File Upload System with S3 (Tigris) Integration

This is a secure file upload system for your Next.js application using AWS S3-compatible storage (Tigris) with comprehensive security features.

## Features

- ✅ Secure file uploads to S3-compatible storage (Tigris)
- ✅ Rate limiting and security validation
- ✅ File type and size validation
- ✅ Presigned URLs for secure downloads
- ✅ File deletion capabilities
- ✅ Progress tracking with axios
- ✅ Drag and drop interface
- ✅ TypeScript support
- ✅ Comprehensive error handling

## Environment Configuration

Add the following environment variables to your `.env.local` file:

```env
# S3 Storage Configuration
STORAGE_DRIVER=s3
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
STORAGE_BUCKET=your_bucket_name
STORAGE_URL=fly.storage.tigris.dev
STORAGE_REGION=auto
STORAGE_MAX_SIZE=1000000000

# Security
UPLOAD_TOKEN_SECRET=your-upload-token-secret-here
```

## Usage

### Basic File Upload Component

```tsx
import FileUpload from "@/components/ui/file-upload"

function MyComponent() {
  const handleUploadSuccess = files => {
    console.log("Uploaded files:", files)
  }

  const handleUploadError = error => {
    console.error("Upload error:", error)
  }

  return (
    <FileUpload
      folder='my-uploads'
      accept='image/*,.pdf,.doc,.docx'
      maxSize={10 * 1024 * 1024} // 10MB
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
    />
  )
}
```

### Using the Upload Hook

```tsx
import { useFileUpload } from "@/hooks/use-file-upload"

function CustomUpload() {
  const { uploading, progress, error, uploadFile, reset } = useFileUpload({
    folder: "custom",
    onSuccess: file => console.log("Uploaded:", file),
    onError: error => console.error("Error:", error),
  })

  const handleFileSelect = async (file: File) => {
    await uploadFile(file)
  }

  return (
    <div>
      {uploading && <div>Progress: {progress}%</div>}
      {error && <div>Error: {error}</div>}
      <input
        type='file'
        onChange={e =>
          e.target.files?.[0] && handleFileSelect(e.target.files[0])
        }
      />
    </div>
  )
}
```

### Getting Presigned URLs for Downloads

```tsx
import { getPresignedUrl } from "@/hooks/use-file-upload"

async function downloadFile(fileKey: string) {
  try {
    const url = await getPresignedUrl(fileKey, 3600) // 1 hour expiry
    window.open(url, "_blank")
  } catch (error) {
    console.error("Download error:", error)
  }
}
```

### Deleting Files

```tsx
import { deleteFile } from "@/hooks/use-file-upload"

async function removeFile(fileKey: string) {
  try {
    await deleteFile(fileKey)
    console.log("File deleted successfully")
  } catch (error) {
    console.error("Delete error:", error)
  }
}
```

## API Endpoints

### POST /api/upload

Upload a file to S3 storage.

**Request:**

- `file`: File to upload (multipart/form-data)
- `folder`: Optional folder name (default: "uploads")

**Response:**

```json
{
  "success": true,
  "data": {
    "key": "uploads/1234567890-abcdef.jpg",
    "fileName": "1234567890-abcdef.jpg",
    "originalName": "my-image.jpg",
    "size": 102400,
    "type": "image/jpeg",
    "url": "https://fly.storage.tigris.dev/your-bucket/uploads/1234567890-abcdef.jpg"
  }
}
```

### POST /api/upload/presigned-url

Get a presigned URL for secure file downloads.

**Request:**

```json
{
  "key": "uploads/1234567890-abcdef.jpg",
  "expiresIn": 3600
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://presigned-url...",
    "expiresIn": 3600,
    "expiresAt": "2025-06-25T12:00:00.000Z"
  }
}
```

### DELETE /api/upload/delete

Delete a file from S3 storage.

**Request:**

```json
{
  "key": "uploads/1234567890-abcdef.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Security Features

### Rate Limiting

- 10 uploads per minute per IP address
- Automatic cleanup of old rate limit entries

### File Validation

- File type validation against allowed MIME types
- File size validation
- Suspicious filename detection
- Path traversal protection

### Secure File Names

- Random file name generation
- Timestamp prefixing
- Extension preservation
- Special character sanitization

### Default Allowed File Types

- Images: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Documents: `application/pdf`, `text/plain`
- Microsoft Office: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Configuration Options

### FileUpload Component Props

| Prop              | Type       | Default                          | Description                   |
| ----------------- | ---------- | -------------------------------- | ----------------------------- |
| `folder`          | `string`   | `"uploads"`                      | Upload folder in S3 bucket    |
| `accept`          | `string`   | `"image/*,.pdf,.doc,.docx,.txt"` | Accepted file types           |
| `maxSize`         | `number`   | `10 * 1024 * 1024`               | Maximum file size in bytes    |
| `multiple`        | `boolean`  | `false`                          | Allow multiple file selection |
| `className`       | `string`   | `""`                             | Additional CSS classes        |
| `onUploadSuccess` | `function` | -                                | Success callback              |
| `onUploadError`   | `function` | -                                | Error callback                |

## Testing

Visit `/upload-demo` to test the upload functionality with different file types and configurations.

## Error Handling

The system includes comprehensive error handling for:

- Invalid file types
- File size exceeded
- Rate limiting
- Network errors
- S3 upload failures
- Security violations

## Dependencies

- `@aws-sdk/client-s3`: S3 client for AWS SDK v3
- `@aws-sdk/s3-request-presigner`: For generating presigned URLs
- `axios`: HTTP client for file uploads with progress tracking
- `lucide-react`: Icons for the UI

## Security Considerations

1. **Environment Variables**: Keep your S3 credentials secure and never commit them to version control
2. **Rate Limiting**: Adjust rate limits based on your application needs
3. **File Types**: Restrict allowed file types to prevent malicious uploads
4. **File Size**: Set appropriate file size limits
5. **Presigned URLs**: Use short expiration times for presigned URLs
6. **Filename Sanitization**: All filenames are sanitized to prevent security issues

## Performance Considerations

1. **Large Files**: Consider implementing chunked uploads for very large files
2. **Progress Tracking**: Built-in progress tracking for better UX
3. **Background Processing**: The upload component handles background processing
4. **Memory Usage**: Files are streamed to minimize memory usage

## Troubleshooting

1. **CORS Issues**: Ensure your S3 bucket has proper CORS configuration
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **File Types**: Verify MIME types match your allowed types configuration
4. **Network Issues**: Check for network connectivity and timeout settings
