# Website architecture

## Approach

Tree Operation is a content-led company website. It uses static multi-page delivery with build-time template composition and progressive enhancement. Each public URL returns a complete document. There is no client-side router, backend, database, authentication, or content API.

This keeps deployment simple while removing duplicated document shells. A small Node.js builder uses built-in APIs; the browser does not need Node.js or a framework runtime.

## Boundaries and patterns

| Boundary | Owner | Responsibility |
| --- | --- | --- |
| Configuration | `src/data/site.json` | Company contact, canonical domain, structured data, page registry and metadata |
| Document layout | `src/layouts/base.html` | Head, asset references, shared landmarks and composition slots |
| Shared components | `src/partials/` | Header, footer and contact call to action |
| Page content | `src/pages/` | One main landmark per page, headings, service descriptions, people and projects |
| Presentation | `src/styles/` | Responsive layout, components and visual theme |
| Browser features | `src/scripts/features/` | Isolated interaction initializers with local state |
| Composition entry point | `src/scripts/main.js` | Imports and initializes browser features |
| Static resources | `public/assets/` | Logo, portraits, decorative imagery and Bootstrap CSS |
| Build orchestration | `scripts/build.mjs` | Compose documents, combine styles, copy assets and generate compatibility page |
| Validation | `tests/build.test.mjs` | Verify the generated delivery artifact |

The principal patterns are **separation of concerns**, **template composition**, a **single configuration source**, and **feature modules**. Each feature checks whether its page controls exist before initializing. Project filter and pagination state stays inside its initializer; modules do not share mutable application state.

These boundaries are intentionally small. Adding repositories, service containers, or a client-side routing framework would add indirection without serving the current site.

## Build and rendering contract

The builder reads page metadata, generates the navigation with the correct `aria-current`, renders shared partials, inserts page content, and wraps it in the base layout. Placeholders use `{{name}}`; an unknown placeholder fails the build. Templates are trusted repository source, not user-submitted input. Metadata is HTML-escaped and structured JSON escapes `<` before embedding.

Output is disposable and regenerated in `dist/`. Public assets and third-party notices are copied there. `tree.html` is generated from Home so it cannot drift from `index.html`. Source templates, tests, Git metadata, and development tools are not deployment files.

The build is synchronous and dependency-free. If template needs grow to conditionals, loops, or content localization, adopt an established static-site template engine rather than extending a custom language.

## Page lifecycle

A visitor loads a complete HTML document, shared CSS, and a native JavaScript module entry point. Normal links navigate to another document. Titles, descriptions, canonical URLs, social metadata, and active menu entries are generated from the registry.

Pages are emitted as directory indexes, so clean paths work on GitHub Pages without rewrites. Links and assets use root-relative URLs for the custom-domain deployment. Canonical and Open Graph URLs use the clean paths. Old `.html` URLs and homepage fragments are redirected by `legacy-links.js` using `location.replace()`. Redirects preserve query strings and relevant anchors. Legacy files retain complete page content without JavaScript. This compatibility redirect behavior requires JavaScript; it is not a page router. FAQ disclosures use native `details` elements.

The project catalogue remains semantic HTML in `src/pages/work.html`. Its feature module derives filter counts from articles, shows three matching projects per page, and resets pagination when the category changes. Without JavaScript, all articles remain available and enhancement controls stay hidden.

The mobile menu maintains `aria-expanded`, handles Escape, and closes on navigation. Clipboard copying announces success or supplies the address for manual copying on failure. Email links use `mailto:`; the website does not send or store enquiries.

## Presentation layers

Bootstrap CSS loads first. The builder concatenates custom styles in this fixed order into `assets/css/site.css`:

1. `base.css`: foundational styles.
2. `components.css`: branded shared layouts and components.
3. `theme.css`: active warm white and forest green theme.
4. `hero.css`: decorative technology-tree treatment.
5. `pages.css`: inner-page layouts.

This preserves the existing cascade and appearance. Some older declarations still overlap; this refactor organizes their responsibility without claiming a complete CSS redesign. Edit the owning layer rather than adding another override file. Image paths remain relative to the emitted CSS location.

## Operations and quality

Automated tests build into a temporary directory and check page structure, metadata, references, module imports, catalogue records, template failures, compatibility output, and deterministic output. CI runs the checks and creates a deployment artifact. On pushes to `main`, a dependent job publishes that same tested artifact to GitHub Pages. Pull requests cannot deploy; write permissions are limited to the deployment job. Responsive behavior, keyboard navigation, and visual appearance still require browser review.

Production hosting must publish `dist/`, serve directory indexes and legacy `.html` aliases, and provide HTTPS and appropriate MIME types. Assets are not fingerprinted, so use revalidation rather than permanent immutable caching. Google Fonts is an external dependency with system fallbacks. No secrets or environment variables are required.

Company claims and project descriptions remain editorial content approved by the company. Architecture changes should not invent business claims or alter them silently.
