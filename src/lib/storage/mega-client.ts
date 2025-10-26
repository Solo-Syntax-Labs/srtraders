/**
 * MEGA.nz Storage Client
 * Handles file upload, download, and delete operations with MEGA.nz
 */

interface MegaConfig {
  email?: string
  password?: string
  recoveryKey?: string
}

/**
 * Normalize filename for safe storage
 * - Remove special characters
 * - Add timestamp suffix
 * - Preserve file extension
 */
function normalizeFilename(originalName: string): string {
  // Extract file extension
  const extension = originalName.split('.').pop()?.toLowerCase() || ''
  
  // Remove extension from name for processing
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  
  // Normalize the filename
  const normalizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 50) // Limit length
  
  // Add timestamp suffix
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  
  return `${normalizedName}_${timestamp}_${randomSuffix}.${extension}`
}

export class MegaStorageClient {
  private storage: any // MEGA Storage instance
  private isReady: boolean = false
  private config: MegaConfig

  constructor(config?: MegaConfig) {
    this.config = config || {
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
      recoveryKey: process.env.MEGA_RECOVERY_KEY
    }

    if (!this.config.email && !this.config.recoveryKey) {
      throw new Error('MEGA credentials not provided. Set MEGA_EMAIL/MEGA_PASSWORD or MEGA_RECOVERY_KEY')
    }
  }

  private async initialize(): Promise<void> {
    if (this.isReady) return

    try {
      // Dynamic import of megajs (install with: npm install megajs)
      const { Storage } = await import('megajs')
      
      const loginOptions: any = {}
      
      if (this.config.recoveryKey) {
        loginOptions.recoveryKey = this.config.recoveryKey
      } else {
        loginOptions.email = this.config.email
        loginOptions.password = this.config.password
      }

      this.storage = new Storage(loginOptions)
      await this.storage.ready
      this.isReady = true
      
      console.log('MEGA storage initialized successfully')
    } catch (error) {
      console.error('Failed to initialize MEGA storage:', error)
      throw new Error(`MEGA initialization failed: ${error}`)
    }
  }

  async upload(fileName: string, buffer: Buffer, folderPath?: string): Promise<{ fileId: string, normalizedName: string }> {
    await this.initialize()

    try {
      let targetFolder = this.storage.root
      
      // Navigate to or create the target folder
      if (folderPath) {
        const folderParts = folderPath.split('/').filter(Boolean)
        for (const folderName of folderParts) {
          let folder = targetFolder.children?.find((child: any) => 
            child.name === folderName && child.directory
          )
          
          if (!folder) {
            folder = await targetFolder.mkdir(folderName)
          }
          
          targetFolder = folder
        }
      }

      // Normalize the filename for safe storage
      const normalizedName = normalizeFilename(fileName)
      
      console.log(`Uploading to MEGA: ${fileName} -> ${normalizedName}`)

      // Use the proper MEGA.js upload API as per documentation
      // Reference: https://mega.js.org/docs/1.0/examples/file-uploading
      const uploadedFile = await targetFolder.upload({ name: normalizedName }, buffer, targetFolder).complete
      
      console.log(`File uploaded to MEGA successfully: ${normalizedName}`)
      
      // Return both the file ID and normalized name
      return {
        fileId: normalizedName,
        normalizedName: normalizedName
      }

    } catch (error) {
      console.error('MEGA upload error:', error)
      throw new Error(`Failed to upload to MEGA: ${error}`)
    }
  }

  async download(fileId: string): Promise<Buffer> {
    await this.initialize()

    try {
      // First, try to find the file by ID in the storage
      let file = this.storage.files[fileId]
      
      // If not found by direct ID, search through all files
      if (!file) {
        file = Object.values(this.storage.files).find((f: any) => 
          f.downloadId === fileId || f.id === fileId
        )
      }

      // If still not found, try to find by name (in case fileId is actually a filename)
      if (!file) {
        file = this.storage.find(fileId)
      }

      if (!file) {
        throw new Error(`File not found in MEGA: ${fileId}`)
      }

      // Use the proper MEGA.js download API as per documentation
      // Reference: https://mega.js.org/docs/1.0/examples/file-downloading
      const buffer = await file.downloadBuffer()
      console.log(`File downloaded from MEGA: ${fileId} (${buffer.length} bytes)`)
      
      return buffer

    } catch (error) {
      console.error('MEGA download error:', error)
      throw new Error(`Failed to download from MEGA: ${error}`)
    }
  }

  async delete(fileId: string): Promise<void> {
    await this.initialize()

    try {
      // First, try to find the file by ID in the storage
      let file = this.storage.find(fileId, true)
      
      // If not found by direct ID, search through all files
      if (!file) {
        console.warn(`File not found in MEGA for deletion: ${fileId}`)
        return;
      }

      // Use the proper MEGA.js delete API as per documentation
      // Reference: https://mega.js.org/docs/1.0/examples/file-deleting
      // The permanent parameter determines if the file is deleted permanently (true) or moved to trash (false)
      const permanent = true // Delete permanently for our use case
      await file.delete(permanent)
      
      console.log(`File deleted from MEGA: ${fileId}`)

    } catch (error) {
      console.error(`MEGA delete ${fileId} error:`, error)
      throw new Error(`Failed to delete from MEGA: ${error}`)
    }
  }

  static isConfigured(): boolean {
    return !!(process.env.MEGA_EMAIL || process.env.MEGA_RECOVERY_KEY)
  }
}
