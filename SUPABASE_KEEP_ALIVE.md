# Supabase Keep-Alive Setup

This document explains how the automatic keep-alive system works to prevent Supabase from auto-pausing due to inactivity.

---

## 📋 Overview

**Problem:** Supabase free tier projects automatically pause after **7 days of database inactivity**.

**Solution:** Automated cron job that periodically queries the database to maintain activity.

---

## 🏗️ Architecture

### Components

1. **Keep-Alive API Endpoint** (`/api/cron/keep-alive`)
   - Performs lightweight database query
   - Secured with CRON_SECRET token
   - Returns execution status

2. **Vercel Cron Job**
   - Automatically calls keep-alive endpoint
   - Runs every 5 days (configurable)
   - Managed by Vercel's cron infrastructure

3. **Database Query**
   - Simple SELECT query on `users` table
   - Minimal resource usage
   - Keeps database connection active

---

## 🚀 Setup Instructions

### 1. Environment Configuration

Add the following to your `.env.local` (local) and Vercel environment variables (production):

```bash
# Generate a random secret for cron security
CRON_SECRET=your_random_secret_here_use_openssl_rand_base64_32
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 2. Vercel Deployment

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 0 */5 * *"
    }
  ]
}
```

**Schedule Format (Cron Expression):**
- `0 0 */5 * *` = Every 5 days at midnight UTC
- Customize as needed (must be less than 7 days)

### 3. Deploy to Vercel

```bash
# Deploy your changes
git add .
git commit -m "Add Supabase keep-alive cron job"
git push

# Vercel will automatically deploy and set up the cron job
```

### 4. Verify Setup

After deployment, check Vercel Dashboard:
1. Go to your project → **Settings** → **Cron Jobs**
2. Verify the keep-alive job is listed
3. Check execution logs

---

## 🔧 Configuration Options

### Adjust Cron Schedule

Edit `vercel.json` to change frequency:

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 0 */3 * *"  // Every 3 days
    }
  ]
}
```

**Common Schedules:**
- `0 0 */3 * *` - Every 3 days
- `0 0 */5 * *` - Every 5 days (recommended)
- `0 0 * * 0` - Every Sunday
- `0 12 */2 * *` - Every 2 days at noon

**Important:** Schedule must run **more frequently than every 7 days** to prevent auto-pause.

### Change Database Query

Edit `src/app/api/cron/keep-alive/route.ts` to query a different table:

```typescript
// Example: Query invoices instead
const { data, error } = await supabase
  .from('invoices')
  .select('id')
  .limit(1)
  .single()
```

---

## 🧪 Testing

### Test Locally

```bash
# Set your CRON_SECRET in .env.local
CRON_SECRET=your_secret_here

# Call the endpoint with curl
curl -X GET http://localhost:3000/api/cron/keep-alive \
  -H "Authorization: Bearer your_secret_here"
```

**Expected Response:**
```json
{
  "message": "Database keep-alive successful",
  "timestamp": "2024-12-21T12:00:00.000Z",
  "success": true,
  "queryExecuted": true
}
```

### Test in Production

```bash
# Replace with your production URL and secret
curl -X GET https://your-app.vercel.app/api/cron/keep-alive \
  -H "Authorization: Bearer your_production_secret"
```

### Monitor Cron Execution

1. **Vercel Dashboard:**
   - Project → **Deployments** → Select deployment
   - View **Functions** logs
   - Filter by `/api/cron/keep-alive`

2. **Check Execution History:**
   - Project → **Settings** → **Cron Jobs**
   - View execution logs and status

---

## 🔒 Security

### CRON_SECRET Protection

The endpoint is protected by a secret token to prevent unauthorized access:

```typescript
const authHeader = request.headers.get('authorization')
const cronSecret = process.env.CRON_SECRET

if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}
```

**Best Practices:**
- ✅ Use a strong, random secret (32+ characters)
- ✅ Never commit secrets to git
- ✅ Use different secrets for dev/prod
- ✅ Rotate secrets periodically

### Vercel Cron Security

Vercel automatically includes security headers when calling cron endpoints:
- `x-vercel-cron: 1` header is added
- Requests come from Vercel infrastructure
- Optional: Add IP whitelist for extra security

---

## 📊 Monitoring

### Success Indicators

✅ **Cron job runs successfully:**
- Check Vercel cron logs
- Verify 200 status responses
- Confirm `success: true` in response

✅ **Database stays active:**
- Supabase project doesn't show "Paused" status
- No auto-pause notifications from Supabase

### Troubleshooting

**Problem:** Cron job fails with 401 Unauthorized

**Solution:**
- Verify `CRON_SECRET` is set in Vercel environment variables
- Check authorization header format: `Bearer <secret>`
- Ensure secret matches between Vercel and endpoint

**Problem:** Database query fails

**Solution:**
- Check Supabase connection credentials
- Verify `users` table exists and is accessible
- Review Supabase logs for connection issues

**Problem:** Cron job doesn't run

**Solution:**
- Verify `vercel.json` is committed and deployed
- Check Vercel dashboard for cron job configuration
- Ensure you're on a Vercel plan that supports cron jobs (Pro or higher)

---

## 💡 Alternative Solutions

### 1. Manual Approach (Not Recommended)

Visit your app regularly to generate database activity.

**Pros:** No setup required  
**Cons:** Unreliable, requires manual intervention

### 2. External Cron Service

Use services like **Cron-job.org** or **EasyCron**:

```bash
# Configure external service to call:
GET https://your-app.vercel.app/api/cron/keep-alive
Header: Authorization: Bearer your_secret
```

**Pros:** Works with any hosting platform  
**Cons:** Requires external service management

### 3. Upgrade Supabase Plan

Upgrade to Supabase Pro plan ($25/month):

**Pros:** No auto-pause, better performance  
**Cons:** Monthly cost

---

## 📈 Cost Considerations

### Vercel Cron Jobs

- **Hobby Plan:** ❌ No cron jobs
- **Pro Plan:** ✅ Included (starts at $20/month)
- **Enterprise:** ✅ Included

**Note:** If you're on Hobby plan, use an external cron service instead.

### Supabase Database

- **Free Tier:** Auto-pauses after 7 days
- **Pro Tier:** No auto-pause ($25/month)

**Recommendation:** Use cron keep-alive on free tier, upgrade when needed.

---

## 🎯 Best Practices

1. **Schedule Frequency:**
   - Run every 5 days (safe margin before 7-day limit)
   - Don't run too frequently (wastes resources)

2. **Query Optimization:**
   - Use lightweight queries (LIMIT 1)
   - Query small tables
   - Avoid complex joins or aggregations

3. **Error Handling:**
   - Log all errors for debugging
   - Return proper status codes
   - Monitor execution success rate

4. **Security:**
   - Always use CRON_SECRET
   - Rotate secrets periodically
   - Monitor for unauthorized access attempts

---

## 📝 Summary

**Yes, this will work!** The keep-alive cron job will:

✅ Prevent Supabase from auto-pausing  
✅ Run automatically every 5 days  
✅ Execute lightweight database queries  
✅ Require minimal resources  
✅ Work reliably on Vercel Pro plan  

**Setup Time:** ~5 minutes  
**Maintenance:** Zero (fully automated)  
**Cost:** Included with Vercel Pro plan  

---

## 🔗 Related Documentation

- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Supabase Pricing](https://supabase.com/pricing)
- [Cron Expression Format](https://crontab.guru/)

---

## 📞 Support

If you encounter issues:

1. Check Vercel cron logs
2. Verify environment variables
3. Test endpoint manually
4. Review Supabase connection status

For questions, refer to:
- Vercel Documentation
- Supabase Documentation
- Project README.md
