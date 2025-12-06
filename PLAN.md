# InfraBunny - Cloud Resource Visualization Tool

## 🎯 Project Overview
A lightweight cloud resource visualization tool for management to monitor infrastructure resources, track changes, and understand resource relationships across projects.

## ✨ Core Features
1. **Visual Resource Graph** - Interactive diagram showing resource relationships
2. **Project-based Organization** - Multiple projects identified via tags
3. **Resource Details** - Click any resource to view its configuration
4. **Change Tracking** - Version snapshots with diff highlighting

## 🏗️ Proposed Tech Stack

### Frontend
- **Framework**: Next.js 14 (React) with TypeScript
- **Visualization**: React Flow (easy to use, perfect for resource graphs)
- **Styling**: Tailwind CSS
- **State Management**: React Context + hooks (simple for hackathon)
- **Diff Viewer**: react-diff-viewer-continued

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Next.js API Routes (full-stack in one repo)
- **Database**: SQLite (zero setup, file-based)
- **ORM**: Prisma (type-safe, great DX)

### Infrastructure Simulation (No Real AWS!)

#### Option 1: **Mock Terraform State Files** ⭐ RECOMMENDED
- Create sample `terraform.tfstate` files with realistic AWS resources
- Parse JSON state files to extract resources and relationships
- Pros: 
  - Zero cost
  - Full control over data
  - No external dependencies
  - Perfect for demo
- Cons:
  - Not "real" infrastructure

#### Option 2: **LocalStack** (AWS Mock)
- Free tier available
- Simulates AWS services locally
- Can use actual Terraform to provision mock resources
- Pros:
  - More realistic
  - Can run Terraform commands
- Cons:
  - Setup overhead
  - May be overkill for hackathon

#### Option 3: **Terraform Cloud (Free Tier)**
- Use free tier with synthetic workspaces
- No actual AWS resources provisioned
- Pros:
  - Cloud-based
  - Real Terraform experience
- Cons:
  - Still somewhat complex

## 📋 Recommended Approach: Mock Terraform State

### Why This Works Best for Hackathon:
1. **Zero Setup Time** - No AWS account, no LocalStack installation
2. **Predictable Data** - You control exactly what resources exist
3. **Fast Iteration** - Just edit JSON files to test scenarios
4. **Perfect Demo** - Create compelling scenarios with rich relationships
5. **Version Testing** - Easy to create multiple versions to show diffs

### Mock Data Structure:
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
          "id": "vpc-abc123",
          "cidr_block": "10.0.0.0/16",
          "tags": {
            "Name": "Main VPC",
            "Project": "ecommerce-platform",
            "Environment": "production"
          }
        }
      }]
    },
    {
      "type": "aws_subnet",
      "name": "public_1",
      "instances": [{
        "attributes": {
          "id": "subnet-def456",
          "vpc_id": "vpc-abc123",
          "cidr_block": "10.0.1.0/24",
          "tags": {
            "Name": "Public Subnet 1",
            "Project": "ecommerce-platform"
          }
        },
        "dependencies": ["aws_vpc.main"]
      }]
    }
  ]
}
```

## 🗃️ Database Schema

### Tables:
1. **snapshots**
   - id, project_name, created_at, terraform_state (JSON)

2. **resources**
   - id, snapshot_id, resource_type, resource_name, resource_id, attributes (JSON), tags (JSON)

3. **changes**
   - id, from_snapshot_id, to_snapshot_id, resource_id, change_type (added/modified/deleted), diff (JSON)

## 🎨 UI/UX Flow

### Main Dashboard
```
┌─────────────────────────────────────────────┐
│  InfraBunny 🐰                    [Refresh] │
├─────────────────────────────────────────────┤
│                                             │
│  Projects:  [All] [ecommerce] [analytics]  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │         [VPC] ────┬──── [Subnet1]  │   │
│  │                   │                 │   │
│  │                   ├──── [Subnet2]  │   │
│  │                   │                 │   │
│  │                   └──── [EC2]      │   │
│  │                                     │   │
│  │         [RDS] ──────── [Security]  │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Version History:                          │
│  ○ Dec 6, 2025 3:45 PM (current)          │
│  ○ Dec 6, 2025 2:30 PM (3 changes) ←      │
│  ○ Dec 6, 2025 1:15 PM                    │
└─────────────────────────────────────────────┘
```

### Resource Detail Panel
```
┌──────────────────────────────────┐
│  aws_vpc.main              [×]   │
├──────────────────────────────────┤
│  ID: vpc-abc123                  │
│  Type: AWS VPC                   │
│  Project: ecommerce-platform     │
│                                  │
│  Configuration:                  │
│  • CIDR: 10.0.0.0/16            │
│  • DNS Hostnames: enabled        │
│  • DNS Support: enabled          │
│                                  │
│  🔗 Dependencies:                │
│  • 3 Subnets                    │
│  • 2 Security Groups            │
│                                  │
│  📊 Recent Changes:              │
│  + tags.CostCenter added         │
│  ~ cidr_block modified          │
└──────────────────────────────────┘
```

## 🚀 Implementation Plan

### Phase 1: Setup (30 min)
- [x] Initialize Next.js project
- [ ] Setup Prisma with SQLite
- [ ] Install React Flow and Tailwind CSS
- [ ] Create basic layout

### Phase 2: Mock Data (45 min)
- [ ] Create 2-3 sample Terraform state files
  - E-commerce project: VPC, Subnets, EC2, RDS, S3
  - Analytics project: Lambda, DynamoDB, API Gateway
- [ ] Create multiple versions showing changes
- [ ] Build parser for Terraform state JSON

### Phase 3: Backend API (1 hour)
- [ ] API endpoint: Upload/import Terraform state
- [ ] API endpoint: List projects (extract from tags)
- [ ] API endpoint: Get resources by project
- [ ] API endpoint: Get resource details
- [ ] API endpoint: Compare snapshots (diff logic)
- [ ] Store snapshots in DB with versioning

### Phase 4: Visualization (2 hours)
- [ ] Build React Flow graph
- [ ] Color-code by resource type
- [ ] Show relationships (dependencies)
- [ ] Filter by project tags
- [ ] Interactive zoom/pan
- [ ] Node click to show details

### Phase 5: Change Tracking (1 hour)
- [ ] Snapshot comparison logic
- [ ] Diff calculation
- [ ] Highlight changed resources in graph
- [ ] Show change summary
- [ ] Timeline/history view

### Phase 6: Polish (1 hour)
- [ ] Beautiful UI with Tailwind
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] Demo data pre-loaded

**Total Time**: ~6-7 hours (perfect for hackathon!)

## 🎯 MVP Scope
**For hackathon, focus on:**
- 2 sample projects with 8-10 resources each
- 3 resource types: VPC, EC2, RDS (easy to understand)
- Basic graph visualization
- Simple diff view (added/deleted/modified)
- Clean, professional UI

**Skip for MVP:**
- Real-time AWS integration
- User authentication
- Complex resource types
- Cost analysis
- Terraform apply/destroy

## 🏆 Demo Script
1. Show dashboard with 2 projects
2. Click "ecommerce" project - graph appears
3. Click VPC node - show details panel
4. Click "Refresh" - simulate new snapshot
5. Show 1 new EC2 instance (highlighted in green)
6. Show modified RDS instance (highlighted in orange)
7. Click change to see diff
8. Switch to analytics project

## 📦 Deliverables
1. Working web application
2. Sample Terraform state files
3. SQLite database with seed data
4. README with setup instructions
5. Screenshots/demo video

---

## 🎓 Why This Stack?
- **Single codebase**: Next.js handles frontend + backend
- **Type safety**: TypeScript everywhere
- **Zero deployment overhead**: Can run entirely locally
- **Fast development**: Tailwind + React Flow = quick UI
- **Impressive demo**: React Flow graphs look professional
- **Hackathon-friendly**: Can build in one sitting

Ready to implement? 🚀

