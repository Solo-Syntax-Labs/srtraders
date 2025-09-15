export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user' | 'manager'
          auth_provider: 'email' | 'google'
          google_id: string | null
          email_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user' | 'manager'
          auth_provider?: 'email' | 'google'
          google_id?: string | null
          email_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user' | 'manager'
          auth_provider?: 'email' | 'google'
          google_id?: string | null
          email_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      parties: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          sale_doc: string | null
          purchase_doc: string | null
          toll_doc: string | null
          weight_report: string | null
          consolidated_doc: string | null
          hsn_code: string | null
          weight: number
          profit: number | null
          sale_cost: number | null
          purchase_cost: number | null
          sale_party_id: string | null
          purchase_party_id: string | null
          status: 'payment_pending' | 'completed'
          debit_note: string | null
          credit_note: string | null
          classification_report: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          sale_doc?: string | null
          purchase_doc?: string | null
          toll_doc?: string | null
          weight_report?: string | null
          consolidated_doc?: string | null
          hsn_code?: string | null
          weight: number
          profit?: number | null
          sale_cost?: number | null
          purchase_cost?: number | null
          sale_party_id?: string | null
          purchase_party_id?: string | null
          status?: 'payment_pending' | 'completed'
          debit_note?: string | null
          credit_note?: string | null
          classification_report?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          sale_doc?: string | null
          purchase_doc?: string | null
          toll_doc?: string | null
          weight_report?: string | null
          consolidated_doc?: string | null
          hsn_code?: string | null
          weight?: number
          profit?: number | null
          sale_cost?: number | null
          purchase_cost?: number | null
          sale_party_id?: string | null
          purchase_party_id?: string | null
          status?: 'payment_pending' | 'completed'
          debit_note?: string | null
          credit_note?: string | null
          classification_report?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          document_id: string
          file_name: string
          file_size: number | null
          file_type: string | null
          storage_type: 'supabase' | 'google_drive'
          storage_path: string | null
          google_drive_id: string | null
          document_type: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'consolidated' | 'classification' | 'other'
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          storage_type: 'supabase' | 'google_drive'
          storage_path?: string | null
          google_drive_id?: string | null
          document_type: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'consolidated' | 'classification' | 'other'
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          storage_type?: 'supabase' | 'google_drive'
          storage_path?: string | null
          google_drive_id?: string | null
          document_type?: 'sale' | 'purchase' | 'toll' | 'weight_report' | 'consolidated' | 'classification' | 'other'
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      google_drive_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InsertInvoice = Database['public']['Tables']['invoices']['Insert']
export type UpdateInvoice = Database['public']['Tables']['invoices']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type InsertProduct = Database['public']['Tables']['products']['Insert']
export type UpdateProduct = Database['public']['Tables']['products']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type InsertDocument = Database['public']['Tables']['documents']['Insert']
export type UpdateDocument = Database['public']['Tables']['documents']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type InsertUser = Database['public']['Tables']['users']['Insert']

export type Party = Database['public']['Tables']['parties']['Row']
export type InsertParty = Database['public']['Tables']['parties']['Insert']
export type UpdateParty = Database['public']['Tables']['parties']['Update']

export type UpdateUser = Database['public']['Tables']['users']['Update']

export type GoogleDriveToken = Database['public']['Tables']['google_drive_tokens']['Row']
export type InsertGoogleDriveToken = Database['public']['Tables']['google_drive_tokens']['Insert']
export type UpdateGoogleDriveToken = Database['public']['Tables']['google_drive_tokens']['Update']
