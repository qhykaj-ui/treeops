// Dependency-free checks for the static site before it is published.
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

// Compare exact names: macOS file systems ignore case, GitHub Pages does not.
const files = readdirSync('.');
check(files.includes('index.html'), 'index.html is missing (GitHub Pages needs a lowercase index.html)');
check(!files.includes('Index.html'), 'Index.html must be renamed to index.html');
check(existsSync('CNAME') && readFileSync('CNAME', 'utf8').trim() === 'treeops.net', 'CNAME must contain treeops.net');

if (existsSync('index.html')) {
  const html = readFileSync('index.html', 'utf8');
  check(/<title>[^<]+<\/title>/.test(html), 'index.html needs a <title>');
  check(html.includes('<link rel="canonical" href="https://treeops.net/">'), 'index.html needs the treeops.net canonical link');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) check(ids.has(anchor), `index.html links to #${anchor}, which does not exist`);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"#:]+)"/g)) {
    if (ref.startsWith('//')) continue;
    check(existsSync(ref.replace(/^\//, '')), `index.html references a missing local file: ${ref}`);
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch { failures.push('structured data (ld+json) is not valid JSON'); }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
console.log('✓ Site checks passed');
