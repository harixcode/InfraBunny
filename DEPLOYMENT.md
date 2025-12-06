# Deploying InfraBunny to Vercel

## Prerequisites
- Vercel account
- GitHub repository with your code

## Step 1: Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure build settings (should auto-detect Next.js)

## Step 3: Add PostgreSQL Database

### Using Supabase (Recommended - Free Tier)

1. Go to [supabase.com](https://supabase.com) and create a project
2. Get your connection string from Settings → Database → Connection String (URI)
3. Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
4. In Vercel project → Settings → Environment Variables
5. Add: `DATABASE_URL` = your Supabase connection string
6. Select all environments (Production, Preview, Development)

**See `SUPABASE_SETUP.md` for detailed setup instructions.**

### Alternative: Vercel Postgres

1. In your Vercel project, go to "Storage" tab
2. Click "Create Database" → Select "Postgres"
3. Vercel will automatically add `DATABASE_URL` to your environment variables

## Step 4: Run Database Migrations

After deployment, you need to initialize the database:

### Method 1: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.local

# Run migrations locally connected to prod DB
npx prisma db push

# Run seed script
npm run db:seed
```

### Method 2: Add Build Command

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push --accept-data-loss && next build",
    "postbuild": "ts-node prisma/seed.ts"
  }
}
```

⚠️ **Warning**: `--accept-data-loss` will reset your database on every deployment!

### Method 3: Manual Migration (Safest for Production)

```bash
# Connect to your database using your preferred tool
# Then run the SQL schema manually
```

## Step 5: Verify Deployment

1. Visit your deployment URL
2. Check that the projects load
3. Verify the diagram renders correctly
4. Test switching between projects and versions

## Troubleshooting

### Build Error: "Failed to collect page data"
✅ **Fixed**: All API routes now have `export const dynamic = 'force-dynamic'`

### Database Connection Error
- Verify `DATABASE_URL` is set in environment variables
- Check that database is accessible from Vercel's network
- Ensure connection string includes `?schema=public` for PostgreSQL

### Prisma Client Error
- Make sure `prisma generate` runs during build
- Check that `@prisma/client` is in `dependencies` (not `devDependencies`)

## Environment Variables Needed

```env
DATABASE_URL=postgresql://... # Added automatically by Vercel Postgres
```

## Post-Deployment

To add more snapshots after deployment:

1. Use the API endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/snapshots \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "new-project",
    "terraformState": { ... }
  }'
```

2. Or re-run the seed script with production database connection

## Recommended: Use Preview Environments

Vercel creates preview deployments for each git branch:
- `main` branch → Production
- Other branches → Preview deployments with separate databases

## Cost Considerations

**Free Tier Limits:**
- Vercel: 100 GB bandwidth, 100 GB-hours compute
- Vercel Postgres: 256 MB storage, 60 compute hours

For production, consider:
- Vercel Pro: $20/month
- Or use external PostgreSQL with free tier (Supabase, Neon)

