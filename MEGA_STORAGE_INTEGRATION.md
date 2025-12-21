# Mega Storage Integration Guide

This document explains the Mega.nz storage integration and how to configure and use it.

## Overview

The application now supports three storage providers for document management:
- **Supabase Storage** (S3-compatible)
- **Google Drive** (OAuth-based)
- **Mega.nz** (Cloud storage)

The storage provider is automatically selected based on environment configuration, and all documents track their storage location in the database.

## Architecture

### Unified Storage Abstraction Layer

All storage operations go through a unified `StorageProvider` class located at:
```
src/lib/storage/storageProvider.ts
```

This abstraction layer provides:
- **Upload**: Unified interface for uploading to any storage provider
- **Download**: Unified interface for downloading from any storage provider
- **Delete**: Unified interface for deleting from any storage provider

### Storage-Specific Clients

Each storage provider has its own client implementation:
- **Supabase**: Uses AWS S3 SDK (`@aws-sdk/client-s3`)
- **Mega**: Uses Mega client (`src/lib/storage/megaClient.ts` with `megajs` package)
- **Google Drive**: Uses Google APIs (`googleapis`)

## Database Schema

The `documents` table tracks storage information:

```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY,
  document_id TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  storage_type TEXT CHECK (storage_type IN ('supabase', 'google_drive', 'mega')),
  storage_path TEXT,
  google_drive_id TEXT,
  mega_file_id TEXT,
  document_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Configuration

### 1. Install Dependencies

```bash
npm install
```

This will install the `megajs` package added to `package.json`.

### 2. Run Database Migration

Execute the upgrade script to add Mega storage support:

```bash
# Connect to your Supabase database and run:
psql -h <your-supabase-host> -U postgres -d postgres -f database/upgrade.sql
```

Or run the SQL manually in Supabase SQL Editor:

```sql
-- Drop existing storage_type constraint
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_storage_type_check;

-- Add new storage_type constraint with 'mega' support
ALTER TABLE public.documents ADD CONSTRAINT documents_storage_type_check 
  CHECK (storage_type IN ('supabase', 'google_drive', 'mega'));

-- Add mega_file_id field
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS mega_file_id TEXT;
```

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Mega.nz Storage Configuration
MEGA_EMAIL=your_mega_email@example.com
MEGA_PASSWORD=your_mega_password_here

# Default Storage Provider (choose one: 'supabase', 'google_drive', or 'mega')
DEFAULT_STORAGE_PROVIDER=supabase
```

**Important Notes:**
- Create a dedicated Mega.nz account for your application
- Use a strong password
- Consider using environment-specific accounts (dev, staging, prod)

## Usage

### Default Storage Selection

The system automatically uses the storage provider specified in `DEFAULT_STORAGE_PROVIDER` environment variable. If not set, it defaults to `supabase`.

### API Endpoints

#### Upload Document

```bash
POST /api/documents?storage=mega
Content-Type: multipart/form-data

file: <file>
document_type: sale|purchase|toll|weight_report|other
```

Query parameters:
- `storage` (optional): Override default storage provider (`supabase`, `mega`, `google_drive`)

#### Download Document

```bash
GET /api/documents/{id}?action=download
GET /api/documents/{id}?action=view
```

The system automatically retrieves from the correct storage based on the document's `storage_type` field.

#### Delete Document

```bash
DELETE /api/documents/{id}
```

Automatically deletes from the correct storage provider.

### Programmatic Usage

```typescript
import { StorageProvider } from '@/lib/storage/storageProvider'

// Upload
const result = await StorageProvider.upload({
  storageType: 'mega',
  documentType: 'sale',
  fileName: 'invoice.pdf',
  fileBuffer: buffer,
  fileType: 'application/pdf',
  userId: 'user-id',
  documentId: 'doc-id'
})

// Download
const download = await StorageProvider.download(
  'mega',
  storagePath,
  fileName,
  fileType,
  megaFileId,
  googleDriveId
)

// Delete
await StorageProvider.delete(
  'mega',
  storagePath,
  megaFileId,
  googleDriveId
)
```

## How It Works

### Upload Flow

1. Client uploads file to `/api/documents` with optional `?storage=mega` parameter
2. API validates file (size, type)
3. `StorageProvider.upload()` is called with storage type
4. For Mega:
   - Mega client initializes connection
   - Creates folder structure: `documents/{document_type}/`
   - Uploads file to Mega
   - Returns `mega_file_id`
5. Document metadata saved to database with:
   - `storage_type: 'mega'`
   - `storage_path: 'documents/sale/filename.pdf'`
   - `mega_file_id: '<mega-file-id>'`

### Download Flow

1. Client requests document via `/api/documents/{id}`
2. API fetches document metadata from database
3. `StorageProvider.download()` called with document's storage info
4. For Mega:
   - Mega client initializes connection
   - Searches for file by `mega_file_id`
   - Downloads file buffer
5. File streamed to client with appropriate headers

### Delete Flow

1. Client requests deletion via `DELETE /api/documents/{id}`
2. API checks if document is referenced by invoices
3. `StorageProvider.delete()` called
4. For Mega:
   - Mega client finds file by `mega_file_id`
   - Deletes file from Mega storage
5. Document record deleted from database

## Folder Structure in Mega

Documents are organized by type:

```
Mega Root/
└── documents/
    ├── sale/
    │   ├── invoice1.pdf
    │   └── invoice2.pdf
    ├── purchase/
    │   └── po1.pdf
    ├── toll/
    ├── weight_report/
    └── other/
```

## Error Handling

The system includes comprehensive error handling:

- **Upload failures**: Automatic cleanup if database insert fails
- **Download failures**: Graceful error messages to client
- **Delete failures**: Continues with database deletion even if storage deletion fails
- **Missing files**: Returns 404 with appropriate error message

## Security Considerations

1. **Credentials**: Store Mega credentials in environment variables, never in code
2. **Access Control**: All API endpoints require authentication
3. **File Validation**: Files are validated for type and size before upload
4. **User Isolation**: Users can only access their own documents

## Monitoring and Debugging

Enable detailed logging by checking console output:

```typescript
// Upload logs
console.log('Storage upload error:', uploadError)

// Download logs
console.log('Storage download error:', storageError)

// Mega client logs
console.log('Mega initialization:', error)
```

## Migration from Existing Storage

To migrate existing documents to Mega:

1. Keep `DEFAULT_STORAGE_PROVIDER` as current provider
2. New uploads will use Mega if you set it as default
3. Old documents remain accessible from their original storage
4. Optionally create a migration script to move files (not included)

## Troubleshooting

### Issue: "Cannot find module 'megajs'"
**Solution**: Run `npm install` to install dependencies

### Issue: "Mega credentials not configured"
**Solution**: Add `MEGA_EMAIL` and `MEGA_PASSWORD` to `.env.local`

### Issue: "File not found with ID"
**Solution**: Verify `mega_file_id` is correctly stored in database

### Issue: Upload fails with Mega
**Solution**: 
- Check Mega account has sufficient storage
- Verify credentials are correct
- Check network connectivity to Mega servers

## Performance Considerations

- **Mega Upload**: Typically slower than S3 for large files
- **Mega Download**: Comparable to other providers
- **Folder Creation**: Cached after first creation
- **Connection**: Reused across requests (singleton pattern)

## Future Enhancements

Potential improvements:
- Mega API key authentication (instead of email/password)
- Parallel chunk uploads for large files
- Automatic retry on network failures
- Storage usage monitoring and alerts
- Automatic migration tools between providers

## Support

For issues or questions:
1. Check application logs for detailed error messages
2. Verify environment configuration
3. Test Mega credentials manually
4. Review database schema is up to date
