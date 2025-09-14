# Demo Authentication Instructions

## 🔐 Authentication Options

The system now has simplified authentication for demo purposes:

### 1. **Email/Password Authentication**
- Use any email address
- Password: `demo123`
- Example: `user@example.com` / `demo123`

### 2. **Google OAuth**
- Click "Continue with Google"
- Use your actual Google account
- Will work without database setup

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Visit:** `http://localhost:3000`

3. **Try authentication:**
   - Click "Sign In"
   - Use demo credentials: any email + `demo123`
   - Or click "Continue with Google"

## 📝 Notes

- **Database not required** for basic authentication testing
- **Google OAuth** works without Supabase setup
- **Full database integration** can be enabled later by following `SETUP_GUIDE.md`

## 🔧 Full Setup (Optional)

To enable full database integration:
1. Follow `SETUP_GUIDE.md` to set up Supabase
2. Uncomment the adapter in `lib/auth/config.ts`
3. Replace demo authentication with real database queries

The system is now ready for testing and development!
