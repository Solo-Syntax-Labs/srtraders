# SRTraders - Scrap Buyers & Dealers

A comprehensive steel trading and scrap management platform built with Next.js, featuring invoice management, document storage, product tracking, and dual authentication methods.

## Features

### 🚛 **SRTraders Management**
- Create and manage truck load invoices
- Track invoice status (pending, processing, completed, cancelled)
- Store truck and driver information
- Monitor arrival dates and amounts

### 📦 **Product Tracking**
- Add multiple products per invoice
- Track project names, quantities, and unit prices
- Store quality grades and specifications
- Automatic total price calculations

### 📄 **Document Storage**
- **Dual Storage Options:**
  - Supabase Storage for secure cloud storage
  - Google Drive integration via OAuth
- Support for multiple file types
- Organize documents by invoice
- Secure access control

### 🔐 **Authentication**
- Google OAuth integration
- Traditional email/password authentication
- Secure session management with NextAuth.js
- Role-based access control

### 🎨 **Modern UI**
- Responsive design with Tailwind CSS
- Clean dashboard interface
- Mobile-friendly navigation
- Professional invoice forms

## Tech Stack

- **Frontend/Backend:** Next.js 14 with App Router
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js
- **File Storage:** Supabase Storage + Google Drive API
- **Styling:** Tailwind CSS + shadcn/ui components
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console project (for OAuth and Drive API)

### 1. Clone and Install

```bash
git clone <your-repo>
cd invoice-management
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Google Drive API
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret_here
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/api/auth/google-drive
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) on all tables
4. Create a storage bucket named `documents`

### 4. Google Cloud Setup

1. Create a project in Google Cloud Console
2. Enable Google Drive API and Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/api/auth/google-drive/callback`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── invoices/       # Invoice CRUD operations
│   │   ├── products/       # Product management
│   │   ├── documents/      # Document handling
│   │   └── upload/         # File upload endpoints
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Layout components
│   ├── ui/                 # Reusable UI components
│   └── providers.tsx       # Context providers
└── lib/
    ├── auth/               # Authentication configuration
    ├── supabase/           # Database client and types
    └── utils.ts            # Utility functions
```

## Database Schema

### Core Tables:
- **profiles** - User profiles and roles
- **invoices** - Main invoice records
- **products** - Products associated with invoices
- **documents** - File metadata and storage references
- **google_drive_tokens** - OAuth tokens for Google Drive

### Key Features:
- Row Level Security (RLS) for data protection
- Foreign key relationships for data integrity
- Automatic timestamps with triggers
- Computed columns for calculated fields

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/google-drive/connect` - Google Drive OAuth
- `GET /api/auth/google-drive/status` - Check connection status

### Invoices
- `GET /api/invoices` - List invoices with pagination
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### File Upload
- `POST /api/upload/supabase` - Upload to Supabase Storage
- `POST /api/upload/google-drive` - Upload to Google Drive

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update `NEXTAUTH_URL` to your production URL
4. Deploy!

### Environment Variables for Production

Update these variables for production:
- `NEXTAUTH_URL` - Your production domain
- `GOOGLE_DRIVE_REDIRECT_URI` - Production callback URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository or contact the development team.