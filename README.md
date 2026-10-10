# Tree Operation website

A static Bootstrap website with a deep navy background, slate cards, mint accents and a subdued technology-tree hero image. The original logo and founder portraits are retained.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173.

## Pages

- `index.html`: short homepage linking to each section.
- `services.html`: software development, cybersecurity, AI and automation, with expandable examples and benefits.
- `team.html`: founder profiles and LinkedIn links.
- `work.html`: nine projects with filters, pagination and expandable details.
- `faq.html`: common questions and answers.
- `contact.html`: email contact and copy-address action.
- `tree.html`: identical alternate homepage; keep it in sync with `index.html`.

Each page includes navigation, its own title and metadata, and the Tree Operation copyright. Shared presentation lives in `assets/css/`; interactive behavior lives in `assets/js/main.js`. Header and footer HTML is repeated across pages; update all seven files when changing shared navigation or footer content.

No build step is required. Deploy all HTML files and the `assets/` directory together. Fonts use Google Fonts with system fallbacks. Contact opens the visitor’s email application; no form backend is required. Navigation and disclosure controls work without JavaScript, and all projects remain readable without it. Legacy homepage section bookmarks redirect to the corresponding pages when JavaScript is available.

## Branch

`rrezartprebreza/ui-change` contains the current design. Previous preview branches were consolidated into this branch, retaining their commits in its history.

## Assets

The HighTechIT template is by HTML Codex; its supplied license is in `licenses/HighTechIT-LICENSE.txt`. The technology-tree image was created with the built-in image generation tool; its prompt is saved beside the asset. The original Tree Operation logo and founder portraits are unchanged.

## Verification

Checked all six pages via mobile navigation, desktop navigation, active menu states, service disclosures, project filtering and pagination, FAQ expansion, and copying the contact email. No horizontal overflow at tested widths. All seven HTML documents have one H1, unique IDs, and resolving local links, assets and fragments. JavaScript syntax checked.
