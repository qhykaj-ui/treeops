# Website architecture

## Scope

The Tree Operation website is a public company site. It supports service discovery, company evaluation, and email enquiries. It is not a customer portal, operational application, or content management system.

The current implementation has no backend, authentication, database, API integration, analytics script, or persistent browser storage. Its only external font dependency is Google Fonts. Links to LinkedIn and email are ordinary outbound links, not embedded integrations.

## Architectural approach

The website uses a static multi-page architecture. Each URL returns a complete HTML document containing its own content, navigation, metadata, and footer. A static server serves the files without application logic.

This is appropriate for the current content-led scope: pages can load directly, links work without a JavaScript router, and hosting has few operational dependencies. The tradeoff is duplicated page-shell markup, which requires coordinated edits across documents.

### Responsibility boundaries

| Layer | Responsibility | Location |
| --- | --- | --- |
| Content and semantics | Headings, service descriptions, profiles, project records, links, metadata | Root HTML files |
| Layout and visual system | Responsive layout, spacing, typography, colors, imagery | `assets/css/` |
| Behaviour | Mobile menu, project filtering and paging, email copy, old bookmark redirects | `assets/js/main.js` |
| Static resources | Logo, portraits, hero imagery, bundled framework stylesheet | `assets/images/`, `assets/vendor/` |
| Hosting | File delivery, TLS, HTTP headers, cache rules, redirects | Configured outside this repository |

## Navigation and page lifecycle

1. A visitor requests an HTML page.
2. The browser loads shared styles and the page’s referenced assets.
3. The deferred `main.js` script adds interactions to the existing document.
4. Navigation links request another HTML document through normal browser navigation.

Each page declares its active menu entry using `aria-current="page"`. Titles, descriptions, canonical URLs, and Open Graph metadata are stored in the page head. The canonical domain is `https://treeops.net/`.

`tree.html` duplicates `index.html` for compatibility. Both must be updated together. Old homepage fragments such as `#models`, `#team`, and `#work` are mapped to their corresponding pages by JavaScript using `location.replace()`. They are compatibility redirects, not a client-side router; they do not run when JavaScript is disabled.

## Presentation layers

All pages load styles in this order. Later layers intentionally override earlier declarations.

| Order | Stylesheet | Responsibility |
| --- | --- | --- |
| 1 | `assets/vendor/bootstrap.min.css` | Framework reset, grid, utilities |
| 2 | `assets/css/base.css` | Foundational component styles |
| 3 | `assets/css/treeops.css` | Shared branded layouts and components |
| 4 | `assets/css/navy-mint.css` | Active dark theme and color overrides |
| 5 | `assets/css/technology-tree.css` | Decorative homepage hero treatment |
| 6 | `assets/css/pages.css` | Dedicated-page layouts and content sections |

Theme tokens are defined for `:root[data-theme="dark"]` in `navy-mint.css`. Some earlier layers still contain fixed colors and older component definitions. This is a layered implementation, not a fully consolidated component library; changing load order can change the appearance.

The hero tree is a CSS background. Text remains real HTML and does not depend on the image loading. Logo and founder portraits are regular image elements.

## Browser behaviour

### Mobile navigation

The script reveals a menu button on smaller screens. It toggles the navigation’s open class and `aria-expanded`, closes after link activation, and supports Escape. Without JavaScript the button stays hidden and navigation links remain available. The script expects the shared navigation markup on every page.

### Project catalogue

Project content lives in `work.html` as articles with `data-type` attributes. The script keeps the selected category and page number in memory, renders three matching projects per page, and updates the count and pagination controls. Changing a filter resets pagination to the first page.

No network request is involved. Reloading resets the selection. Without JavaScript, all project articles are visible and filtering/paging controls remain hidden. Category totals in filter labels are maintained in HTML and must be updated when projects change.

### Contact

Email links use `mailto:` and launch the visitor’s configured email application. They do not send mail automatically. The copy-address button uses the Clipboard API; if copying fails, an accessible status message provides the address for manual copying. Clipboard access depends on browser permissions and a secure context, normally HTTPS or localhost.

### Disclosures

FAQ answers use native HTML `details`/`summary` controls. Their expand/collapse behaviour does not require JavaScript. Service descriptions and project context are visible directly on their dedicated pages.

## Content ownership

Company facts, service claims, biographies, and project references are maintained in HTML. There is no CMS or separate content database. Keep claims grounded in information approved by the company; do not add certifications, results, customer endorsements, or contractual guarantees without a source.

Shared header, footer, fonts, and metadata conventions are repeated across all seven HTML files. This is the main maintenance constraint. For a larger site, a build-time templating system could remove that duplication while preserving static delivery. Such a system is not currently implemented.

## Accessibility and resilience

The implementation includes a skip link, semantic page landmarks, one primary heading per page, visible focus styles, labelled navigation, reduced-motion handling, and status announcements for interactive counts and clipboard feedback. Native links preserve browser navigation and keyboard behaviour.

These provisions are implementation details, not a claim of certified accessibility compliance. Review keyboard behaviour, contrast, zoom, and responsive layouts as part of each relevant change.

## Operational boundaries

- No secrets or environment variables are required by the application.
- Static assets and page source are public once deployed.
- The local Python server is for development; production TLS, compression, headers, and caching are host responsibilities.
- Asset filenames are not content-hashed. Long immutable cache policies can serve stale styles or images after release.
- All page URLs must resolve independently; an SPA catch-all can hide missing files and break metadata.

## Maintenance priorities

If the site grows, first introduce shared page templates and consolidate overlapping styles. Next add automated checks for local links, duplicate IDs, metadata, and browser behaviour. Introduce server-side functionality only when a concrete feature requires it, such as a submitted contact form with delivery and abuse controls.
