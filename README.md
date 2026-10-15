# Marketing site

The public website for the ERP: features, pricing, a self-service demo, and a contact form. Every form submission
becomes a **lead in the control plane** (`erp-control-plane`); this site stores nothing itself.

## How a lead gets captured

```
browser form ──► /api/demo | /api/contact  (this site, validates, adds the visitor's IP)
                    └──► control plane  POST /v1/demo-requests | /v1/contact-requests
                             ├─ lead created or refreshed (one lead per email)
                             ├─ history entry: demo_started / contact_message, with campaign + referrer + landing page
                             ├─ demo requests also start a private demo and return its address and login
                             └─ optional Slack-style notification to the sales team
```

- The browser only talks to this site. The control plane's address (`CONTROL_PLANE_URL`) is read on the server and
  never reaches the browser.
- Bot protection: a hidden honeypot field, optional Cloudflare Turnstile, and limits per email, per address and on
  total live demos in the control plane.
- Attribution: the first page, `utm_*` values and referrer of a visit are remembered for the tab and sent with the
  form, so every lead shows which campaign brought it.
- Leads are worked in the control plane's admin app (`erp-control-plane/web`): owners, tasks, email, sales and analytics.
- Both forms require a phone number (7 to 15 digits; `+`, spaces, brackets, dots and dashes allowed). The control plane
  keeps it on the lead.

## Before launch

1. **Pricing**: edit `src/content/pricing.ts`. Review every figure before launch.
2. **Legal pages**: `src/app/legal/*` are drafts. Have a lawyer review them and remove the notice in
   `components/legal-page.tsx`.
3. **Site details**: name, email and tagline in `src/lib/site.ts`; copy in `src/content/*`.
4. Set the environment (below) and put the control plane's `CP_ALLOWED_ORIGINS`/`CP_TRUST_PROXY` to match.
   `CP_TRUST_PROXY=true` is only safe when the control plane is reachable from this site alone, because it then
   believes the `X-Forwarded-For` this site sends.

## Environment

See `.env.example`. `NEXT_PUBLIC_*` values are fixed into the browser bundle at build time (pass them as build args
to the Docker build); `CONTROL_PLANE_URL` is read at run time.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
npm test               # unit tests
npm run build && npm start
```

```bash
docker build -t erp-website \
  --build-arg NEXT_PUBLIC_SITE_URL=https://trycrux.in \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=... .
docker run -p 3000:3000 -e CONTROL_PLANE_URL=http://control-plane:8090 erp-website
```

## Structure

- `src/content/` the words and numbers: features, pricing, FAQ.
- `src/app/` pages; `src/app/api/` the two form routes.
- `src/components/` header, footer, the forms, Turnstile, FAQ.
- `src/lib/` site settings, form schemas, the control-plane client, browser helpers.
