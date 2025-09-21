-- Upgrade script for the database

-- V1 to V2

-- Add TDS field to invoices table
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tds DECIMAL(5, 2) DEFAULT 0;

-- Remove consolidated_doc field from invoices table
ALTER TABLE public.invoices DROP COLUMN IF EXISTS consolidated_doc;

-- Add consolidated_report_id field for generated PDF reports
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS consolidated_report_id TEXT;