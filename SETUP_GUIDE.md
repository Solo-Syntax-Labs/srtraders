# Environment Variables Setup Guide

This guide will walk you through obtaining all the required environment variables for the Invoice Management System.

## 📋 Required Environment Variables

Copy `env.example` to `.env.local` and fill in the following variables:

```bash
cp env.example .env.local
```

---

## 🗄️ 1. Supabase Configuration

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Fill in project details and create

### Step 2: Get Supabase Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Set up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `database/schema.sql`
3. Click "Run" to create all tables and policies

### Step 4: Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Click "New Bucket"
3. Name it `documents`
4. Make it **Private** (not public)
5. Click "Create Bucket"

---

## 🔐 2. NextAuth Configuration

### Generate NextAuth Secret
Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: [generate-secret.now.sh](https://generate-secret.now.sh/32)

```env
NEXTAUTH_URL=http://localhost:3000  # Change to your domain in production
NEXTAUTH_SECRET=your_generated_secret_here
```

---

## 🔍 3. Google Cloud Setup (OAuth + Drive API)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Google+ API** (for OAuth)
   - **Google Drive API** (for file storage)

### Step 2: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. Add these **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/google-drive/callback
   ```
5. For production, also add:
   ```
   https://yourdomain.com/api/auth/callback/google
   https://yourdomain.com/api/auth/google-drive/callback
   ```

### Step 3: Get Credentials
After creating, copy the **Client ID** and **Client Secret**:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here

# These can be the same values as above
GOOGLE_DRIVE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/api/auth/google-drive/callback
```

---

## 🔧 4. Complete .env.local Example

Your final `.env.local` file should look like this:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjc5MzQwMCwiZXhwIjoxOTQ4MzY5NDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMyNzkzNDAwLCJleHAiOjE5NDgzNjk0MDB9.example

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super-secret-jwt-token-with-at-least-32-characters

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here

# Google Drive API
GOOGLE_DRIVE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/api/auth/google-drive/callback

# Environment
NODE_ENV=development
```

---

## 🚀 5. Test Your Setup

After setting up all environment variables:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Visit `http://localhost:3000`
   - Try signing up with email/password
   - Try signing in with Google

3. **Test database connection:**
   - Create a test invoice
   - Check if data appears in Supabase dashboard

4. **Test file upload:**
   - Upload a document to Supabase Storage
   - Connect Google Drive and upload a file

---

## 🔒 Production Setup

For production deployment (Vercel), update these variables:

```env
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/api/auth/google-drive/callback
NODE_ENV=production
```

And add the production URLs to your Google Cloud OAuth settings.

---

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid client" error:**
   - Check Google OAuth redirect URIs
   - Ensure client ID/secret are correct

2. **Database connection error:**
   - Verify Supabase URL and keys
   - Check if database schema was applied

3. **File upload fails:**
   - Ensure storage bucket "documents" exists
   - Check Google Drive API is enabled

4. **Authentication not working:**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal/server logs
3. Verify all environment variables are set correctly
4. Ensure all APIs are enabled in Google Cloud Console
