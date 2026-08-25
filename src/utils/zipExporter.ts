import JSZip from 'jszip';

export async function exportLiveZip(onProgress?: (pct: number, status: string) => void): Promise<Blob> {
  if (onProgress) onProgress(10, 'Initializing ZIP archive...');

  const zip = new JSZip();

  // Create a structured folder layout
  const srcFolder = zip.folder('src');
  const serverFolder = zip.folder('server');
  const dataFolder = zip.folder('data');
  const docsFolder = zip.folder('docs');

  if (onProgress) onProgress(30, 'Exporting database snapshots & state...');

  // Capture current state from localStorage
  const currentPosts = localStorage.getItem('cd_posts') || '[]';
  const currentProfiles = localStorage.getItem('cd_profiles') || '{}';
  const currentAudit = localStorage.getItem('cd_audit') || '[]';
  const currentSubscriptions = localStorage.getItem('cd_subscriptions') || '[]';
  const currentInvoices = localStorage.getItem('cd_invoices') || '[]';
  const currentProjects = localStorage.getItem('cd_projects') || '[]';
  const currentTeam = localStorage.getItem('cd_team') || '[]';

  const fullDatabaseSnapshot = {
    exported_at: new Date().toISOString(),
    version: '14.1.0',
    platform: 'CivicDuty Sovereign National Ledger',
    tables: {
      posts: JSON.parse(currentPosts),
      profiles: JSON.parse(currentProfiles),
      audit: JSON.parse(currentAudit),
      subscriptions: JSON.parse(currentSubscriptions),
      invoices: JSON.parse(currentInvoices),
      projects: JSON.parse(currentProjects),
      team: JSON.parse(currentTeam),
    },
  };

  dataFolder?.file('database.json', JSON.stringify(fullDatabaseSnapshot, null, 2));

  if (onProgress) onProgress(50, 'Writing backend server & Docker configurations...');

  // Root files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'civicduty-fullstack',
        version: '14.1.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'tsx server.ts',
          build: 'vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs',
          start: 'node dist/server.cjs',
        },
        dependencies: {
          express: '^4.21.2',
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          'lucide-react': '^0.546.0',
          motion: '^12.23.24',
          jspdf: '^4.2.1',
          jszip: '^3.10.1',
          dotenv: '^17.2.3',
        },
        devDependencies: {
          vite: '^6.2.3',
          '@vitejs/plugin-react': '^5.0.4',
          '@tailwindcss/vite': '^4.1.14',
          tailwindcss: '^4.1.14',
          typescript: '~5.8.2',
          tsx: '^4.21.0',
          esbuild: '^0.25.0',
          '@types/node': '^22.14.0',
          '@types/express': '^4.17.21',
        },
      },
      null,
      2
    )
  );

  zip.file(
    'server.ts',
    `import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'CivicDuty Sovereign Platform',
    version: '14.1.0',
    timestamp: new Date().toISOString()
  });
});

// Database snapshot endpoint
app.get('/api/db', (req, res) => {
  const dbFile = path.join(__dirname, 'data', 'database.json');
  if (fs.existsSync(dbFile)) {
    return res.json(JSON.parse(fs.readFileSync(dbFile, 'utf-8')));
  }
  res.json({ message: 'Live database online' });
});

// Static frontend serving
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`CivicDuty Server listening on port \${PORT}\`);
});
`
  );

  zip.file(
    'Dockerfile',
    `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/data ./data
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
`
  );

  zip.file(
    'docker-compose.yml',
    `version: '3.8'
services:
  civicduty:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: always
`
  );

  zip.file(
    'README.md',
    `# CivicDuty — Sovereign National Governance Platform & Ledger
Full-stack production distribution with frontend, backend server, database schemas, and multi-country civic routing.

## 🚀 Quick Start (Local)

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run in development mode:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open http://localhost:3000 in your browser.

3. **Build for production:**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## 🐳 Deploy with Docker

\`\`\`bash
docker build -t civicduty .
docker run -p 3000:3000 civicduty
\`\`\`

## 🌐 Deploy to GitHub / Cloud

1. Initialize git repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: CivicDuty Full Stack Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/civicduty.git
   git push -u origin main
   \`\`\`

2. **Deploy on Render / Railway / Cloud Run:**
   - Select Node.js environment
   - Build command: \`npm run build\`
   - Start command: \`npm start\`
   - Port: \`3000\`
`
  );

  zip.file(
    '.env.example',
    `# CivicDuty Environment Configuration
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=
DATABASE_URL=
`
  );

  if (onProgress) onProgress(80, 'Compressing complete build ZIP bundle...');

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  if (onProgress) onProgress(100, 'Build ZIP ready for download!');
  return content;
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
