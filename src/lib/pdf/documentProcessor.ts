import { createServerClient } from '@/lib/supabase/server';
import sharp from 'sharp';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export interface ProcessedDocument {
  type: string;
  name: string;
  data: string; // base64 encoded image
  originalType: 'image' | 'placeholder';
}

export interface DocumentReference {
  id: string;
  type: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'classification';
  name: string;
}

export class DocumentProcessor {
  private supabase;

  constructor() {
    this.supabase = null; // Will be initialized in methods that need it
  }

  private async initSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerClient();
    }
    return this.supabase;
  }

  /**
   * Get document references from invoice
   */
  getDocumentReferences(invoice: any): DocumentReference[] {
    const references: DocumentReference[] = [];

    if (invoice.sale_doc) {
      references.push({
        id: invoice.sale_doc,
        type: 'sale',
        name: 'Sale Document'
      });
    }

    if (invoice.purchase_doc) {
      references.push({
        id: invoice.purchase_doc,
        type: 'purchase',
        name: 'Purchase Document'
      });
    }

    if (invoice.toll_doc) {
      references.push({
        id: invoice.toll_doc,
        type: 'toll',
        name: 'Toll Document'
      });
    }

    if (invoice.weight_report) {
      references.push({
        id: invoice.weight_report,
        type: 'weight_report',
        name: 'Weight Report'
      });
    }

    if (invoice.classification_report) {
      references.push({
        id: invoice.classification_report,
        type: 'classification',
        name: 'Classification Report'
      });
    }

    return references;
  }

  /**
   * Fetch document from storage
   */
  private async fetchDocument(documentId: string): Promise<{
    buffer: Buffer;
    fileName: string;
    fileType: string;
  } | null> {
    try {
      const supabase = await this.initSupabase();
      
      // Get document metadata
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('file_name, file_type, storage_path, storage_type')
        .eq('document_id', documentId)
        .single();

      if (docError || !doc) {
        console.error('Document not found:', documentId, docError);
        return null;
      }

      // Handle different storage types
      if (doc.storage_type === 'supabase') {
        try {
          // Configure S3 client for Supabase Storage
          const s3Client = new S3Client({
            forcePathStyle: true,
            region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
            endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
            credentials: {
              accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
            }
          });

          // Download file from S3
          const getCommand = new GetObjectCommand({
            Bucket: 'documents',
            Key: doc.storage_path,
          });

          const response = await s3Client.send(getCommand);
          
          if (!response.Body) {
            console.error('File not found in storage:', doc.storage_path);
            return null;
          }

          // Convert stream to buffer
          const chunks: Uint8Array[] = [];
          const stream = response.Body as any;
          
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          
          const buffer = Buffer.concat(chunks);

          return {
            buffer,
            fileName: doc.file_name,
            fileType: doc.file_type
          };

        } catch (storageError) {
          console.error('Failed to download document from S3:', storageError);
          return null;
        }
      } else {
        console.error('Unsupported storage type:', doc.storage_type);
        return null;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }


  /**
   * Process image (resize, optimize)
   */
  private async processImage(imageBuffer: Buffer): Promise<Buffer> {
    try {
      // Use more conservative sizing to ensure it fits within page bounds
      // A4 page size minus margins (about 535x750 usable area)
      return await sharp(imageBuffer)
        .resize(535, 650, {
          fit: 'inside',
          withoutEnlargement: false,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .jpeg({ quality: 90 })
        .toBuffer();
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  /**
   * Process a single document - Images only
   */
  async processDocument(reference: DocumentReference): Promise<ProcessedDocument[]> {
    const document = await this.fetchDocument(reference.id);
    
    if (!document) {
      return [];
    }

    const results: ProcessedDocument[] = [];

    try {
      // Only process image documents - skip PDFs and other file types
      if (document.fileType.startsWith('image/')) {
        console.log(`Processing image document: ${document.fileName} (${document.fileType})`);
        
        // Process as image
        const processedImage = await this.processImage(document.buffer);
        results.push({
          type: reference.name,
          name: document.fileName,
          data: processedImage.toString('base64'),
          originalType: 'image'
        });
      } else {
        console.log(`Skipping non-image document: ${document.fileName} (${document.fileType}) - Only images are included in consolidated reports`);
        
        // Create a placeholder for non-image documents to show they exist but aren't included
        const placeholderImage = await sharp({
          create: {
            width: 535,
            height: 650,
            channels: 4,
            background: { r: 248, g: 249, b: 250, alpha: 1 }
          }
        })
        .composite([
          {
            input: Buffer.from(`
              <svg width="535" height="650" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#ffffff" stroke="#dee2e6" stroke-width="1"/>
                
                <!-- File icon -->
                <rect x="200" y="200" width="135" height="160" fill="#f8f9fa" stroke="#adb5bd" stroke-width="2" rx="8"/>
                <rect x="210" y="210" width="115" height="10" fill="#dee2e6" rx="2"/>
                <rect x="210" y="230" width="95" height="8" fill="#dee2e6" rx="2"/>
                <rect x="210" y="250" width="75" height="8" fill="#dee2e6" rx="2"/>
                
                <!-- Document type indicator -->
                <circle cx="267" cy="400" r="30" fill="#6c757d" opacity="0.8"/>
                <text x="267" y="405" text-anchor="middle" fill="white" font-size="12" font-family="Arial, sans-serif" font-weight="bold">
                  DOC
                </text>
                
                <text x="267" y="450" text-anchor="middle" fill="#495057" font-size="16" font-family="Arial, sans-serif" font-weight="bold">
                  ${reference.name}
                </text>
                <text x="267" y="480" text-anchor="middle" fill="#6c757d" font-size="12" font-family="Arial, sans-serif">
                  ${document.fileName}
                </text>
                <text x="267" y="500" text-anchor="middle" fill="#868e96" font-size="10" font-family="Arial, sans-serif">
                  ${document.fileType}
                </text>
                
                <text x="267" y="580" text-anchor="middle" fill="#868e96" font-size="9" font-family="Arial, sans-serif">
                  Only image documents are included in consolidated reports
                </text>
                <text x="267" y="600" text-anchor="middle" fill="#868e96" font-size="9" font-family="Arial, sans-serif">
                  This document reference is shown for completeness
                </text>
              </svg>
            `),
            top: 0,
            left: 0,
          }
        ])
        .png()
        .toBuffer();
        
        results.push({
          type: `${reference.name} (Reference Only)`,
          name: document.fileName,
          data: placeholderImage.toString('base64'),
          originalType: 'placeholder'
        });
      }
    } catch (error) {
      console.error(`Error processing document ${reference.id}:`, error);
    }

    return results;
  }

  /**
   * Process all documents for an invoice (images only)
   */
  async processAllDocuments(invoice: any): Promise<ProcessedDocument[]> {
    const references = this.getDocumentReferences(invoice);
    const allResults: ProcessedDocument[] = [];

    console.log(`Processing ${references.length} documents for invoice ${invoice.invoice_number} (images only)`);

    // Process documents in parallel
    const promises = references.map(ref => this.processDocument(ref));
    const results = await Promise.allSettled(promises);

    // Process results and handle failures
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const reference = references[i];

      if (result.status === 'fulfilled') {
        allResults.push(...result.value);
        console.log(`Successfully processed document: ${reference.name}`);
      } else {
        console.error(`Failed to process document ${reference.id} (${reference.name}):`, result.reason);
        
        try {
          // Generate placeholder image for missing document
          const placeholderBuffer = await this.createPlaceholderImage(reference.name);
          const placeholderDocument: ProcessedDocument = {
            type: `${reference.name} (Not Available)`,
            name: 'placeholder.png',
            data: placeholderBuffer.toString('base64'),
            originalType: 'placeholder'
          };
          allResults.push(placeholderDocument);
          console.log(`Created placeholder for missing document: ${reference.name}`);
        } catch (placeholderError) {
          console.error(`Failed to create placeholder for ${reference.name}:`, placeholderError);
        }
      }
    }

    console.log(`Successfully processed ${allResults.length} items for consolidated report (images and references)`);
    return allResults;
  }

  /**
   * Create a fallback image for missing or failed documents
   */
  async createPlaceholderImage(documentType: string): Promise<Buffer> {
    const svg = `
      <svg width="535" height="650" xmlns="http://www.w3.org/2000/svg">
        <rect width="535" height="650" fill="#f8f9fa" stroke="#dc3545" stroke-width="2" stroke-dasharray="10,5"/>
        <text x="267" y="260" text-anchor="middle" fill="#dc3545" font-size="20" font-family="Arial, sans-serif" font-weight="bold">
          Document Not Found
        </text>
        <text x="267" y="300" text-anchor="middle" fill="#6c757d" font-size="16" font-family="Arial, sans-serif">
          ${documentType}
        </text>
        <text x="267" y="340" text-anchor="middle" fill="#868e96" font-size="12" font-family="Arial, sans-serif">
          This document could not be retrieved
        </text>
      </svg>
    `;

    return await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
  }
}

export default DocumentProcessor;
