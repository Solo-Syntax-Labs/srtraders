# 🚀 SRTraders - Vercel Deployment Guide

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- [x] Vercel account ([signup here](https://vercel.com/signup))
- [x] GitHub repository with your code
- [x] Supabase project setup and running
- [x] Google OAuth credentials configured
- [x] All environment variables documented

---

## 🔧 Pre-Deployment Setup

### 1. **Prepare Your Repository**

```bash
# Ensure your code is committed and pushed to GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Create Production Environment File**

Create `.env.production` (don't commit this):

```bash
# Database
DATABASE_URL=your_supabase_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Supabase Storage S3
SUPABASE_S3_ACCESS_KEY_ID=your_s3_access_key
SUPABASE_S3_SECRET_ACCESS_KEY=your_s3_secret_key
SUPABASE_STORAGE_REGION=your_storage_region

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secure_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. **Update Google OAuth Settings**

In [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services > Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add authorized origins:
   - `https://your-app-name.vercel.app`
4. Add authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`

---

## 🚀 Vercel Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Login to Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Your Project**
   ```
   1. Click "Add New..." → "Project"
   2. Select your GitHub repository
   3. Configure project settings:
      - Framework Preset: Next.js
      - Root Directory: ./
      - Build Command: npm run build
      - Output Directory: .next
   ```

3. **Configure Environment Variables**
   In the deployment configuration:
   ```
   Add each environment variable from your .env file:
   
   DATABASE_URL → your_supabase_database_url
   NEXT_PUBLIC_SUPABASE_URL → your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY → your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY → your_supabase_service_role_key
   SUPABASE_S3_ACCESS_KEY_ID → your_s3_access_key
   SUPABASE_S3_SECRET_ACCESS_KEY → your_s3_secret_key
   SUPABASE_STORAGE_REGION → your_storage_region
   NEXTAUTH_URL → https://your-app-name.vercel.app
   NEXTAUTH_SECRET → your_secure_nextauth_secret
   GOOGLE_CLIENT_ID → your_google_client_id
   GOOGLE_CLIENT_SECRET → your_google_client_secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# Set up and deploy? Yes
# Which scope? (your account)
# Link to existing project? No
# Project name? invoice-management
# Directory? ./
# Override settings? No

# Deploy to production
vercel --prod
```

---

## ⚙️ Post-Deployment Configuration

### 1. **Update Supabase Settings**

In your Supabase dashboard:

1. **Authentication > URL Configuration**
   ```
   Site URL: https://your-app-name.vercel.app
   Redirect URLs: https://your-app-name.vercel.app/api/auth/callback/google
   ```

2. **Storage > Settings**
   - Verify S3 credentials are working
   - Test file upload from production

### 2. **Verify Database Connection**

```sql
-- Run in Supabase SQL Editor to verify connection
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 3. **Test Critical Functions**

- [ ] User authentication (Google OAuth)
- [ ] Invoice creation
- [ ] File uploads
- [ ] Database queries
- [ ] Search functionality

---

## 🔒 Security Checklist

### Environment Variables
- [ ] All secrets are in Vercel environment variables (not in code)
- [ ] `NEXTAUTH_SECRET` is cryptographically secure
- [ ] Database credentials are correct
- [ ] S3 credentials have minimal required permissions

### Domain Configuration
- [ ] Google OAuth URLs updated for production domain
- [ ] Supabase redirect URLs configured
- [ ] CORS settings allow your domain

---

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid Redirect URI"
**Solution:**
```
1. Check Google OAuth settings
2. Ensure redirect URI exactly matches:
   https://your-domain.vercel.app/api/auth/callback/google
3. Wait 5 minutes for Google to propagate changes
```

### Issue 2: "Database Connection Failed"
**Solution:**
```
1. Verify DATABASE_URL in Vercel environment variables
2. Check Supabase project is active
3. Ensure connection string includes all parameters
```

### Issue 3: "File Upload Fails"
**Solution:**
```
1. Verify S3 credentials in Vercel environment
2. Check bucket permissions in Supabase
3. Ensure storage region is correct
```

### Issue 4: "NextAuth Configuration Error"
**Solution:**
```
1. Set NEXTAUTH_URL to your Vercel domain
2. Generate new NEXTAUTH_SECRET: openssl rand -base64 32
3. Verify both are set in Vercel environment variables
```

---

## 🔄 Continuous Deployment

Once deployed, Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for PRs
- ✅ Runs builds and tests
- ✅ Updates your production URL

### Branch Protection (Optional)
```bash
# Deploy only specific branches to production
# In Vercel dashboard: Settings → Git → Production Branch
# Set to: main
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics
```javascript
// Add to your Next.js app (optional)
import { Analytics } from '@vercel/analytics/react'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Error Monitoring
- Check Vercel Function Logs
- Monitor Supabase dashboard for database errors
- Set up alerts for critical failures

---

## 🚀 Performance Optimization

### 1. **Image Optimization**
```javascript
// Use Next.js Image component for better performance
import Image from 'next/image'
```

### 2. **Caching Strategy**
```javascript
// Add to next.config.js
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
    ]
  },
}
```

---

## ✅ Final Verification

After deployment, test:

1. **Authentication Flow**
   - [ ] Google OAuth login works
   - [ ] User sessions persist
   - [ ] Logout functionality

2. **Core Features**
   - [ ] Dashboard loads with correct data
   - [ ] Create new invoice
   - [ ] Upload documents
   - [ ] Search and filter invoices
   - [ ] Edit existing invoices

3. **Performance**
   - [ ] Page load times < 3 seconds
   - [ ] Mobile responsiveness
   - [ ] File upload speed acceptable

---

## 🆘 Need Help?

**Vercel Support:**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

**Common Resources:**
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Guide](https://supabase.com/docs/guides/platform/going-live)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

🎉 **Congratulations! Your invoice management system is now live on Vercel!**

**Production URL:** `https://your-app-name.vercel.app`
