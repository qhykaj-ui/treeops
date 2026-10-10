# Development and deployment

## Local development

Serve the repository root through HTTP:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. There is no dependency installation or build step. Reload the browser after editing files; the development server does not provide hot reloading.

## Editing conventions

### Company content

Update the appropriate HTML page. Keep the homepage brief and put supporting detail on the dedicated pages. Use business language and concrete examples; avoid adding unsupported claims or speculative outcomes.

Use the existing heading hierarchy and preserve a single H1 per document. Give informative images meaningful alternative text and decorative images empty alternative text. Keep service contact links pointed at the published company email address.

### Shared page shell

Header and footer markup is duplicated. Apply navigation, shared metadata, font, and stylesheet changes to all root HTML documents. Mark only the current page in the main navigation with `aria-current="page"`.

After editing the homepage, synchronise the compatibility entry point:

```sh
cp index.html tree.html
```

### Adding a page

1. Copy the shared document shell from an existing page.
2. Set a unique title, description, canonical URL, Open Graph metadata, and H1.
3. Add the page to navigation across all documents, setting its active state only on that page.
4. Link to it from the appropriate homepage card or related content.
5. Check direct loading, refresh, Back, mobile navigation, and keyboard use.

Use ordinary `.html` links. There is no JavaScript router or route configuration to update.

### Styles

Consult the stylesheet order in [Architecture](architecture.md#presentation-layers). Put active theme changes in `navy-mint.css`, hero-specific rules in `technology-tree.css`, and dedicated-page layout changes in `pages.css`. Prefer existing tokens over additional fixed colors.

Avoid adding another override layer for a routine change. Review desktop and mobile layouts when changing shared selectors.

### Projects

Add or edit project articles in `work.html`. Use the existing `data-type` category values: `research`, `government`, or `enterprise`. Update the filter labels and initial project count when the catalogue changes. The script derives the rendered count and pagination from matching articles.

### Assets

Keep site assets inside `assets/` and reference them with relative URLs. Preserve image aspect ratios and appropriate dimensions. Optimise large raster assets before release and inspect the result visually. Keep third-party license files and asset provenance with the repository.

## Verification

Run lightweight source checks:

```sh
node --check assets/js/main.js
cmp index.html tree.html
git diff --check
```

Node.js is needed for the syntax check; it is not a runtime dependency of the deployed site. There is currently no configured automated test runner, CI workflow, or build validation pipeline.

Check the affected pages in a browser:

- Navigation: each page opens directly, refreshes correctly, and highlights the correct menu item; logo, Home, breadcrumbs, and footer links resolve.
- Responsive layout: test a wide desktop and narrow phone viewport; verify readable content, no horizontal overflow, and usable navigation.
- Keyboard access: Tab order, focus indicators, skip link, mobile menu, Escape, and FAQ controls.
- Work: all categories, first/last page boundaries, visible project counts, and no missing records.
- Contact: email destination and subject, clipboard success or fallback message.
- Content: titles, heading hierarchy, images, local asset paths, and internal anchors.

For shared script changes, also disable JavaScript temporarily and verify that navigation, content, native disclosures, and email links remain usable.

## Deployment

### Publishable files

Deploy all root `.html` files and the full `assets/` directory. Keep the supplied license notice with the distribution. Documentation can remain in the repository; Git metadata, local previews, and credentials must not be included in a public artifact.

No environment variables, database provisioning, package install, or build command are needed.

### Hosting configuration

Configure the static host to:

- Serve `index.html` as the default document.
- Serve `services.html`, `team.html`, `work.html`, `faq.html`, `contact.html`, and `tree.html` directly.
- Use HTTPS and suitable MIME types for HTML, CSS, JavaScript, SVG, and raster images.
- Return an actual not-found response for unknown paths rather than silently serving the homepage.
- Revalidate HTML and unversioned assets so a deployment does not leave visitors with mismatched files.

The repository does not currently define hosting configuration, DNS records, cache headers, or deployment automation. Set these in the chosen hosting platform. Update canonical and social URLs consistently if the production domain changes.

### Release procedure

1. Review the diff and run the relevant verification checks.
2. Commit the intended source changes on a feature branch and review them through a pull request.
3. Publish one coherent revision, including all of its HTML and referenced assets.
4. Verify the homepage, a directly loaded inner page, navigation, and contact on the deployed URL.
5. If a regression appears, redeploy the last known-good revision. Preserve shared history with a revert commit when rolling back source changes.

Do not treat a local preview or a pushed Git branch as proof of a production deployment.
