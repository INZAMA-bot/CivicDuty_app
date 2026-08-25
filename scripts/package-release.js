import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

// Package the entire codebase into a clean, complete full-stack zip
async function packageRelease() {
  console.log('📦 Bundling full-stack repository & databases into ZIP archive...');

  const zip = new JSZip();
  const rootDir = process.cwd();

  // Folders and files to include
  const includePaths = [
    'src',
    'public',
    'scripts',
    'index.html',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'server.ts',
    '.env.example',
    'metadata.json',
    'README.md',
    'DEPLOYMENT.md',
    'Dockerfile',
    'docker-compose.yml',
  ];

  function addDirectoryToZip(zipFolder, dirPath) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (item === 'node_modules' || item === 'dist' || item === '.git' || item.endsWith('.zip')) {
        continue;
      }
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        if (subFolder) {
          addDirectoryToZip(subFolder, fullPath);
        }
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(item, fileContent);
      }
    }
  }

  for (const item of includePaths) {
    const fullPath = path.join(rootDir, item);
    if (!fs.existsSync(fullPath)) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const folder = zip.folder(item);
      if (folder) {
        addDirectoryToZip(folder, fullPath);
      }
    } else {
      const fileContent = fs.readFileSync(fullPath);
      zip.file(item, fileContent);
    }
  }

  // Also include pre-built dist if it exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const distFolder = zip.folder('dist');
    if (distFolder) {
      addDirectoryToZip(distFolder, distDir);
    }
  }

  // Generate output zip in public folder
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, 'civicduty-fullstack-build.zip');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  fs.writeFileSync(outPath, buffer);
  const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
  console.log(`✓ Complete build ZIP packaged successfully: ${outPath} (${sizeMB} MB)`);
}

packageRelease().catch((err) => {
  console.error('Error generating release zip:', err);
});
