/**
 * Generate Brotli pre-compressed (.br) files for all assets in dist/
 * Runs post-build to enable maximum compression serving.
 */
import fs from 'fs';
import path from 'path';
import { brotliCompressSync } from 'zlib';

const DIST = path.resolve('dist');
const SKIP_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.gz', '.br'];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

let count = 0;
let savedBytes = 0;

for (const file of walk(DIST)) {
  const ext = path.extname(file);
  if (SKIP_EXT.includes(ext)) continue;

  const input = fs.readFileSync(file);
  const compressed = brotliCompressSync(input, { quality: 11 });
  fs.writeFileSync(file + '.br', compressed);

  savedBytes += input.length - compressed.length;
  count++;

  const ratio = ((1 - compressed.length / input.length) * 100).toFixed(1);
  console.log(`  ${path.relative(DIST, file)}.br  ${input.length}→${compressed.length}B (-${ratio}%)`);
}

console.log(`\n✓ Brotli: ${count} files compressed, saved ${(savedBytes / 1024).toFixed(1)}KB`);
