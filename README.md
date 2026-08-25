# CivicDuty — Sovereign National Governance Platform & Ledger

CivicDuty is an enterprise full-stack platform for citizen issue reporting, multi-tier sovereign department escalation, SLA monitoring, and anti-corruption auditing across 15 African and global countries.

---

## 📦 What is Included in this Build

- **Frontend Application**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Motion transitions.
- **Backend API & Server**: Node.js Express server (`server.ts`) with static asset delivery, health checks, database dumps, and REST routing.
- **Database Engine & Schemas**: Pre-configured database schema and JSON ledger (`src/data/database.json`) storing all citizen reports, user profiles, uploaded avatars, audit logs, municipal projects, and invoices.
- **Civic Identity & Profile Photos**: Full profile photo upload system with client-side canvas compression, preset avatar badges, and customizable display names.
- **Deployment Setups**: Dockerfile, docker-compose, and scripts for GitHub Actions, Render, Railway, Vercel, and Google Cloud Run.

---

## 🛠️ Step-by-Step GitHub & Cloud Deployment

### 1. Push to GitHub

\`\`\`bash
# Initialize git repository
git init
git add .
git commit -m "feat: CivicDuty complete fullstack application"

# Set main branch and push to your GitHub repo
git branch -M main
git remote add origin https://github.com/YOUR_ORGANIZATION_OR_USERNAME/civicduty.git
git push -u origin main
\`\`\`

### 2. Deploy to Render / Railway / Heroku

1. Connect your GitHub repository in the cloud provider dashboard.
2. Configure build and start commands:
   - **Build Command**: \`npm run build\`
   - **Start Command**: \`npm start\`
   - **Node Version**: \`>= 20.x\`
3. Set environment variable: \`PORT=3000\`

### 3. Deploy with Docker

\`\`\`bash
# Build the production Docker image
docker build -t civicduty-platform:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --name civicduty civicduty-platform:latest
\`\`\`

### 4. Deploy with Docker Compose

\`\`\`bash
docker compose up -d
\`\`\`

---

## 💻 Local Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile full-stack production build
npm run build

# Start production server
npm start
\`\`\`
