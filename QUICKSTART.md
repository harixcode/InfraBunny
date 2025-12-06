# InfraBunny - Quick Start Guide

Get your cloud resource visualizer running in 5 minutes!

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database (Choose One)

#### Option A: Supabase (Recommended - Cloud PostgreSQL)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Create `.env` file:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

See `SUPABASE_SETUP.md` for detailed instructions.

#### Option B: Local SQLite (Quick Test)

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create tables
npx prisma db push

# Load sample data
npm run db:seed
```

Expected output:
```
Starting seed...
Created e-commerce v1 snapshot: ...
Created e-commerce v2 snapshot: ...
Created e-commerce v3 snapshot: ...
Created analytics v1 snapshot: ...
Seed completed successfully!
Total snapshots: 4
Total resources: 30
```

### 4. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## 🎯 What You'll See

### Default Projects

1. **ecommerce-platform** (3 versions)
   - VPC with subnets
   - EC2 instances
   - Load balancer
   - RDS database
   - Security groups
   - S3 bucket

2. **analytics-platform** (1 version)
   - Lambda functions
   - DynamoDB tables
   - API Gateway
   - S3 buckets
   - IAM roles

### Key Features to Try

✅ **Switch between projects** - Click project names in sidebar

✅ **View version history** - See different snapshots in timeline

✅ **Compare versions** - Automatic comparison shows:
- 🟢 Green border = Added
- 🟡 Yellow border = Modified
- 🔴 Red border = Deleted

✅ **Explore resources** - Click any resource to see full configuration

✅ **Dependency visualization** - Arrows show relationships:
- 🛡️ Orange = Security groups
- 🔗 Purple = Subnet connections
- ➡️ Gray dashed = Explicit dependencies

✅ **Architecture view** - Resources nested inside VPCs and Subnets

## 📁 Project Structure

```
InfraBunny/
├── app/
│   ├── page.tsx              # Main UI
│   └── api/                  # Backend endpoints
│       ├── projects/
│       ├── snapshots/
│       └── compare/
├── components/
│   ├── ResourceGraph.tsx     # Diagram visualization
│   ├── ResourceDetail.tsx    # Resource info panel
│   └── ChangesPanel.tsx      # Change summary modal
├── lib/
│   ├── prisma.ts            # Database client
│   └── terraform-parser.ts  # TF state parser
├── mock-data/               # Sample Terraform states
│   ├── ecommerce-v1.tfstate.json
│   ├── ecommerce-v2.tfstate.json
│   ├── ecommerce-v3.tfstate.json
│   └── analytics-v1.tfstate.json
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Data seeder
└── README.md                # Full documentation
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes
npm run db:seed         # Load sample data
npx prisma studio       # Open database GUI

# Linting
npm run lint            # Check code quality
```

## 🐛 Troubleshooting

### "Can't reach database server"
- ✅ Check `.env` file exists with `DATABASE_URL`
- ✅ Verify connection string is correct
- ✅ For Supabase: confirm password is correct

### "No projects showing"
- ✅ Run `npm run db:seed` to load sample data
- ✅ Check browser console for errors
- ✅ Verify API is working: `curl http://localhost:3000/api/projects`

### "Prisma Client Not Found"
```bash
npx prisma generate
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## 📦 Adding Your Own Data

### Via API

```bash
curl -X POST http://localhost:3000/api/snapshots \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-project",
    "terraformState": { ... your terraform state ... }
  }'
```

### Via Seed Script

1. Add your `.tfstate.json` file to `mock-data/`
2. Update `prisma/seed.ts` to include it
3. Run `npm run db:seed`

## 🚀 Deploy to Production

See **DEPLOYMENT.md** for Vercel deployment guide.

See **SUPABASE_SETUP.md** for database setup.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Flow Documentation](https://reactflow.dev)
- [Terraform State Format](https://www.terraform.io/docs/language/state/index.html)

## 🎓 Hackathon Presentation Tips

1. **Start with the problem**: "Management can't see what cloud resources exist"
2. **Show the solution**: Live demo switching between projects
3. **Highlight change tracking**: Show version comparison with colored borders
4. **Explain the architecture**: VPC nesting, automatic dependencies
5. **Discuss scalability**: Works with any Terraform-managed infrastructure

## 🤝 Contributing

This is a hackathon project, but feel free to:
- Add new resource type icons
- Improve visualization layout
- Add more sample data
- Enhance change detection

## 📄 License

MIT License - Use freely for your projects!

---

**Need help?** Check:
- `README.md` - Full documentation
- `SUPABASE_SETUP.md` - Database setup
- `DEPLOYMENT.md` - Deployment guide
- `FEATURES.md` - Feature overview
