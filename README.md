# Craigieburn Trapping Alliance website

The Alliance's website, maintained as plain HTML, CSS and local image assets.
There is no JavaScript, framework, package installation or build step.

## Editing and previewing

- Edit `public/index.html` to change the page content and links.
- Edit `public/styles.css` to change the design and responsive layouts.
- Keep the photograph's attribution and the icon licence notices.

Open `public/index.html` directly in a browser, or use any static web server.
For example, if Python 3 is installed, run this from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Visit [localhost:8000](http://localhost:8000). Python is only an optional preview
tool, not a site dependency. Stop the server with Ctrl+C.

Before publishing, check the desktop and mobile layouts, navigation anchors,
external links, image loading and keyboard focus. The site works with JavaScript
disabled. Upload only `public/`, never the repository root.

## Current hosting

Configuration checked on 6 September 2026:

| Setting           | Current value                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Host              | Cloudflare Pages                                                                                                   |
| Pages project     | `craigieburn-trapping`                                                                                             |
| Deployment method | Direct Upload (manual deployment; no connected Git source)                                                         |
| Production branch | `main`                                                                                                             |
| Main domain       | [craigieburntrapping.nz](https://craigieburntrapping.nz)                                                           |
| Additional domain | [craigieburn.nz](https://craigieburn.nz)                                                                           |
| WWW domains       | [www.craigieburntrapping.nz](https://www.craigieburntrapping.nz), [www.craigieburn.nz](https://www.craigieburn.nz) |
| Pages hostname    | [craigieburn-trapping.pages.dev](https://craigieburn-trapping.pages.dev)                                           |

All four custom domains use the same Pages project with HTTPS.
GitHub stores the source; GitHub Pages is not used for hosting.

At the time of this conversion, the live deployment is the earlier Vinext static
export uploaded on 4 September 2026. Pushing this repository does **not** deploy
the converted site. A separate upload of `public/` is required to update production.

The Pages dashboard still contains the previous build settings:
`npm run build`, output `dist/client`, root `craigieburn-trapping-site`.
These describe the retired framework project and are not used for Direct Upload.
This repository has no build command; its ready-to-publish directory is `public`.

### Access protection

Cloudflare Access protects all four custom domains, the main Pages hostname and
`*.craigieburn-trapping.pages.dev` deployment hostnames. Approved people sign in
using emailed one-time PINs, with a 24-hour session.

Manage approved email addresses in Cloudflare Zero Trust, in the Access application
named **Craigieburn Trapping Alliance**. The allowlist and authentication settings
are intentionally not stored in this public repository. Access is enforced by
Cloudflare, not by JavaScript or a password in the HTML.

The repository and its website content are public even while the hosted website
requires sign-in. Do not put private material in the source or public assets.

### Publishing an update

1. Preview and review the files in `public/`.
2. In Cloudflare, open **Workers & Pages → craigieburn-trapping**.
3. Choose **Create a new deployment** and the production environment.
4. Upload the `public` folder, with `index.html` at the upload root, and deploy.
5. Confirm the deployment succeeds and check the main domain through Access.

Alternatively, with Node.js/npm available for the optional deployment tool:

```sh
npx wrangler login
npx wrangler pages deploy public --project-name=craigieburn-trapping --branch=main
```

These commands upload existing files; they do not build the website. Authenticate
through Cloudflare's login flow. Do not paste tokens into commands or source files.

See Cloudflare's [Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/).
Direct Upload projects cannot be switched to native Git integration in place.
Automatic deployment to the existing project could be added separately using CI
and secrets stored in the CI provider; no such automation is configured here.

Uploading to this existing project retains its domain and Access configuration.
Only CTA domains belong to this website's hosting setup. An email address on
another domain is an Access identity, not authorization to change that domain's DNS.

## Files

```text
public/
  index.html                  Website content and inline SVG icons
  styles.css                  Standalone styles, including mobile layouts
  404.html                    Missing-page response for Cloudflare Pages
  favicon.svg                 Site favicon
  craigieburn-range.webp       Hero photograph
  _headers                    Cache revalidation for stable asset filenames
  third-party-licenses.txt     Lucide and Feather icon licence notices
```

The original React/Vinext source, starter components, package manifests and build
configuration have been removed. The files in `public/` are the files to publish.

## Credentials and local files

The site needs no passwords, API keys, tokens or environment variables.
`.gitignore` excludes common credential files, environment files, local Cloudflare
state, logs, dependencies and old build outputs. Review staged changes before
pushing; ignore rules cannot detect a secret pasted into a public file.
Keep Access allowlists, downloaded account configuration and credentials outside
the repository and outside the folder uploaded to Pages.

## Asset licences

The hero image is a cropped and optimised version of
[Camp Saddle, Craigieburn Range, New Zealand 14](https://commons.wikimedia.org/wiki/File:Camp_Saddle,_Craigieburn_Range,_New_Zealand_14.jpg)
by Michal Klajban, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
The page retains visible attribution and a licence link.

The inline icons come from [Lucide](https://lucide.dev). Their ISC licence and the
MIT notice for icons inherited from Feather are included in
[`public/third-party-licenses.txt`](public/third-party-licenses.txt).
