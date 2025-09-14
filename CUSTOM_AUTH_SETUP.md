# Custom User Management System

## 🎯 **Overview**

The system now uses **custom user management** instead of Supabase Auth. This gives us full control over user data and allows us to store additional information regardless of authentication method.

## 📊 **Database Changes**

### **New `users` Table:**
```sql
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- Only for email/password users, NULL for OAuth
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
```

### **Key Features:**
- **Unified user storage** regardless of auth method
- **Password hashing** for email/password users
- **Google ID storage** for OAuth users
- **Flexible auth provider** tracking
- **Role-based access** control
- **Account status** management

## 🔐 **Authentication Flow**

### **Email/Password Registration:**
1. User fills registration form
2. Password is hashed with bcrypt
3. User record created in `users` table
4. User can immediately sign in

### **Email/Password Sign In:**
1. User enters credentials
2. System looks up user by email + auth_provider='email'
3. Password verified against stored hash
4. Session created if valid

### **Google OAuth:**
1. User clicks "Sign in with Google"
2. Google OAuth flow completes
3. System checks if user exists by Google ID
4. If not found, checks by email
5. Creates new user or updates existing with Google ID
6. Session created

## 🚀 **Benefits of This Approach**

### **✅ Full Control:**
- Complete ownership of user data
- Custom fields and validation
- No dependency on Supabase Auth limitations

### **✅ Unified User Management:**
- Single users table for all auth methods
- Consistent user experience
- Easy to add new auth providers

### **✅ Enhanced Security:**
- Proper password hashing
- Account status controls
- Custom role management

### **✅ Better Integration:**
- Direct foreign key relationships
- Simplified queries
- No auth.users dependencies

## 🔧 **Setup Instructions**

### **1. Database Setup:**
```bash
# Run the updated schema
psql -h your-host -d your-db -f database/schema.sql
```

### **2. Environment Variables:**
```env
# Required for database operations
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Optional for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **3. Test Authentication:**

**Email/Password:**
1. Visit `/auth/signup`
2. Create account with email/password
3. Sign in at `/auth/signin`

**Google OAuth:**
1. Visit `/auth/signin`
2. Click "Continue with Google"
3. Complete OAuth flow

## 📝 **Usage Examples**

### **Check User in API Route:**
```typescript
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', session.user.id)
  .single()

if (!user?.is_active) {
  return NextResponse.json({ error: 'Account disabled' }, { status: 403 })
}
```

### **Create Invoice with User Reference:**
```typescript
const { data: invoice } = await supabase
  .from('invoices')
  .insert({
    invoice_number: 'INV-001',
    created_by: session.user.id, // Direct reference to users.id
    // ... other fields
  })
```

## 🔄 **Migration from Supabase Auth**

If you had existing Supabase Auth users:

1. **Export existing users** from Supabase Auth
2. **Transform data** to match new schema
3. **Import into users table** with appropriate auth_provider values
4. **Update foreign key references** in related tables

## 🎉 **Ready to Use!**

The system now provides:
- ✅ **Custom user registration** with email/password
- ✅ **Google OAuth integration** with user creation
- ✅ **Unified user management** in single table
- ✅ **Role-based access** control
- ✅ **Account status** management
- ✅ **Direct database** relationships

**No more Supabase Auth dependencies!** 🚀
