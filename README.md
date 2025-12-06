# InfraBunny 🐰

A Cloud Resource Visualization Tool built for management to monitor and track infrastructure resources across projects.

## 🎯 Features

- **Visual Resource Graph**: Interactive diagram showing resource relationships using React Flow
- **Project-based Organization**: Multiple projects identified via tags in Terraform state
- **Resource Details**: Click any resource to view its full configuration
- **Change Tracking**: Compare snapshots with automatic diff highlighting
- **Version History**: Track changes over time with versioned snapshots

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Visualization**: React Flow
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Mock Data**: Sample Terraform state files (no real AWS account needed!)
- **Dev Tooling**: Cursor (AI-assisted coding) for faster iteration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Setup database**:
```bash
npx prisma generate
npx prisma db push
```

3. **Seed with demo data**:
```bash
npm run db:seed
```

4. **Start development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Demo Projects

The seed data includes two sample projects:

### E-commerce Platform
- **Resources**: VPC, 2 Subnets, 3 Web Servers, Security Group, RDS Database, S3 Bucket
- **Versions**: 2 snapshots showing infrastructure changes
- **Changes**: Added web server, upgraded database, added cost center tag

### Analytics Platform
- **Resources**: DynamoDB Table, Lambda Function, API Gateway, S3 Data Lake
- **Versions**: 1 snapshot
- **Architecture**: Serverless data processing pipeline

## 🎮 How to Use

### 1. View Resources
- Select a project from the sidebar
- Interactive graph shows all resources and their relationships
- Zoom, pan, and explore the infrastructure

### 2. Inspect Resources
- Click any resource node in the graph
- View detailed configuration in the right panel
- See tags, attributes, and dependencies

### 3. Compare Versions
- Select "Compare With" dropdown in sidebar
- Choose a previous snapshot
- Changed resources are highlighted:
  - 🟢 Green = Added
  - 🟡 Yellow = Modified
  - 🔴 Red = Deleted

### 4. View Changes
- Click a modified resource
- See detailed diff showing:
  - Added attributes
  - Modified values (old → new)
  - Removed attributes

## 🗂️ Project Structure

```
InfraBunny/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── compare/            # Compare snapshots
│   │   ├── projects/           # List projects
│   │   └── snapshots/          # Snapshot CRUD
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard
├── components/
│   ├── ResourceGraph.tsx       # React Flow visualization
│   └── ResourceDetail.tsx      # Resource detail panel
├── lib/
│   ├── prisma.ts               # Prisma client
│   └── terraform-parser.ts     # Terraform state parser
├── mock-data/
│   ├── ecommerce-v1.tfstate.json
│   ├── ecommerce-v2.tfstate.json
│   └── analytics-v1.tfstate.json
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
└── package.json
```

## 🔧 API Endpoints

### GET `/api/projects`
List all projects with snapshot counts

### GET `/api/snapshots?project=<name>`
Get all snapshots for a project

### GET `/api/snapshots/:id`
Get detailed snapshot with resources

### POST `/api/snapshots`
Create new snapshot from Terraform state
```json
{
  "projectName": "my-project",
  "terraformState": { ... }
}
```

### GET `/api/compare?from=<id>&to=<id>`
Compare two snapshots and get changes

## 📝 Adding Your Own Data

### Option 1: Create Mock Terraform State Files

1. Create a new `.tfstate.json` file in `mock-data/`:

```json
{
  "version": 4,
  "terraform_version": "1.6.0",
  "resources": [
    {
      "type": "aws_vpc",
      "name": "main",
      "instances": [{
        "attributes": {
          "id": "vpc-123",
          "cidr_block": "10.0.0.0/16",
          "tags": {
            "Project": "your-project-name"
          }
        },
        "dependencies": []
      }]
    }
  ]
}
```

2. Import via API:

```bash
curl -X POST http://localhost:3000/api/snapshots \
  -H "Content-Type: application/json" \
  -d @mock-data/your-file.tfstate.json
```

### Option 2: Use the Seed Script

Edit `prisma/seed.ts` to add your own mock data, then run:

```bash
npm run db:seed
```

## 🎨 Customization

### Add New Resource Icons

Edit `components/ResourceGraph.tsx` in the `getResourceIcon()` function:

```typescript
if (resourceType.includes('your_resource')) return '🎯';
```

### Change Color Scheme

Edit `components/ResourceGraph.tsx` in the `getNodeColor()` function:

```typescript
if (resourceType.includes('your_resource')) return '#your-color';
```

## 🧪 Testing

The application uses mock Terraform state files, so no real AWS infrastructure is needed!

1. All data is stored in SQLite (`prisma/dev.db`)
2. Mock files are in `mock-data/` directory
3. Seed script populates realistic demo data
4. Safe to experiment - just re-run seed to reset

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables (if needed)
4. Deploy!

The SQLite database will persist in the deployment.

## 📚 Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework
- [React Flow](https://reactflow.dev/) - Graph visualization
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [SQLite](https://www.sqlite.org/) - Database
- [date-fns](https://date-fns.org/) - Date formatting

## 🎓 Why This Stack?

- **No AWS Account Needed**: Uses mock Terraform state files
- **Single Codebase**: Next.js handles frontend + backend
- **Zero Setup**: SQLite requires no database server
- **Type Safe**: TypeScript everywhere
- **Fast Development**: Tailwind + React Flow = rapid prototyping
- **Impressive Visuals**: Professional-looking graphs
- **Perfect for Hackathons**: Build in one sitting!

## 📖 How It Works

1. **Mock Terraform State**: JSON files simulate real Terraform state
2. **Parser**: Extracts resources, attributes, and dependencies
3. **Database**: Stores snapshots with versioning
4. **API**: Exposes endpoints for CRUD operations
5. **Visualization**: React Flow renders interactive graphs
6. **Comparison**: Diffs snapshots to detect changes
7. **UI**: Clean interface with Tailwind CSS

## 🤝 Contributing

This is a hackathon project! Feel free to:
- Add new resource types
- Improve the visualization
- Add more mock data
- Enhance the diff viewer

## 📄 License

MIT License - feel free to use for your own projects!

## 🎉 Hackathon Ready!

This project is designed to be:
- ✅ Quick to setup (< 5 minutes)
- ✅ Easy to demo
- ✅ Visually impressive
- ✅ Fully functional
- ✅ No external dependencies
- ✅ Solo-friendly

Perfect for showcasing at your hackathon! 🚀

---

Made with ❤️ and 🐰 for hackathons
