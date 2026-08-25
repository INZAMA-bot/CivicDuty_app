import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // In-Memory / File backed database store
  const dbFilePath = path.join(process.cwd(), 'src', 'data', 'database.json');

  let dbData: any = {};
  try {
    if (fs.existsSync(dbFilePath)) {
      dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading database.json:', err);
  }

  // --- API ROUTES FIRST ---

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      app: 'CivicDuty Sovereign Governance Platform',
      version: '14.1.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      node: process.version,
    });
  });

  // Full database JSON dump
  app.get('/api/db', (req, res) => {
    try {
      if (fs.existsSync(dbFilePath)) {
        const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        return res.json(data);
      }
      res.json(dbData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read database' });
    }
  });

  // Export / Download Build ZIP endpoint (if generated)
  app.get('/api/export/zip', (req, res) => {
    const zipPath = path.join(process.cwd(), 'public', 'civicduty-fullstack-build.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'civicduty-fullstack-build.zip');
    } else {
      res.status(404).json({ error: 'Build ZIP not yet generated. Run npm run build or use in-app ZIP exporter.' });
    }
  });

  // Public stats endpoint
  app.get('/api/stats', (req, res) => {
    res.json({
      activeDesks: 6420,
      countriesServed: 15,
      resolvedTicketsRate: '94.2%',
      averageSlaHours: 32.4,
      totalCivicVolunteers: 128450,
      lastBlockVerified: 'BLK-' + Math.floor(Date.now() / 1000),
    });
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ CivicDuty Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
