-- Upgrade script for the database

-- V1 to V2

-- Add TDS field to invoices table
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tds DECIMAL(5, 2) DEFAULT 0;

-- Remove consolidated_doc field from invoices table
ALTER TABLE public.invoices DROP COLUMN IF EXISTS consolidated_doc;

-- Add consolidated_report_id field for generated PDF reports
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS consolidated_report_id TEXT;

-- V2 to V3 - Add MEGA.nz support

-- Update storage_type to include 'mega'
-- First, remove the existing constraint
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_storage_type_check;

-- Add the new constraint with 'mega' included
ALTER TABLE public.documents ADD CONSTRAINT documents_storage_type_check 
CHECK (storage_type IN ('supabase', 'google_drive', 'mega'));

-- Add mega_file_id column for MEGA-specific file identification
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS mega_file_id TEXT;

-- Add storage_filename column to store normalized filenames used in storage
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS storage_filename TEXT;

-- Create index for MEGA file IDs
CREATE INDEX IF NOT EXISTS idx_documents_mega_file_id ON public.documents(mega_file_id);

-- Create index for storage filenames
CREATE INDEX IF NOT EXISTS idx_documents_storage_filename ON public.documents(storage_filename);