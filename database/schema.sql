-- SRTraders Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (our own user management)
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- Only for email/password users, NULL for OAuth users
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
  google_id TEXT, -- Store Google ID for OAuth users
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_google_id ON public.users(google_id);
CREATE INDEX idx_users_auth_provider ON public.users(auth_provider);

-- Parties table (for sale and purchase parties)
CREATE TABLE public.parties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table (main business records)
CREATE TABLE public.invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  sale_doc TEXT, -- DocumentID reference
  purchase_doc TEXT, -- DocumentID reference
  toll_doc TEXT, -- DocumentID reference
  weight_report TEXT, -- DocumentID reference
  hsn_code TEXT, -- HSN code
  weight DECIMAL(10, 2) NOT NULL, -- Weight in KG
  profit DECIMAL(12, 2), -- Calculated profit
  sale_cost DECIMAL(12, 2), -- Sale cost
  purchase_cost DECIMAL(12, 2), -- Purchase cost
  tds DECIMAL(5, 2) DEFAULT 0, -- TDS percentage
  sale_party_id UUID REFERENCES public.parties(id), -- Sale party reference
  purchase_party_id UUID REFERENCES public.parties(id), -- Purchase party reference
  status TEXT DEFAULT 'payment_pending' CHECK (status IN ('payment_pending', 'completed')),
  debit_note TEXT, -- Debit note
  credit_note TEXT, -- Credit note
  classification_report TEXT, -- DocumentID reference
  consolidated_report_id TEXT, -- Generated consolidated PDF document ID
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table (standalone documents)
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id TEXT UNIQUE NOT NULL, -- Custom document identifier
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  storage_type TEXT CHECK (storage_type IN ('supabase', 'google_drive')),
  storage_path TEXT, -- Path in Supabase Storage or Google Drive file ID
  google_drive_id TEXT, -- Google Drive specific ID
  document_type TEXT CHECK (document_type IN ('sale', 'purchase', 'toll', 'weight_report', 'consolidated', 'classification', 'other')),
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Google Drive tokens table (for OAuth integration)
CREATE TABLE public.google_drive_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_created_by ON public.invoices(created_by);
CREATE INDEX idx_invoices_sale_party_id ON public.invoices(sale_party_id);
CREATE INDEX idx_invoices_purchase_party_id ON public.invoices(purchase_party_id);
CREATE INDEX idx_parties_name ON public.parties(name);
CREATE INDEX idx_documents_document_id ON public.documents(document_id);
CREATE INDEX idx_documents_storage_type ON public.documents(storage_type);
CREATE INDEX idx_documents_document_type ON public.documents(document_type);
CREATE INDEX idx_google_drive_tokens_user_id ON public.google_drive_tokens(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_drive_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies (disable RLS for now since we're managing auth ourselves)
-- We'll handle authorization in the application layer
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_drive_tokens DISABLE ROW LEVEL SECURITY;

-- Note: RLS is disabled for simplicity. 
-- Authorization is handled in the application layer through API routes.
-- This gives us more flexibility and control over access patterns.

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parties_updated_at BEFORE UPDATE ON public.parties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_google_drive_tokens_updated_at BEFORE UPDATE ON public.google_drive_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default parties
INSERT INTO public.parties (name) VALUES 
  ('ABC Trading Co.'),
  ('XYZ Industries'),
  ('Global Logistics Ltd'),
  ('Metro Transport'),
  ('City Warehouse'),
  ('National Distributors'),
  ('Regional Suppliers'),
  ('Local Traders')
ON CONFLICT (name) DO NOTHING;
