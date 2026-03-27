# File Upload System Documentation

## Overview
This document describes the file upload system implemented using Multer in the AI Notes Backend.

## File Structure
```
ai-notes-backend/
├── utils/
│   └── multer.js           # Multer configuration and middleware
├── controllers/
│   └── uploadController.js # Upload request handler
├── routes/
│   └── upload.js           # Upload API routes
├── uploads/                # Directory for storing uploaded files
│   └── .gitkeep           # Placeholder for git tracking
└── config/
    └── app.js             # App configuration with upload routes
```

## Configuration

### File Filter
The system only accepts the following image formats:
- **JPEG** (.jpg, .jpeg) - `image/jpeg`
- **PNG** (.png) - `image/png`
- **GIF** (.gif) - `image/gif`
- **WebP** (.webp) - `image/webp`

### File Size Limit
Maximum file size: **5MB**

### File Naming
Files are renamed using the following pattern:
```
{originalName}-{timestamp}{extension}
```

Example: `document-1711535762345.jpg`

## API Endpoints

### Upload Image
**Endpoint:** `POST /upload`

**Request:**
- **Content-Type:** `multipart/form-data`
- **Form Field:** `image` (required)

**Example cURL:**
```bash
curl -X POST "http://localhost:5000/upload" \
  -F "image=@/path/to/image.jpg"
```

**Example JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:5000/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "document-1711535762345.jpg",
    "originalName": "document.jpg",
    "size": 245678,
    "path": "/uploads/document-1711535762345.jpg",
    "uploadedAt": "2026-03-27T11:35:00.000Z"
  }
}
```

**Error Response - No File (400):**
```json
{
  "success": false,
  "message": "No file provided. Please upload an image file."
}
```

**Error Response - Invalid File Type (400):**
```json
{
  "success": false,
  "message": "Only image files are allowed. Supported formats: JPEG, PNG, GIF, WebP"
}
```

**Error Response - Server Error (500):**
```json
{
  "success": false,
  "message": "File upload failed",
  "error": "Error details"
}
```

## Access Uploaded Files

Once uploaded, files can be accessed via:
```
http://localhost:5000/uploads/{filename}
```

Example:
```
http://localhost:5000/uploads/document-1711535762345.jpg
```

## Middleware Usage

### Single File Upload
The `uploadSingleFile` middleware is exported from `utils/multer.js`:

```javascript
const { uploadSingleFile } = require('../utils/multer');

// Use in routes
router.post('/upload', uploadSingleFile, uploadController.uploadImage);
```

### Multiple Files
To handle multiple files, import the `upload` instance and use:

```javascript
const { upload } = require('../utils/multer');

// For multiple files with same field name
router.post('/upload-multiple', upload.array('images'), controllerFunction);

// For multiple files with different field names
router.post('/upload-mixed', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), controllerFunction);
```

## Error Handling

The error handler middleware in `config/app.js` catches multer errors:

```javascript
// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

Common multer errors:
- `LIMIT_FILE_SIZE` - File too large
- `LIMIT_PART_COUNT` - Too many parts
- File validation errors - Invalid MIME type or extension

## File Organization

### Uploads Directory
- Location: `./uploads/`
- Contains all uploaded image files
- Not tracked by git (see `.gitignore`)

### Filename Format
Files are saved with timestamp in the filename to ensure uniqueness:
```
{originalName}-{timestamp}{extension}
```

This prevents conflicts when multiple files with the same name are uploaded.

## Security Considerations

1. **File Type Validation:** Only image MIME types and extensions are allowed
2. **File Size Limit:** Maximum 5MB to prevent abuse
3. **Filename Sanitization:** Original names are preserved but timestamps ensure uniqueness
4. **Directory Listing:** Uploads directory serves files but doesn't list directory contents
5. **CORS:** Requests are subject to CORS policy

## Future Enhancements

- Image compression and optimization
- Virus scanning for uploaded files
- Delete file endpoint
- File metadata storage in database
- Thumbnail generation
- Image resizing capabilities
- S3/Cloud storage integration

## Troubleshooting

### File Upload Fails
- Check file MIME type (must be image)
- Verify file size is under 5MB
- Ensure form field name is `image`

### Cannot Access Uploaded File
- Verify file was uploaded successfully (check response)
- Use full URL: `http://localhost:5000/uploads/{filename}`
- Check CORS settings if accessing from different origin

### Uploads Directory Missing
- Directory is created automatically on first upload
- Can be manually created: `mkdir uploads`

## Testing

Use Postman, curl, or any HTTP client to test:

```bash
# Using curl
curl -X POST "http://localhost:5000/upload" \
  -F "image=@./test-image.jpg"

# Using Postman
1. Create POST request to http://localhost:5000/upload
2. Go to Body tab
3. Select form-data
4. Add field with key "image" and value as file
5. Click Send
```
