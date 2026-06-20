const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');

// ─── In-memory file cache ───
const fileCache = new Map();
const CACHE_MAX = 50;

function getCachedFile(filePath) {
  if (fileCache.has(filePath)) return fileCache.get(filePath);
  const content = fs.readFileSync(filePath);
  if (fileCache.size >= CACHE_MAX) {
    const firstKey = fileCache.keys().next().value;
    fileCache.delete(firstKey);
  }
  fileCache.set(filePath, content);
  return content;
}

// Pre-load index.html
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
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function getCacheControl(ext, isHTML) {
  if (isHTML) return 'no-cache, must-revalidate';
  if (['.js', '.mjs', '.css', '.woff2', '.woff', '.png', '.jpg', '.ico', '.svg'].includes(ext)) {
    return 'public, max-age=31536000, immutable';
  }
  if (['.json', '.webmanifest', '.txt'].includes(ext)) {
    return 'public, max-age=3600';
  }
  return 'no-cache';
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];
  let filePath;
  let isHTML = false;

  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(DIST_DIR, 'index.html');
    isHTML = true;
  } else {
    const normalized = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    filePath = path.join(DIST_DIR, normalized);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
      isHTML = true;
    }
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

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

  const headers = {
    'Content-Type': contentType,
    'Cache-Control': getCacheControl(ext, isHTML),
    ...SECURITY_HEADERS,
  };

  // Serve pre-compressed files if available
  const brPath = filePath + '.br';
  const gzPath = filePath + '.gz';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (acceptEncoding.includes('br') && fs.existsSync(brPath)) {
    const compressed = getCachedFile(brPath);
    headers['Content-Encoding'] = 'br';
    headers['Content-Length'] = compressed.length;
    res.writeHead(200, headers);
    res.end(compressed);
    return;
  }

  if (acceptEncoding.includes('gzip') && fs.existsSync(gzPath)) {
    const compressed = getCachedFile(gzPath);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = compressed.length;
    res.writeHead(200, headers);
    res.end(compressed);
    return;
  }

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
