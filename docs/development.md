# Development and deployment

## Local workflow

Use Node.js 20+ and Python 3. No package installation is needed because the build and tests use Node built-ins.

```sh
npm run check
npm run preview
```

Preview at `http://127.0.0.1:4174/`. Edit source, run `npm run build`, then refresh. There is no automatic rebuild or hot reload. Never edit `dist/`; the next build replaces it.

## Where to make changes

| Change | Location |
| --- | --- |
| Company name, email, domain, SEO metadata or navigation labels | `src/data/site.json` |
| Shared document head and asset loading | `src/layouts/base.html` |
| Header, footer or shared contact invitation | `src/partials/` |
| Services, biographies, project descriptions or FAQ | Corresponding file in `src/pages/` |
| Theme colors | `src/styles/theme.css` |
| Hero presentation | `src/styles/hero.css` |
| Components and page layouts | `src/styles/components.css` and `src/styles/pages.css` |
| Browser interactions | Corresponding module in `src/scripts/features/` |
| Images and vendor assets | `public/assets/` |

Keep the homepage brief; put supporting details on dedicated pages. Use one H1 and one main landmark per page. Use `{{email}}` for company email references and `{{callToAction}}` for the shared contact section. Unknown template variables fail the build.

## Adding a page

1. Create `src/pages/<id>.html` containing its main content, without a repeated document head, navigation, or footer.
2. Register its unique `id`, navigation `label`, clean `url`, legacy `file`, `title`, and `description` in `src/data/site.json`. Use `/name/` for the URL and `name.html` for its legacy alias. Add any new legacy alias to `legacy-links.js`. The build writes `name/index.html`.
3. Add contextual links from related content. The shared navigation is generated automatically.
4. Run `npm run check`, then review direct loading, active navigation, keyboard use, and mobile layout.

The Home compatibility file `tree.html` is generated automatically; do not maintain a second source homepage.

## Adding browser behavior

Create a focused module in `src/scripts/features/` exporting an initializer. Return early if the relevant page controls are absent, keep state inside the initializer, and import it from `main.js`. Use native browser controls when possible. Content and navigation should remain available without JavaScript.

Project articles use `data-type="research"`, `government`, or `enterprise`. The module derives category totals and pagination from these records. Update the initial HTML count and the expected catalogue totals in the integrity test when approved records change.

## Assets and styles

Use root-relative public URLs such as `/assets/images/example.jpg` in page templates. In CSS, images are referenced from the emitted `assets/css/` directory. Preserve image dimensions, meaningful alternative text, and third-party notices. Consult the fixed cascade order in [Architecture](architecture.md#presentation-layers).

## Verification

```sh
npm run check
git diff --check
```

Tests check the generated site rather than source fragments. CI runs the same validation on pull requests and pushes to `main` and uploads `dist/` as `treeops-website`.

Before release, check affected pages in a browser:

- Direct navigation, reload, Back, active menu state, breadcrumbs and contact links.
- Desktop and mobile layouts, horizontal overflow, readable text and image loading.
- Keyboard focus, skip link, menu toggle, Escape and FAQ disclosures.
- Project categories, counts and pagination boundaries.
- Clipboard success or fallback and email destination.
- Content and navigation with JavaScript disabled when changing shared behavior.

Automated structural checks do not certify accessibility or substitute for visual review.

## Deployment

**Migration requirement:** configure the hosting build command as `npm run build` and the publish directory as `dist`. Serving the repository root no longer serves the website.

For a manual deployment, run `npm run check`, then upload the contents of `dist/`, including assets and license notices. There are no runtime environment variables or package dependencies. Navigation uses clean directory URLs; older `.html` links remain supported. The build also generates `404.html`, `sitemap.xml` (canonical page URLs from the page registry) and `robots.txt`.

Configure the host to serve `index.html` by default, serve directory index files for clean URLs and keep legacy `.html` documents accessible, return real 404 responses for unknown URLs using the generated `404.html`, and provide HTTPS. Use suitable MIME types for JavaScript modules and styles. Revalidate unversioned assets after deployment.

The GitHub workflow validates pull requests. A push or merge to `main` runs validation, uploads `dist/` as a Pages artifact, and deploys it only after validation succeeds. Deployments are serialized. Only the deployment job receives `pages: write` and `id-token: write`; no personal access token is stored in the workflow.

In repository Settings → Pages, use **GitHub Actions** as the source and retain `treeops.net` with HTTPS enforced. The `github-pages` environment must allow the `main` branch. DNS remains unchanged. Review the Actions deployment result and the live URLs; a local build or feature-branch push alone does not prove production deployment.

Release through a reviewed feature branch, publish one complete revision, then verify Home and a directly loaded inner page on the production URL. Roll back by redeploying a known-good artifact and reverting source changes when appropriate.
