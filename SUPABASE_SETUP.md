# Setting Up Supabase for InfraBunny

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name**: `infrabunny` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is perfect for this project

## Step 2: Get Database Connection String

1. In your Supabase project dashboard
2. Go to **Settings** (gear icon) → **Database**
3. Scroll to **Connection String** section
4. Select **URI** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 3: Configure Local Environment

Create a `.env` file in your project root:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

## Step 4: Initialize Database

Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed with mock data
npm run db:seed
```

You should see output like:
```
Starting seed...
Created e-commerce v1 snapshot: ...
Created e-commerce v2 snapshot: ...
Created e-commerce v3 snapshot: ...
Created analytics v1 snapshot: ...
Seed completed successfully!
```

## Step 5: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 - your app should now work with Supabase!

## Step 6: Configure Vercel

In your Vercel project:

1. Go to **Settings** → **Environment Variables**
2. Add variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
   - **Environment**: Production, Preview, Development (select all)
3. Click "Save"

## Step 7: Deploy

```bash
git add .
git commit -m "Configure Supabase"
git push
```

Vercel will automatically redeploy with the new environment variable.

## Verify Database

You can view your data in Supabase:

1. Go to **Table Editor** in Supabase dashboard
2. You should see tables: `Snapshot`, `Resource`, `Change`
3. Click on them to browse the seeded data

## Supabase Free Tier Limits

✅ **Included for Free:**
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50 MB file uploads
- 500K Edge Function invocations
- Unlimited API requests
- Auto-backups (up to 7 days)

**Perfect for:**
- Hackathons
- Demos
- Small production apps
- Learning projects

## Connection Pooling (Optional, for Production)

For better performance under load:

1. In Supabase → Settings → Database
2. Look for **Connection Pooling** section
3. Copy the **Transaction** mode connection string
4. Use this in production environment variable

Format:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## Troubleshooting

### "Password authentication failed"
- Double-check your password in the connection string
- Make sure you replaced `[YOUR-PASSWORD]` with actual password

### "Connection timeout"
- Check if your IP is blocked (unlikely on free tier)
- Verify the connection string is correct
- Try using connection pooler URL instead

### "Database already exists" error
- Safe to ignore if you see this during `prisma db push`
- It means Prisma is updating existing schema

### No data showing in app
- Verify seed script ran successfully
- Check Supabase Table Editor to confirm data exists
- Check browser console for API errors

## Next Steps

Once everything works:
- ✅ Test all features locally
- ✅ Push to GitHub
- ✅ Deploy to Vercel
- ✅ Add `DATABASE_URL` to Vercel env vars
- ✅ Verify production deployment works

## Security Note

⚠️ **Never commit `.env` file to git!**

It's already in `.gitignore`, but double-check:
```bash
git status
# Should NOT show .env
```

