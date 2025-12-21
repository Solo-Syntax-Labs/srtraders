import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { megaClient } from './megaClient'

export type StorageType = 'supabase' | 'google_drive' | 'mega'

export interface UploadResult {
  success: boolean
  path: string
  storage_type: StorageType
  file_id?: string
  google_drive_id?: string
  mega_file_id?: string
}

export interface DownloadResult {
  buffer: Buffer
  fileName: string
  fileType: string
}

export interface StorageConfig {
  storageType: StorageType
  documentType: string
  fileName: string
  fileBuffer: Buffer
  fileType: string
  userId: string
  documentId: string
}

export class StorageProvider {
  static getDefaultStorageType(): StorageType {
    const defaultStorage = process.env.DEFAULT_STORAGE_PROVIDER as StorageType
    return defaultStorage || 'supabase'
  }

  static async upload(config: StorageConfig): Promise<UploadResult> {
    const { storageType, documentType, fileName, fileBuffer, fileType, userId, documentId } = config

    switch (storageType) {
      case 'supabase':
        return await this.uploadToSupabase(documentType, fileName, fileBuffer, fileType, userId, documentId)
      
      case 'mega':
        return await this.uploadToMega(documentType, fileName, fileBuffer, documentId)
      
      case 'google_drive':
        throw new Error('Google Drive upload should use the dedicated /api/upload/google-drive endpoint')
      
      default:
        throw new Error(`Unsupported storage type: ${storageType}`)
    }
  }

  static async download(
    storageType: StorageType,
    storagePath: string,
    fileName: string,
    fileType: string,
    megaFileId?: string | null,
    googleDriveId?: string | null
  ): Promise<DownloadResult> {
    switch (storageType) {
      case 'supabase':
        return await this.downloadFromSupabase(storagePath, fileName, fileType)
      
      case 'mega':
        if (!megaFileId) {
          throw new Error('Mega file ID is required for Mega storage download')
        }
        return await this.downloadFromMega(megaFileId, fileName, fileType)
      
      case 'google_drive':
        throw new Error('Google Drive download not yet implemented')
      
      default:
        throw new Error(`Unsupported storage type: ${storageType}`)
    }
  }

  static async delete(
    storageType: StorageType,
    storagePath: string,
    megaFileId?: string | null,
    googleDriveId?: string | null
  ): Promise<void> {
    switch (storageType) {
      case 'supabase':
        await this.deleteFromSupabase(storagePath)
        break
      
      case 'mega':
        if (!megaFileId) {
          throw new Error('Mega file ID is required for Mega storage deletion')
        }
        await this.deleteFromMega(megaFileId)
        break
      
      case 'google_drive':
        throw new Error('Google Drive deletion not yet implemented')
        break
      
      default:
        throw new Error(`Unsupported storage type: ${storageType}`)
    }
  }

  private static async uploadToSupabase(
    documentType: string,
    fileName: string,
    fileBuffer: Buffer,
    fileType: string,
    userId: string,
    documentId: string
  ): Promise<UploadResult> {
    const fileExtension = fileName.split('.').pop()
    // Use documentId as storage filename to prevent conflicts
    const storageFileName = `${documentId}.${fileExtension}`
    const filePath = `documents/${documentType}/${storageFileName}`

    const s3Client = new S3Client({
      forcePathStyle: true,
      region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
      endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
      }
    })

    const uploadCommand = new PutObjectCommand({
      Bucket: 'documents',
      Key: filePath,
      Body: fileBuffer,
      ContentType: fileType,
      CacheControl: '3600',
      Metadata: {
        'original-name': fileName,
        'uploaded-by': userId,
        'document-id': documentId,
      }
    })

    await s3Client.send(uploadCommand)

    return {
      success: true,
      path: filePath,
      storage_type: 'supabase'
    }
  }

  private static async uploadToMega(
    documentType: string,
    fileName: string,
    fileBuffer: Buffer,
    documentId: string
  ): Promise<UploadResult> {
    const fileExtension = fileName.split('.').pop()
    // Use documentId as storage filename to prevent conflicts
    const storageFileName = `${documentId}.${fileExtension}`
    const folderPath = `documents/${documentType}`
    const result = await megaClient.upload(fileBuffer, storageFileName, folderPath)

    return {
      success: true,
      path: `${folderPath}/${storageFileName}`,
      storage_type: 'mega',
      mega_file_id: result.fileId
    }
  }

  private static async downloadFromSupabase(
    storagePath: string,
    fileName: string,
    fileType: string
  ): Promise<DownloadResult> {
    const s3Client = new S3Client({
      forcePathStyle: true,
      region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
      endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
      }
    })

    const getCommand = new GetObjectCommand({
      Bucket: 'documents',
      Key: storagePath,
    })

    const response = await s3Client.send(getCommand)

    if (!response.Body) {
      throw new Error('File not found in storage')
    }

    const chunks: Uint8Array[] = []
    const stream = response.Body as any

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    return {
      buffer,
      fileName,
      fileType
    }
  }

  private static async downloadFromMega(
    megaFileId: string,
    fileName: string,
    fileType: string
  ): Promise<DownloadResult> {
    const result = await megaClient.download(megaFileId)

    return {
      buffer: result.buffer,
      fileName: result.fileName || fileName,
      fileType
    }
  }

  private static async deleteFromSupabase(storagePath: string): Promise<void> {
    const s3Client = new S3Client({
      forcePathStyle: true,
      region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
      endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
      }
    })

    const deleteCommand = new DeleteObjectCommand({
      Bucket: 'documents',
      Key: storagePath,
    })

    await s3Client.send(deleteCommand)
  }

  private static async deleteFromMega(megaFileId: string): Promise<void> {
    await megaClient.delete(megaFileId)
  }
}
