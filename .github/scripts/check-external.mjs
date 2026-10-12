// Warns (without blocking the deploy) when an external logo on the page stops loading,
// for example when an icon service withdraws a brand.
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const urls = [...new Set([...html.matchAll(/src="(https:\/\/cdn\.simpleicons\.org\/[^"]+)"/g)].map(m => m[1]))];
let broken = 0;
await Promise.all(urls.map(async url => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) { broken++; console.log(`::warning file=index.html::External logo returns ${res.status}: ${url}`); }
  } catch (error) {
    broken++; console.log(`::warning file=index.html::External logo could not be reached: ${url} (${error.message})`);
  }
}));
console.log(`Checked ${urls.length} external logos, ${broken} not loading`);
