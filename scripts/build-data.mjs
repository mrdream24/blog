import fs from 'fs';
import path from 'path';

const root = process.cwd();
const postsDir = path.join(root, 'content', 'posts');
const outDir = path.join(root, 'site', 'data');

function parseFrontmatter(raw) {
  if (!raw.startsWith('+++')) return { meta: {}, body: raw };
  const end = raw.indexOf('\n+++', 3);
  if (end === -1) return { meta: {}, body: raw };
  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trimStart();
  const meta = {};
  for (const line of fm.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    meta[key] = parseValue(value);
  }
  return { meta, body };
}

function parseValue(value) {
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(v => parseValue(v.trim()));
  }
  return value;
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = files.map(file => {
  const full = path.join(postsDir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const slug = file.replace(/\.md$/, '').toLowerCase();
  return {
    slug,
    file,
    title: meta.title || slug,
    date: meta.date || '',
    draft: !!meta.draft,
    categories: Array.isArray(meta.categories) ? meta.categories.filter(Boolean) : [],
    tags: Array.isArray(meta.tags) ? meta.tags.filter(Boolean) : [],
    series: Array.isArray(meta.series) ? meta.series.filter(Boolean) : [],
    body
  };
}).sort((a,b)=> (a.date < b.date ? 1 : -1));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'posts.json'), JSON.stringify(posts, null, 2));
console.log(`Built ${posts.length} posts -> site/data/posts.json`);
