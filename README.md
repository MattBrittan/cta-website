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

Status as of 10 September 2026: the Alliance's dedicated Cloudflare account,
`Cta@brittan.nz`, has been set up. Two committee members, **Lou** and **DJ**, have
been granted access to this account.

The domains and website hosting remain in `Cloudflare@brittan.nz` pending their
planned move to `Cta@brittan.nz` in the week beginning **14 September 2026**.
The domain move is waiting for the 10-day restriction following registration
to expire. The hosting move is also planned for that week; the migration is
not yet complete.

Until the migration is complete, manage the live site in the existing account.
After the move, update the hosting details and publishing instructions below
to match the new account's Pages project and confirm the domain and Cloudflare
Access configuration.

### Existing hosting configuration

Configuration checked on 6 September 2026 (before the account migration):

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

Pushing this repository does **not** deploy the site. A separate upload of `public/`
is required to update production. The contact Worker has its own deployment;
changing one does not deploy the other.

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
2. In Cloudflare, select the account currently hosting the site
   (`Cloudflare@brittan.nz` until the migration is complete), then open
   **Workers & Pages → craigieburn-trapping**.
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
| Account ID | `414d77685b8ac23bf8e62fe206b6e40e` |
| Worker | `cta-contact` |
| Form endpoint | `https://cta-contact.withered-sun-ed37.workers.dev/contact` |
| Recipient | `trapping@craigieburn.nz` |
| Sender | `website@craigieburn.nz` (the existing Email Routing domain) |
| Reply-To | The visitor's validated email address |
| Turnstile widget | `CTA contact form`, Managed mode |
| Public site key | `0x4AAAAAAEuZowmS-557wDa9` |
| Turnstile action | `contact` |
| Secret | `TURNSTILE_SECRET_KEY`, stored only on the Worker |
| Rate-limit binding | `CONTACT_LIMIT`, namespace `2026091001`, 5 attempts/minute per IP per Cloudflare location |

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
`craigieburn-trapping.pages.dev` (including their subdomains), while the Worker
accepts only the five explicitly configured website origins. Arbitrary preview
hosts, local servers and `file://` pages cannot send real submissions.

Unit tests stub the challenge service and email binding; they never send email.
Browser tests should also stub these services, or use an isolated development
Worker and Cloudflare's official test keys. Never put test keys or a verification
bypass in production. Test the live form through an allowed HTTPS hostname and
confirm delivery to the CTA inbox before treating it as fully checked. The existing
Cloudflare Access sign-in remains in place. A deployment alone does not verify
that a human can complete the live challenge.

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
  to be checked by a signed-in website visitor; automated UI tests used stubs.

### Moving the form to Cta@brittan.nz

The new account ID is `dc873fa1bd89cf800aedb7e5b4e6cda5`. Moving the domains and
Pages project does **not** automatically move the Worker, verified destinations,
Turnstile widget, secrets or Email Routing rules.

1. In the new account, recreate the existing forwarding rule for
   `trapping@craigieburn.nz` and verify its underlying destination. Coordinate Email
   Routing/DNS changes with the domain move so incoming mail continues to work.
   Verify `trapping@craigieburn.nz` itself as a destination for free form delivery.
2. Ensure `craigieburn.nz` is ready for Email Routing in the new account so
   `website@craigieburn.nz` can be the form sender. Preserve all unrelated DNS and
   mail settings; do not enable routing on top of another provider's MX records.
3. Create a new Managed Turnstile widget for the production domains and the new
   Pages hostname. Copy its **public site key** to `public/index.html` and store
   its **secret key** as `TURNSTILE_SECRET_KEY` on the new Worker.
4. Change `account_id` in `contact-worker/wrangler.jsonc`. Recreate the Worker with
   the restricted `CONTACT_EMAIL` binding and the `CONTACT_LIMIT` rate-limit
   binding. Choose an unused numeric rate-limit namespace in the new account if
   `2026091001` already belongs to another application. Deploy on Workers Free.
5. Replace the form's `action` URL in `public/index.html` with the new Worker URL.
   Update the frontend host list, `ALLOWED_ORIGINS`, and Turnstile hostnames if the
   Pages hostname changes. Regenerate types and rerun tests and the dry run.
6. Deploy the static site to the new Pages project. Preserve/recreate the existing
   Cloudflare Access protection. Test the contact form on both CTA domains and
   their WWW hostnames, checking successful delivery, Reply-To, error handling and
   mobile layout. Check the destination inbox as well as the on-screen result.
7. Once the new setup works, disable the old form Worker, remove the old widget
   and secret when no longer needed, and update this README's configuration table.
   Keep the previous deployment available for rollback until cutover is confirmed.

## Files

```text
public/
  index.html                  Website content and inline SVG icons
  styles.css                  Standalone styles, including mobile layouts
  contact.js                  Contact form and on-demand Turnstile integration
  404.html                    Missing-page response for Cloudflare Pages
  favicon.svg                 Site favicon
  cta-logo.webp               Refined Alliance logo used in the header and footer
  craigieburn-range.webp       Hero photograph
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

The hero image is a cropped and optimised version of
[Camp Saddle, Craigieburn Range, New Zealand 14](https://commons.wikimedia.org/wiki/File:Camp_Saddle,_Craigieburn_Range,_New_Zealand_14.jpg)
by Michal Klajban, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
The page retains visible attribution and a licence link.

The inline icons come from [Lucide](https://lucide.dev). Their ISC licence and the
MIT notice for icons inherited from Feather are included in
[`public/third-party-licenses.txt`](public/third-party-licenses.txt).
