# Treeops website

Source for [treeops.net](https://treeops.net/), a one-page static website. It has no build step and no dependencies.

## How to change the website

1. Create a branch and edit `index.html`. Keep the file name lowercase: GitHub Pages does not serve `Index.html`.
2. Open a pull request. GitHub Actions checks the page: missing sections, broken links, the domain file.
3. Merge into `main`. The **Deploy website** workflow publishes the site to treeops.net within a minute or two.

To check a change locally, open `index.html` in a browser.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The website |
| `404.html` | Page-not-found screen; sends links from the old multi-page site (`/services/`, `/team/`, `/contact/` …) to the matching section |
| `CNAME` | Connects the site to `treeops.net`; do not delete |
| `robots.txt`, `sitemap.xml` | Search-engine files |
| `.github/workflows/deploy.yml` | Checks pull requests and deploys `main` to GitHub Pages |
| `.github/scripts/check-site.mjs` | The checks run before every deploy |
| `.github/scripts/check-external.mjs` | Warns when an external logo stops loading (does not block a deploy) |

## Contact form

The form posts to [FormSubmit](https://formsubmit.co/), which emails each request to `info@treeops.net`. No account or API key is needed.

- **One-time activation:** after the first request, FormSubmit sends an activation email to `info@treeops.net`. Click the link in it once. Until then, the form falls back to opening the visitor's email app, so no request is lost.
- A hidden field filters out simple spam bots.
- To use another address, change `FORM_ENDPOINT` in the script at the bottom of `index.html`.

## Client reviews

Add real quotes to the `REVIEWS` list near the bottom of `index.html`. The Reviews section and its menu link appear automatically once the list has at least one entry.

## Technology logos

Logos come from `cdn.simpleicons.org`. Brands the service no longer offers (Microsoft, AWS, Salesforce, Slack, OpenAI and several security vendors) use a simple line icon for their category instead.

## Repository settings (admin)

Settings → Pages → **Source: GitHub Actions**, custom domain **treeops.net**, **Enforce HTTPS** on.
