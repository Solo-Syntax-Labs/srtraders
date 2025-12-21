import { Storage } from 'megajs'

export interface MegaUploadResult {
  fileId: string
  fileKey: string
  name: string
  size: number
}

export interface MegaDownloadResult {
  buffer: Buffer
  fileName: string
  fileSize: number
}

class MegaStorageClient {
  private storage: any
  private isInitialized: boolean = false

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    const email = process.env.MEGA_EMAIL
    const password = process.env.MEGA_PASSWORD

    if (!email || !password) {
      throw new Error('Mega credentials not configured. Please set MEGA_EMAIL and MEGA_PASSWORD environment variables.')
    }

    try {
      this.storage = await new Storage({
        email,
        password,
      }).ready
      
      this.isInitialized = true
    } catch (error) {
      throw new Error(`Failed to initialize Mega storage: ${error}`)
    }
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    folderPath?: string
  ): Promise<MegaUploadResult> {
    await this.initialize()

    try {
      let targetFolder = this.storage.root

      if (folderPath) {
        const folders = folderPath.split('/').filter(f => f)
        for (const folderName of folders) {
          let folder = targetFolder.children?.find(
            (child: any) => child.name === folderName && child.directory
          )

          if (!folder) {
            folder = await targetFolder.mkdir(folderName)
          }

          targetFolder = folder
        }
      }

      const uploadedFile = await targetFolder.upload({
        name: fileName,
        size: fileBuffer.length,
      }, fileBuffer).complete

      return {
        fileId: uploadedFile.nodeId || uploadedFile.downloadId,
        fileKey: uploadedFile.key,
        name: uploadedFile.name,
        size: uploadedFile.size,
      }
    } catch (error) {
      throw new Error(`Mega upload failed: ${error}`)
    }
  }

  async download(fileId: string): Promise<MegaDownloadResult> {
    await this.initialize()

    try {
      const file = this.storage.root.children?.find(
        (child: any) => child.nodeId === fileId || child.downloadId === fileId
      )

      if (!file) {
        const allFiles = this.getAllFiles(this.storage.root)
        const foundFile = allFiles.find(
          (f: any) => f.nodeId === fileId || f.downloadId === fileId
        )

        if (!foundFile) {
          throw new Error(`File not found with ID: ${fileId}`)
        }

        const buffer = await foundFile.downloadBuffer()

        return {
          buffer: Buffer.from(buffer),
          fileName: foundFile.name,
          fileSize: foundFile.size,
        }
      }

      const buffer = await file.downloadBuffer()

      return {
        buffer: Buffer.from(buffer),
        fileName: file.name,
        fileSize: file.size,
      }
    } catch (error) {
      throw new Error(`Mega download failed: ${error}`)
    }
  }

  async delete(fileId: string): Promise<void> {
    await this.initialize()

    try {
      const allFiles = this.getAllFiles(this.storage.root)
      const file = allFiles.find(
        (f: any) => f.nodeId === fileId || f.downloadId === fileId
      )

      if (!file) {
        throw new Error(`File not found with ID: ${fileId}`)
      }

      await file.delete()
    } catch (error) {
      throw new Error(`Mega delete failed: ${error}`)
    }
  }

  private getAllFiles(folder: any): any[] {
    let files: any[] = []

    if (folder.children) {
      for (const child of folder.children) {
        if (child.directory) {
          files = files.concat(this.getAllFiles(child))
        } else {
          files.push(child)
        }
      }
    }

    return files
  }

  async disconnect(): Promise<void> {
    if (this.storage) {
      await this.storage.close()
      this.isInitialized = false
    }
  }
}

export const megaClient = new MegaStorageClient()
