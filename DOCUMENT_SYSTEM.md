# Document Viewing and Download System

## 📋 Overview

The invoice management system now includes a comprehensive document viewing and download system with proper security controls and file type handling.

## 🔐 Security Features

- **User Authentication**: Only authenticated users can access documents
- **Permission Controls**: Users can only view/download documents from their own invoices
- **Session Validation**: All requests require valid NextAuth sessions

## 📁 File Type Support

### **Viewable Types** (Can be displayed in browser)
- **PDFs**: `application/pdf`
- **Images**: 
  - `image/jpeg`, `image/jpg`
  - `image/png`
  - `image/gif`
  - `image/webp`
  - `image/svg+xml`
  - `image/bmp`

### **Download-Only Types**
- All other file types (Word docs, Excel, etc.)

## 🔗 API Endpoints

### 1. **List Documents for Invoice**
```
GET /api/documents?invoice_id={invoice_id}
```

**Response:**
```json
{
  "documents": [
    {
      "id": "uuid",
      "file_name": "invoice.pdf",
      "file_type": "application/pdf",
      "file_size": 1024000,
      "document_type": "invoice",
      "view_url": "/api/documents/uuid?action=view",
      "download_url": "/api/documents/uuid?action=download",
      "can_view": true,
      "created_at": "2024-01-01T10:00:00Z",
      "users": {
        "full_name": "John Doe"
      }
    }
  ]
}
```

### 2. **View/Download Individual Document**
```
GET /api/documents/{document_id}?action={view|download}
```

**Parameters:**
- `action=view` (default): For viewable types, displays inline; for others, downloads
- `action=download`: Forces download for all file types

**Response Headers:**
```
Content-Type: {original_file_type}
Content-Disposition: inline|attachment; filename="{filename}"
Content-Length: {file_size}
Cache-Control: private, max-age=3600
```

### 3. **Delete Document**
```
DELETE /api/documents/{document_id}
```

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

## 🖥️ Frontend Usage Examples

### **View Document in New Tab/Window**
```typescript
// For viewable types (PDF, images)
const viewDocument = (documentId: string) => {
  window.open(`/api/documents/${documentId}?action=view`, '_blank')
}
```

### **Download Document**
```typescript
// Force download for any file type
const downloadDocument = (document: any) => {
  const link = document.createElement('a')
  link.href = `/api/documents/${document.id}?action=download`
  link.download = document.file_name
  link.click()
}
```

### **Embed PDF in Page**
```typescript
// For PDF documents
const EmbedPDF = ({ documentId }: { documentId: string }) => {
  return (
    <iframe
      src={`/api/documents/${documentId}?action=view`}
      width="100%"
      height="600px"
      title="Document Viewer"
    />
  )
}
```

### **Display Image**
```typescript
// For image documents
const DisplayImage = ({ documentId }: { documentId: string }) => {
  return (
    <img
      src={`/api/documents/${documentId}?action=view`}
      alt="Document"
      className="max-w-full h-auto"
    />
  )
}
```

## 🛠️ Technical Implementation

### **Storage Backend**
- Uses **Supabase S3 Storage** via AWS SDK
- Files stored in organized folder structure: `invoices/{invoice_id}/{unique_filename}`

### **Authentication Flow**
1. Validate NextAuth session
2. Get user ID from database by email
3. Verify user owns the invoice containing the document
4. Fetch document metadata from database
5. Stream file from S3 storage

### **Error Handling**
- `401`: Unauthorized (no valid session)
- `403`: Forbidden (user doesn't own invoice)
- `404`: Document/Invoice not found
- `500`: Storage or database errors

## 🔧 Environment Variables Required

```env
# S3 Storage Configuration
SUPABASE_S3_ACCESS_KEY_ID=your_s3_access_key_id
SUPABASE_S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
SUPABASE_STORAGE_REGION=us-east-1

# NextAuth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=your_domain

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Database Schema

Documents are stored with the following structure:

```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  storage_type TEXT CHECK (storage_type IN ('supabase', 'google_drive')),
  storage_path TEXT,
  document_type TEXT CHECK (document_type IN ('invoice', 'receipt', 'delivery_note', 'quality_certificate', 'other')),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎯 Usage Recommendations

### **For File Viewing**
1. Check `can_view` field before showing view option
2. Use appropriate UI components (iframe for PDF, img for images)
3. Provide fallback download option for all files

### **For File Downloads**
1. Always provide download option regardless of file type
2. Use original filename for better UX
3. Show file size in UI when available

### **Error Handling**
1. Handle 403 errors gracefully (redirect to dashboard)
2. Show user-friendly messages for missing files
3. Implement retry logic for temporary failures

## 🚀 Future Enhancements

- [ ] Google Drive document support
- [ ] Document preview thumbnails
- [ ] Bulk download functionality
- [ ] Document versioning
- [ ] OCR text extraction for searchability
