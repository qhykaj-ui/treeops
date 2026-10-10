import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { build, render, root } from '../scripts/build.mjs';
let dir;
const read = file => readFileSync(join(dir, file), 'utf8');
before(() => { dir = mkdtempSync(join(tmpdir(), 'treeops-build-')); build(dir); });
after(() => rmSync(dir, { recursive: true, force: true }));

test('every page has unique metadata, one main heading, and an active navigation item', () => {
  const site = JSON.parse(readFileSync(join(root, 'src/data/site.json'), 'utf8'));
  const titles = new Set();
  for (const page of site.pages) {
    const html = read(page.file);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, page.file);
    assert.equal((html.match(/<main\b/g) || []).length, 1, page.file);
    assert(!html.includes('{{'), page.file);
    assert(html.includes(`href="${page.file}" aria-current="page"`));
    titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `duplicate IDs: ${page.file}`);
    assert.doesNotThrow(() => JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]));
  }
  assert.equal(titles.size, site.pages.length);
  assert.equal(read('index.html'), read('tree.html'));
});

test('generated HTML references resolve, including local fragments', () => {
  for (const file of readdirSync(dir).filter(f => f.endsWith('.html'))) {
    for (const [, reference] of read(file).matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(reference)) continue;
      const [path, fragment] = reference.split('#');
      const target = path || file;
      assert(existsSync(join(dir, target)), `${file}: missing ${reference}`);
      if (fragment) assert(read(target).includes(`id="${fragment}"`), `${file}: missing #${fragment}`);
    }
  }
});

test('stylesheet assets and browser module imports resolve', () => {
  for (const [, path] of read('assets/css/site.css').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (/^(data:|https?:)/.test(path)) continue;
    assert(existsSync(join(dir, 'assets/css', path)), `missing CSS asset: ${path}`);
  }
  for (const file of ['assets/js/main.js', ...readdirSync(join(dir, 'assets/js/features')).map(f => 'assets/js/features/' + f)]) {
    const syntax = spawnSync(process.execPath, ['--check', join(dir, file)], { encoding: 'utf8' });
    assert.equal(syntax.status, 0, syntax.stderr);
    for (const [, path] of read(file).matchAll(/from ['"]([^'"]+)['"]/g)) assert(existsSync(join(dir, dirname(file), path)), path);
  }
});

test('catalogue and template failures are explicit', () => {
  const html = read('work.html');
  for (const [category, expected] of Object.entries({ research: 2, government: 5, enterprise: 2 })) {
    assert.equal([...html.matchAll(new RegExp(`data-type="${category}"`, 'g'))].length, expected);
  }
  assert.throws(() => render('{{missing}}', {}), /Unknown template variable/);
  for (const path of [root, join(root, '..'), join(root, 'src'), join(root, 'public')]) {
    assert.throws(() => build(path), /Unsafe build output/);
  }
});

test('build is deterministic and does not publish source tooling', () => {
  const first = read('index.html');
  build(dir);
  assert.equal(read('index.html'), first);
  for (const path of ['src', '.git', 'package.json', 'tests', 'scripts']) assert(!existsSync(join(dir, path)), path);
});
