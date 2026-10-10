import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { resolve, join, relative, isAbsolute, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

// Only explicit placeholders are supported. Template HTML is trusted source;
// metadata is escaped before it reaches an HTML attribute or text node.
export function render(template, values) {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Unknown template variable: ${key}`);
    return values[key];
  });
}

export function build(output = join(root, 'dist')) {
  const destination = resolve(output);
  const fromRoot = relative(root, destination);
  const toRoot = relative(destination, root);
  const outside = path => path.startsWith('..' + '/') || path === '..' || isAbsolute(path);
  if (!outside(toRoot) || (!outside(fromRoot) && fromRoot !== 'dist')) {
    throw new Error('Unsafe build output: use dist or a temporary directory outside the repository');
  }
  const site = JSON.parse(read('src/data/site.json'));
  const layout = read('src/layouts/base.html');
  const shared = Object.fromEntries(['header', 'footer', 'call-to-action'].map(name => [name, read(`src/partials/${name}.html`)]));
  // The 404 document is served by the host for unknown URLs; it is not part of navigation or the sitemap.
  const notFound = {id: '404', url: '/', title: `Page not found — ${site.companyName}`, description: 'The page you were looking for could not be found.'};
  const rendered = [...site.pages, notFound].map(page => {
    const values = {
      companyName: escape(site.companyName), email: escape(site.email),
      copyrightYear: escape(site.copyrightYear), title: escape(page.title),
      description: escape(page.description),
      canonical: escape(new URL(page.url, site.url).href),
      socialImage: escape(new URL('assets/images/technology-tree-v1.png', site.url).href),
      structuredData: JSON.stringify({...site.organization, name: site.companyName, email: site.email, url: site.url}).replace(/</g, '\\u003c'),
      navigation: site.pages.map(item => `<a href="${escape(item.url)}"${item.id === page.id ? ' aria-current="page"' : ''}${item.id === 'contact' ? ' class="nav-contact"' : ''}>${escape(item.label)}</a>`).join(''),
    };
    values.header = render(shared.header, values);
    values.footer = render(shared.footer, values);
    values.callToAction = render(shared['call-to-action'], values);
    values.content = render(read(`src/pages/${page.id}.html`), values);
    return [page, render(layout, values)];
  });
  // Output is disposable; never write generated files over source files.
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  cpSync(join(root, 'public'), output, { recursive: true });
  cpSync(join(root, 'licenses'), join(output, 'licenses'), { recursive: true });
  mkdirSync(join(output, 'assets/css'), { recursive: true });
  // Preserve cascade order while serving one custom CSS asset.
  const styles = ['base', 'components', 'theme', 'hero', 'pages'];
  writeFileSync(join(output, 'assets/css/site.css'), styles.map(name => `/* ${name} */\n${read(`src/styles/${name}.css`)}`).join('\n'));
  cpSync(join(root, 'src/scripts'), join(output, 'assets/js'), { recursive: true });
  for (const [page, html] of rendered) {
    if (page === notFound) { writeFileSync(join(output, '404.html'), html); continue; }
    const file = join(output, page.url.slice(1), 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    // Keep complete documents at old URLs for bookmarks and no-JS access.
    // The browser module redirects these aliases to their canonical URL.
    if (page.id !== 'index') writeFileSync(join(output, page.file), html);
  }
  writeFileSync(join(output, 'tree.html'), rendered.find(([page]) => page.id === 'index')[1]);
  const urls = site.pages.map(page => `  <url><loc>${escape(new URL(page.url, site.url).href)}</loc></url>`).join('\n');
  writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  writeFileSync(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site.url).href}\n`);
  return output;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Built website: ${build()}`);
}
