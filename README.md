# Tree Operation website

Static Bootstrap website adapted from the supplied HighTechIT v1.0.0 template. The existing Tree Operation logo, founders, nine projects and email contact flow are retained, with concise copy and click-to-explore sections. Programming-language and technology lists have been removed.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173.

## Files

- `index.html`: primary page.
- `tree.html`: identical alternate entry point; keep both pages in sync.
- `assets/css/base.css`: existing component structure.
- `assets/css/treeops.css`: forest green, ivory and gold theme and responsive Bootstrap adaptation.
- `assets/vendor/bootstrap.min.css`: Bootstrap stylesheet supplied with HighTechIT.
- `assets/js/main.js`: accessible section tabs, project filters and pagination, mobile menu and clipboard action.
- `assets/images`: original logo and founder portraits, a decorative branching SVG for the navy preview, and the template photograph retained for the forest design.

No build step is required. Deploy both HTML files together with the `assets/` directory. Fonts use Google Fonts with local system fallbacks. Contact opens the visitor's email application; there is no contact-form backend.

## Attribution

The HighTechIT template is by HTML Codex. The supplied license is in `licenses/HighTechIT-LICENSE.txt`. The original Tree Operation brand and portraits remain unchanged.

## Verification

Checked desktop (1440 px) and mobile (390 px and 320 px) layouts, asset loading, section switching and keyboard navigation, project filters and three-project pagination, expandable project details and FAQs, mobile navigation, and direct section links. Both HTML entry points match. Without JavaScript, sections and all projects remain available in the document. Existing section anchors resolve to the appropriate panel.

## Navy and mint comparison

Branch `codex/navy-mint-preview` keeps the compact layout and applies the original navy (`#0e1726`) and mint (`#4fd1a5`) palette through `assets/css/navy-mint.css`. The forest version remains on `codex/bootstrap-forest-redesign`.

Service cards include optional “Learn more” sections with practical examples, benefits and service-specific email enquiry links. The Home link returns to the introduction. Verified disclosure toggling with mouse and keyboard, mobile menu navigation, and Home active state.
