# Craigieburn Trapping Alliance website

The Alliance's website, maintained as plain HTML, CSS and local image assets.
The pages need no framework or build step. The contact form uses a small JavaScript
file, Cloudflare Turnstile and a separate Cloudflare Worker in `contact-worker/`.

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
external links, image loading and keyboard focus. Website content remains available
with JavaScript disabled; the contact form requires JavaScript. File and local HTTP
previews deliberately disable form submission. Upload only `public/`, never the
repository root. Deploy the contact Worker separately as described below.

## Current hosting

### Cloudflare account transition

Status as of **15 September 2026**: both domains are active in `Cta@brittan.nz`
(account `dc873fa1bd89cf800aedb7e5b4e6cda5`). DNS, Pages, Access, Email Routing and
the contact Worker now run in this account. Committee members **Lou** and **DJ**
have access. All four Pages custom domains have completed certificate validation.

| Resource | Configuration |
| --- | --- |
| Pages project | `craigieburn-trapping` |
| Pages hostname | [craigieburn-trapping-7pd.pages.dev](https://craigieburn-trapping-7pd.pages.dev) |
| Production deployment | `c99b0987-f3fa-4c15-95f8-bb6256b69028` |
| `craigieburn.nz` zone | `0f3783ecb9304ea6a37374250212456f` |
| `craigieburntrapping.nz` zone | `ce728369a0598ae4a269204ce4982f6c` |
| Nameservers | `lorna.ns.cloudflare.com`, `major.ns.cloudflare.com` |
| Zero Trust team | `craigieburn-trapping.cloudflareaccess.com` |

The apex and WWW CNAMEs point to the new Pages hostname. Email Routing is ready
on `craigieburn.nz`; the original forwarding destination and `trapping@craigieburn.nz`
were verified in this account. Cloudflare reported the migration delivery test
successful with no queued messages or bounces. The contact Worker is enabled.

The old Pages project, domain associations, Access application and Worker remain
in `Cloudflare@brittan.nz` (`414d77685b8ac23bf8e62fe206b6e40e`) as rollback resources.
Automatic approval review rejected deleting the old domain associations; no old
resources were deleted. The local source targets the new account. Do not upload
it to the old project without restoring that account's contact endpoint, site key
and allowed hostname. The unrelated `brittan.nz` zone was not changed.

DNSSEC was re-enabled on both destination zones after transfer. Cloudflare still
reported activation pending at the final check; confirm it reaches **active**.

### Hosting configuration

Configuration updated on 18 September 2026:

| Setting           | Current value                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Host              | Cloudflare Pages                                                                                                   |
| Pages project     | `craigieburn-trapping`                                                                                             |
| Deployment method | Direct Upload (manual deployment; no connected Git source)                                                         |
| Production branch | `main`                                                                                                             |
| Main domain       | [craigieburn.nz](https://craigieburn.nz/)                                                           |
| Redirect domain   | [craigieburntrapping.nz](https://craigieburntrapping.nz/)                                                                           |
| WWW domains       | [www.craigieburntrapping.nz](https://www.craigieburntrapping.nz), [www.craigieburn.nz](https://www.craigieburn.nz) |
| Pages hostname    | [craigieburn-trapping-7pd.pages.dev](https://craigieburn-trapping-7pd.pages.dev)                                           |

All four custom domains use the same Pages project with HTTPS. The alternate
hostnames redirect permanently to `https://craigieburn.nz/`.
GitHub stores the source; GitHub Pages is not used for hosting.

Pushing this repository does **not** deploy the site. A separate upload of `public/`
is required to update production. The contact Worker has its own deployment;
changing one does not deploy the other.

The destination project is a Direct Upload project with no framework build.
Its ready-to-publish directory is `public`.

### Public website access

The website was made publicly accessible on 18 September 2026. All four custom
domains, the main Pages hostname and deployment hostnames serve the site without
sign-in. The preferred hostname returns HTTP 200; alternate custom hostnames
redirect to it. The main Pages hostname and deployment remain publicly accessible.

The Cloudflare Access application **Craigieburn Trapping Alliance**
(`8403d73d-9739-41b4-b4ec-6f082eed3603`) has an Everyone / Bypass policy named
**Public website — no sign-in required** (`4ce2ac29-8b2c-457f-b999-740d0a3ec6c3`).
This disables the visitor sign-in requirement. The previous approved-volunteer
policy remains available for rollback but does not restrict visitors while the
public bypass is enabled. To restore restricted access, remove the public bypass
policy and verify that unauthenticated requests redirect to sign-in.

The separate **CTA certificate validation** application
(`b95cf070-8639-4b6c-8fad-c76d0c3defe8`) still permits
`/.well-known/acme-challenge/*` on the four custom domains. It remains compatible
with public access and preserves certificate validation if sign-in is restored.

The repository and website content are public. Do not put private material in
source files or public assets. Contact-form Turnstile and rate limiting remain
in place; the public-access change does not alter Cloudflare account permissions.

### Preferred domain and search discovery

The preferred URL is **https://craigieburn.nz/**. Cloudflare Single Redirect rules
send `www.craigieburn.nz`, `craigieburntrapping.nz` and
`www.craigieburntrapping.nz` to that HTTPS hostname with HTTP 301, preserving paths
and query strings. HTTP requests to the preferred hostname also redirect to HTTPS.
The `/.well-known/acme-challenge/` prefix is excluded to preserve certificate validation.

The active rules have reference `cta_canonical_https_domain`:

- `craigieburn.nz`: ruleset `767f74707dec492b9730f8fc3e078872`, rule `33601bb7dd7046e6b2225dc0175aee99`.
- `craigieburntrapping.nz`: ruleset `7aab40da9cd641bb900ea5b905d28c2e`, rule `7f8f381ac86c491285d3927d25a6d04b`.

These rulesets still have their historical migration names. The old temporary
302 rules remain disabled; keep them disabled during normal updates. The active
301 rules are Cloudflare configuration, separate from a Pages deployment.

`public/index.html` has a canonical URL, a descriptive search title and description,
and JSON-LD `WebSite` and `Organization` data. The parent organisation is Canterbury
Environmental Trust; charity identifier CC25048 belongs to the Trust, not CTA.
The page body and design are unchanged. The HTML title also appears in browser tabs.
All copies served on Pages hostnames identify the same canonical URL.

`public/robots.txt` allows crawling and links to `public/sitemap.xml`. The sitemap
contains the homepage only; page-section anchors are not separate pages. Update
`lastmod` when the page meaningfully changes and add URLs if real pages are added.

Google Search Console and Bing Webmaster Tools verification/submission are still
pending. A committee-controlled account should verify the domain (using the DNS
TXT record supplied by the service), submit `https://craigieburn.nz/sitemap.xml`,
and request homepage indexing. These files alone do not register the site with
those services or guarantee indexing.

Open Graph and Twitter Card metadata provide the canonical homepage URL, site name,
search title and description, NZ English locale, and a large photo preview for
shared links. The preview reuses `public/trap-in-snow-steven-greig.webp` (2400 ×
1800, under 1 MB) and includes descriptive image alt text crediting Steven Greig.
The existing organisation data identifies the CTA logo. No new social account
handles are asserted, and the visible page and photograph are unchanged.

When changing the title, description or photo, keep the Open Graph and Twitter
metadata in `public/index.html` consistent. Update image dimensions and alt text
if the image changes. Sharing services decide how to crop and present the card and
may cache older previews. Use Facebook's Sharing Debugger to request a fresh scrape
if needed; published posts are not necessarily refreshed automatically.

### Publishing an update

1. Preview and review the files in `public/`.
2. In Cloudflare, select the account currently hosting the site
   (`Cta@brittan.nz`), then open
   **Workers & Pages → craigieburn-trapping**.
3. Choose **Create a new deployment** and the production environment.
4. Upload the `public` folder, with `index.html` at the upload root, and deploy.
5. Confirm the deployment succeeds and check the main domain without signing in.

Alternatively, with Node.js/npm available for the optional deployment tool:

```sh
npx wrangler login
CLOUDFLARE_ACCOUNT_ID=dc873fa1bd89cf800aedb7e5b4e6cda5 npx wrangler pages deploy public --project-name=craigieburn-trapping --branch=main
```

The current local Wrangler login only has access to the source account. Before
using these commands, sign in with a user authorised for `Cta@brittan.nz`. Setting
`CLOUDFLARE_ACCOUNT_ID` alone does not grant access. The initial copy was deployed
through the connected Cloudflare API using a project-scoped asset upload token.

These commands upload existing files; they do not build the website. Authenticate
through Cloudflare's login flow. Do not paste tokens into commands or source files.

See Cloudflare's [Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/).
Direct Upload projects cannot be switched to native Git integration in place.
Automatic deployment to the existing project could be added separately using CI
and secrets stored in the CI provider; no such automation is configured here.

Uploading to this existing project retains its domain configuration and public-access policy.
Only CTA domains belong to this website's hosting setup. An email address on
another domain is an Access identity, not authorization to change that domain's DNS.

## Volunteer Information

The Get involved section and Useful links both link to the shared
[Volunteer Information folder on OneDrive](https://1drv.ms/f/c/d8b52b20b6e79228/IgBdcbMIAF-lQ6hVYHKDtYmmAb1aRSOF4dqypV6iKbVljEo?e=ZitzLf).
The supplied link gives read-only access. The health and safety agreement is
already available; trap-line information and other volunteer resources will be added.

Manage the documents in OneDrive; adding or updating files in the same shared
folder does not require a website deployment. If the sharing link changes, update
both links in `public/index.html` and this README, then redeploy the site. The
folder is separate from Cloudflare and its link can stay the same when hosting
moves to the CTA account.

## Contact form (free Cloudflare setup)

Implemented on 10 September 2026 in the existing **Cloudflare@brittan.nz** account.
The website and Worker were deployed on that date. Pages production deployment:
`f1a839df.craigieburn-trapping.pages.dev`. The destination
**trapping@craigieburn.nz** is verified for Email Routing. The
address already forwards to the existing CTA inbox; that forwarding rule is
separate from the website form and must be retained during migration.

| Component | Current configuration |
| --- | --- |
| Account ID | `dc873fa1bd89cf800aedb7e5b4e6cda5` |
| Status | Enabled; `CONTACT_ENABLED=true`, Email Routing ready |
| Worker | `cta-contact` |
| Form endpoint | `https://cta-contact.cta-dc8.workers.dev/contact` |
| Recipient | Live: `trapping@craigieburn.nz`; prepared: `craigieburntrapping@gmail.com` (verification pending) |
| Sender | `website@craigieburn.nz` (the existing Email Routing domain) |
| Reply-To | The visitor's validated email address |
| Turnstile widget | `CTA contact form`, Managed mode |
| Public site key | `0x4AAAAAAE05wWUM7ZrfoQs1` |
| Turnstile action | `contact` |
| Secret | `TURNSTILE_SECRET_KEY`, stored only on the Worker |
| Rate-limit binding | `CONTACT_LIMIT`, namespace `2026091001`, 5 attempts/minute per IP per Cloudflare location |

### Enquiry recipient change (18 September 2026)

The requested new recipient is `craigieburntrapping@gmail.com`. Cloudflare sent
its verification email; activation is pending the recipient clicking that link.
The local Worker configuration and tests are prepared for the new recipient.
The live Worker still delivers to `trapping@craigieburn.nz` until verification
and deployment are complete, avoiding failed deliveries during the change.
Update both `CONTACT_TO` and the restricted `CONTACT_EMAIL.destination_address`
binding together. Preserve the Turnstile secret and all other Worker settings.
This change is only for website enquiries; the existing `trapping@craigieburn.nz`
email forwarding rule is separate.

### How it works and costs

Visitors enter their name, email and message. Turnstile loads when the form comes
into view. `public/contact.js` submits JSON to the Worker, which checks the exact
website origin, field lengths, request size (32 KiB), honeypot, rate limit and
Turnstile result, including the action and the hostname. Turnstile tokens are
single-use; every attempt requires a fresh valid token. The Worker sends only to
the configured recipient, with the visitor's address in Reply-To. It awaits the
email service before reporting success. Failed submissions retain the visitor's
text, and visitors see a confirmation on the page after a successful submission.

The form sends no automatic acknowledgement emails to visitors and stores no
messages in a database. Names, addresses, message contents and challenge tokens
are not written by the application to logs. Cloudflare processes the security
checks and email delivery; the resulting message is retained in the CTA inbox.
Logs record request outcomes and a generic delivery-failure event. Network timeouts
can leave delivery uncertain; the form preserves the message and warns before retry.
The IP-based rate limit is approximate and local to each Cloudflare location, so
people sharing a network may occasionally need to wait a minute.

As checked on 10 September 2026, this design uses:

- [Turnstile Free](https://developers.cloudflare.com/turnstile/plans/), with unlimited challenges.
- [Workers Free](https://developers.cloudflare.com/workers/platform/pricing/), with 100,000 requests/day shared across the account and a 10 ms CPU allowance per invocation.
- [Free delivery to verified destinations](https://developers.cloudflare.com/email-service/platform/pricing/).

Keep this Worker on the free plan; no paid upgrade, database, email subscription
or automatic email to arbitrary visitors is required. Domain renewal fees are
separate. Recheck provider pricing before changing the architecture. Free-plan
limits can cause failed requests rather than additional capacity. Do not replace
the destination with visitor-supplied data or enable automatic replies as part of
a routine update.

### Editing, checking and deploying

The static site still requires no installation or build. The optional Worker
maintenance tools are isolated in `contact-worker/` and pinned in its lockfile:

```sh
cd contact-worker
npm ci
npm test
npm run types
npm run check
npx wrangler deploy --dry-run
npm run deploy
```

Authenticate to the account named in `wrangler.jsonc` before deploying. Use
`npx wrangler secret put TURNSTILE_SECRET_KEY` to set or replace the secret; paste
it only into the CLI's hidden prompt, never into source or command arguments.
`secrets.required` declares the secret name for generated types. The compatibility
date is 9 September 2026, the UTC date accepted by Cloudflare at initial deployment.

Deploy `public/` separately using the Pages instructions above. The form endpoint
and public site key are in `public/index.html`. The exact frontend hostname list
is in `public/contact.js`; the server list is `ALLOWED_ORIGINS` in the Worker
configuration. The Turnstile widget allows the two CTA domains and
`craigieburn-trapping-7pd.pages.dev` (including their subdomains), while the Worker
accepts only the five explicitly configured website origins. Arbitrary preview
hosts, local servers and `file://` pages cannot send real submissions.

Unit tests stub the challenge service and email binding; they never send email.
Browser tests should also stub these services, or use an isolated development
Worker and Cloudflare's official test keys. Never put test keys or a verification
bypass in production. Test the live form through an allowed HTTPS hostname and
confirm delivery to the CTA inbox before treating it as fully checked. The site
is publicly accessible; Turnstile still protects the contact form. A deployment
alone does not verify that a human can complete the live challenge.

For a temporary shutdown, set `CONTACT_ENABLED` to `false` and redeploy the Worker;
submissions will fail closed with an unavailable message. Update the configuration
file as well as any dashboard changes so the next deployment preserves the setting.

### Initial verification

- Nine backend tests passed, including recipient restrictions, invalid origins,
  malformed/oversized requests, challenge failures, rate limiting and email failure.
- Worker type checking and deployment dry-run checks passed.
- Browser checks at 1440, 1024, 390 and 320 pixels found no horizontal overflow.
  Mocked submissions confirmed message preservation on failure and clearing on
  success. Local file previews keep the form disabled.
- The deployed Worker rejected an invalid Turnstile token without sending mail.
- Cloudflare's email API reported the setup test delivered to
  `trapping@craigieburn.nz`, with no queued messages or permanent bounces.
- A complete human submission through the live Turnstile challenge still needs
  to be checked by a website visitor; automated UI tests used stubs.

### Migration verification and rollback

The account migration has completed for the website and email configuration:

- Both destination zones and all four Pages custom domains are active.
- Migration initially preserved sign-in protection. Public access was enabled
  on 18 September 2026; all current website hostnames now serve without sign-in.
- Email Routing is ready. The migration test sent from `website@craigieburn.nz`
  was reported delivered to `trapping@craigieburn.nz`, with no queue or bounce.
- The contact Worker is enabled with its restricted email binding, Turnstile
  secret and rate limit. A deployed invalid submission returned HTTP 400; the
  nine backend tests passed during migration preparation.
- A complete human submission through the live Turnstile challenge remains a
  manual check. The email delivery test is not an end-to-end browser form test.
- DNSSEC activation was requested and is awaiting confirmation of active status.

The old website resources are retained for rollback and should not be used for
new deployments. Retirement can be performed separately after the new site and
inbox have been used successfully. The new Turnstile secret is stored only on the
new Worker, never in this repository.

## Files

```text
public/
  index.html                  Website content and inline SVG icons
  styles.css                  Standalone styles, including mobile layouts
  contact.js                  Contact form and on-demand Turnstile integration
  robots.txt                  Crawler access and sitemap location
  sitemap.xml                 Canonical page URLs for search discovery
  404.html                    Missing-page response for Cloudflare Pages
  favicon.svg                 Site favicon
  cta-logo.webp               Refined Alliance logo used in the header and footer
  cta-nz-location.svg          Compact green NZ locator above the hero photo credit
  trap-in-snow-steven-greig.webp  Hero photograph, © Steven Greig
  _headers                    Cache revalidation for stable asset filenames
  third-party-licenses.txt     Lucide and Feather icon licence notices
```

The files in `public/` are the files to publish.

The header and footer use an optimised 320-pixel web copy of the refined logo.
The original extraction and AI-refined PNG/SVG artwork are kept in
`output/branding/`; the refined version adjusts the circular lettering and also
differs in some fine bird detail. To update the website logo, replace
`public/cta-logo.webp` while keeping its square proportions and transparent exterior.

## Credentials and local files

The public website contains no secrets. The contact Worker needs a private
`TURNSTILE_SECRET_KEY`, stored as a Cloudflare Worker secret, plus the non-secret
settings in `contact-worker/wrangler.jsonc`. Never put the secret in `public/`.
`.gitignore` excludes common credential files, environment files, local Cloudflare
state, logs, dependencies and old build outputs. Review staged changes before
pushing; ignore rules cannot detect a secret pasted into a public file.
Keep Access allowlists, downloaded account configuration and credentials outside
the repository and outside the folder uploaded to Pages.

## Asset licences

The hero photograph, `public/trap-in-snow-steven-greig.webp`, is © Steven Greig.
It was supplied for this website as `trap_in_snow_Steven_Greig.JPG` and optimised
for web delivery. Keep the visible copyright credit; no Creative Commons licence
is granted for this photograph.

The NZ location map uses public-domain Natural Earth 1:50m coastline data. Its
marker is an approximate locator for the Castle Hill Basin, not a trap location or
project boundary. Source details and editable artwork are in `output/maps/`.

The inline icons come from [Lucide](https://lucide.dev). Their ISC licence and the
MIT notice for icons inherited from Feather are included in
[`public/third-party-licenses.txt`](public/third-party-licenses.txt).
