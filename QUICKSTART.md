# 🚀 Quick Start Guide

## Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma generate
npx prisma db push

# 3. Load demo data
npm run db:seed

# 4. Start the app
npm run dev
```

## Open http://localhost:3000

## 🎯 Demo Flow

### 1. **View E-commerce Infrastructure**
   - Click "ecommerce-platform" in sidebar
   - See VPC, subnets, EC2 instances, RDS, S3
   - Interactive graph with relationships

### 2. **Inspect a Resource**
   - Click any node (e.g., "Web Server 1")
   - Right panel shows full configuration
   - View tags, attributes, dependencies

### 3. **Compare Versions**
   - Select second version in "Compare With" dropdown
   - See highlighted changes:
     - 🟢 New "Web Server 3" added
     - 🟡 VPC modified (new tag)
     - 🟡 Database upgraded

### 4. **View Detailed Changes**
   - Click the yellow VPC node
   - See diff:
     - ✅ Added: `CostCenter: engineering`
   - Click yellow database node
   - See diff:
     - 📝 Modified: `engine_version: 15.4 → 15.5`
     - 📝 Modified: `instance_class: t3.large → t3.xlarge`
     - 📝 Modified: `allocated_storage: 100 → 150`

### 5. **Switch to Analytics**
   - Click "analytics-platform"
   - See serverless architecture
   - Lambda, DynamoDB, API Gateway, S3

## 🎓 Key Features to Highlight

1. **No AWS Account**: Uses mock Terraform state files
2. **Real-time Visualization**: Interactive graph with zoom/pan
3. **Change Detection**: Automatic diff between versions
4. **Multi-Project**: Tag-based project organization
5. **Version History**: Track infrastructure over time

## 🛠️ Mock Data Location

- `mock-data/ecommerce-v1.tfstate.json` - Initial state
- `mock-data/ecommerce-v2.tfstate.json` - After changes
- `mock-data/analytics-v1.tfstate.json` - Serverless project

## 📝 Adding Your Own Data

Create a new Terraform state file:

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
          "id": "vpc-xxx",
          "tags": {
            "Project": "your-project-name"
          }
        }
      }]
    }
  ]
}
```

Import via API:
```bash
curl -X POST http://localhost:3000/api/snapshots \
  -H "Content-Type: application/json" \
  -d '{"projectName": "your-project", "terraformState": {...}}'
```

## 🎨 Color Legend

- 🔵 Blue: VPC
- 🟣 Purple: Subnets, RDS
- 🟠 Orange: Security Groups
- 🩷 Pink: EC2 Instances
- 🟢 Green: S3, Added Resources
- 🟡 Yellow: Lambda, Modified Resources
- 🔴 Red: Deleted Resources

## 🎤 Presentation Tips

1. Start with dashboard overview
2. Show project switching
3. Demonstrate resource inspection
4. Compare versions to show change tracking
5. Highlight "no AWS needed" approach
6. Show code structure (Next.js + React Flow)

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Database issues?**
```bash
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Build

```bash
npm run build
npm start
```

Ready to impress! 🎉

