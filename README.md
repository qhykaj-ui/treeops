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

## Repository settings (admin)

Settings → Pages → **Source: GitHub Actions**, custom domain **treeops.net**, **Enforce HTTPS** on.
