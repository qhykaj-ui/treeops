import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { resolve, join, relative, isAbsolute } from 'node:path';
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
  const rendered = site.pages.map(page => {
    const values = {
      companyName: escape(site.companyName), email: escape(site.email),
      copyrightYear: escape(site.copyrightYear), title: escape(page.title),
      description: escape(page.description),
      canonical: escape(new URL(page.id === 'index' ? '' : page.file, site.url).href),
      socialImage: escape(new URL('assets/images/technology-tree-v1.png', site.url).href),
      structuredData: JSON.stringify({...site.organization, name: site.companyName, email: site.email, url: site.url}).replace(/</g, '\\u003c'),
      navigation: site.pages.map(item => `<a href="${escape(item.file)}"${item.id === page.id ? ' aria-current="page"' : ''}${item.id === 'contact' ? ' class="nav-contact"' : ''}>${escape(item.label)}</a>`).join(''),
    };
    values.header = render(shared.header, values);
    values.footer = render(shared.footer, values);
    values.callToAction = render(shared['call-to-action'], values);
    values.content = render(read(`src/pages/${page.id}.html`), values);
    return [page.file, render(layout, values)];
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
  for (const [file, html] of rendered) writeFileSync(join(output, file), html);
  writeFileSync(join(output, 'tree.html'), rendered.find(([file]) => file === 'index.html')[1]);
  return output;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Built website: ${build()}`);
}
