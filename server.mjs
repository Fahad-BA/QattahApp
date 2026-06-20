import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createGzip, createBrotliCompress } from 'zlib';

const PORT = 3000;
const HOST = '0.0.0.0';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');

// ─── In-memory file cache ───
const fileCache = new Map();
const CACHE_MAX = 50;

function getCachedFile(filePath) {
  if (fileCache.has(filePath)) return fileCache.get(filePath);
  const content = fs.readFileSync(filePath);
  if (fileCache.size >= CACHE_MAX) {
    // Evict oldest entry
    const firstKey = fileCache.keys().next().value;
    fileCache.delete(firstKey);
  }
  fileCache.set(filePath, content);
  return content;
}

// Pre-load index.html into memory
const INDEX_HTML = fs.existsSync(path.join(DIST_DIR, 'index.html'))
  ? fs.readFileSync(path.join(DIST_DIR, 'index.html'))
  : null;

// ─── MIME types ───
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.manifest': 'text/cache-manifest',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
};

// ─── Cache-Control by file type ───
function getCacheControl(ext, isHTML) {
  if (isHTML) return 'no-cache, must-revalidate';
  if (['.js', '.mjs', '.css', '.woff2', '.woff', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.svg'].includes(ext)) {
    return 'public, max-age=31536000, immutable';
  }
  if (['.json', '.webmanifest', '.manifest', '.txt'].includes(ext)) {
    return 'public, max-age=3600';
  }
  return 'no-cache';
}

// ─── Security headers ───
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Normalize URL — strip query string
  const urlPath = req.url.split('?')[0];

  // Resolve file path
  let filePath;
  let isHTML = false;

  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(DIST_DIR, 'index.html');
    isHTML = true;
  } else {
    // Prevent path traversal
    const normalized = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    filePath = path.join(DIST_DIR, normalized);

    // If file doesn't exist, serve index.html (SPA fallback)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
      isHTML = true;
    }
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  // Get file content (from cache or disk)
  let content;
  if (isHTML && INDEX_HTML) {
    content = INDEX_HTML;
  } else {
    try {
      content = getCachedFile(filePath);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
  }

  // Headers
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': getCacheControl(ext, isHTML),
    ...SECURITY_HEADERS,
  };

  // Check for pre-compressed brotli/gzip files first (built by vite-plugin-compression)
  const brPath = filePath + '.br';
  const gzPath = filePath + '.gz';

  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (acceptEncoding.includes('br') && fs.existsSync(brPath)) {
    // Serve pre-compressed brotli
    const compressed = getCachedFile(brPath);
    headers['Content-Encoding'] = 'br';
    headers['Content-Length'] = compressed.length;
    res.writeHead(200, headers);
    res.end(compressed);
    return;
  }

  if (acceptEncoding.includes('gzip') && fs.existsSync(gzPath)) {
    // Serve pre-compressed gzip
    const compressed = getCachedFile(gzPath);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = compressed.length;
    res.writeHead(200, headers);
    res.end(compressed);
    return;
  }

  // No pre-compressed version — serve raw (works for small files like robots.txt)
  headers['Content-Length'] = content.length;
  res.writeHead(200, headers);
  res.end(content);
});

server.listen(PORT, HOST, () => {
  console.log(`Qattah App server running at http://${HOST}:${PORT}`);
  console.log(`  ✓ Compression (brotli/gzip) enabled`);
  console.log(`  ✓ Static asset caching enabled`);
  console.log(`  ✓ In-memory file cache enabled`);
  console.log(`  ✓ Security headers enabled`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
