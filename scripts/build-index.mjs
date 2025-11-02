// scripts/build-index.mjs
// ------------------------------------------------------------
// Builds public/updates-index.json from /src/content/updates
// ------------------------------------------------------------
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const contentDir = path.join(ROOT, 'src', 'content', 'updates');
const outFile = path.join(ROOT, 'public', 'updates-index.json');

const index = [];
let count = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.md')) processFile(full);
  }
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);

  // Skip private updates
  if (data.visibility === 'private') return;

  const date =
    data.updated_at || data.date || data.created_at || fs.statSync(filePath).mtime.toISOString();

  index.push({
    slug: data.slug || path.basename(filePath, '.md'),
    title: data.title || '(untitled)',
    summary: data.summary || '',
    category: data.category || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || 'draft',
    updated_at: date,
    safety_level: data.safety_level || 'open',
    repo_target: data.repo_target || 'personal',
    visibility: data.visibility || 'public',
  });

  count++;
}

// Run and write
walk(contentDir);
index.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

const output = {
  indexVersion: 2,
  generatedAt: new Date().toISOString(),
  total: index.length,
  items: index,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log(`✅ Built index (${count} files) → ${path.relative(ROOT, outFile)}`);
