-- Upgrade script for the database

-- V1 to V2

-- Add TDS field to invoices table
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tds DECIMAL(5, 2) DEFAULT 0;

-- Remove consolidated_doc field from invoices table
ALTER TABLE public.invoices DROP COLUMN IF EXISTS consolidated_doc;

-- Add consolidated_report_id field for generated PDF reports
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS consolidated_report_id TEXT;

-- V2 to V3: Add Mega storage support

-- Drop existing storage_type constraint
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_storage_type_check;

-- Add new storage_type constraint with 'mega' support
ALTER TABLE public.documents ADD CONSTRAINT documents_storage_type_check 
  CHECK (storage_type IN ('supabase', 'google_drive', 'mega'));

-- Add mega_file_id field for Mega.nz specific file identifier
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS mega_file_id TEXT;