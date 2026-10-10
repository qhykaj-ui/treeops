# Tree Operation website

Static Bootstrap website adapted from the supplied HighTechIT v1.0.0 template. The existing Tree Operation logo, founders, content sections, project filters, FAQs and email contact flow are retained.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173.

## Files

- `index.html`: primary page.
- `tree.html`: identical alternate entry point; keep both pages in sync.
- `assets/css/base.css`: existing component structure.
- `assets/css/treeops.css`: forest green, ivory and gold theme and responsive Bootstrap adaptation.
- `assets/vendor/bootstrap.min.css`: Bootstrap stylesheet supplied with HighTechIT.
- `assets/js/main.js`: project filters, section navigation, mobile menu and clipboard action.
- `assets/images`: original logo and founder portraits, plus the template hero photograph.

No build step is required. Deploy both HTML files together with the `assets/` directory. Fonts use Google Fonts with local system fallbacks. Contact opens the visitor's email application; there is no contact-form backend.

## Attribution

The HighTechIT template is by HTML Codex. Its attribution link is preserved in the footer; the supplied license is in `licenses/HighTechIT-LICENSE.txt`. The original Tree Operation brand and portraits remain unchanged.

## Verification

Checked desktop (1440 px) and mobile (390 px and 320 px) layouts, asset loading, all four project filters (9/2/5/2), FAQ expansion, mobile menu toggle and Escape, and copying the contact email. Both HTML entry points match and existing section IDs are retained.
