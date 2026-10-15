# Analytics: what the site tracks and how to set it up

The website loads Google Analytics 4 directly (web stream `G-4CVZYN65JJ`) and sends its own named events to it with
`gtag` (`src/lib/analytics.ts`). Clicks are caught by one listener for the whole site
(`src/components/analytics-listener.tsx`), so a new link or button is tracked without extra code. Forms and the hero video
send their own events. Every event is also pushed to Google Tag Manager's `dataLayer` (container `GTM-WPXKWW33`), so
GTM can use it to trigger other tags (an ads conversion, a pixel).

**Microsoft Clarity** (project `yy9kmhhvj5`) is loaded by the site itself (`src/components/consent-banner.tsx`), and only
once session recordings are allowed. The "Microsoft Clarity - Official" tag in GTM is **paused** so it cannot record
before consent; keep it paused. Clarity stays linked to GA4 in Clarity's settings. Every site event is also sent to
Clarity (`clarity("event", name)`), so recordings and heatmaps can be filtered by it, for example sessions with
`generate_lead` or `form_error`.

**Do not add a GA4 tag in GTM** (the container should hold only Clarity and non-Google tags) (neither a Google tag for `G-4CVZYN65JJ` nor GA4 event tags): GA4 is already on the page,
and a second copy would count every visit and event twice.

No event ever carries what a person typed (name, email, phone, message): only which form, which button and which choice.

GA4 and GTM load only in production builds (`npm run build && npm start`, or Vercel). `NEXT_PUBLIC_GA_ID` and
`NEXT_PUBLIC_GTM_ID` override the IDs, and `off` disables either.

## Cookie consent

`src/lib/consent.ts` and `src/components/consent-banner.tsx`. Two optional kinds: **Analytics** (GA4) and **Session
recordings** (Clarity); the bot check and remembering the choice are strictly necessary.

- **EU and EEA, UK, Switzerland** (`src/proxy.ts` reads Vercel's `x-vercel-ip-country` and sets `crux_region=strict`):
  both are off until the visitor chooses in the banner (Accept all, Reject all, or Customize).
- **Everywhere else:** both are on, with no banner; "Cookie settings" in the footer lets anyone change it.
- **Google Consent Mode v2:** defaults are set before GA4 and GTM load. In the strict regions `analytics_storage` starts
  `denied` (by our cookie and by Google's own region list, so it holds even without the cookie), and ads storage is always
  denied. While denied, GA4 sends only cookieless pings, which GA4 uses for modelled data.
- The choice is kept in `localStorage` (`crux-consent`) for six months, then asked again. Each choice sends a
  `consent_update` event (`consent_analytics`, `consent_recordings`, `consent_method`).

## Set up GA4 (about 10 minutes, once)

1. **Enhanced measurement.** In GA4, Admin → Data streams → the trycrux.in stream → Enhanced measurement: keep page views
   and scrolls on, and turn **off** "Outbound clicks" and "Form interactions". The site sends better versions of both
   (`outbound_click`, `form_start` and `form_submit`), and leaving them on would count those twice.
2. **Check it works.** Open the live site, click around and send a demo request; the events show in Reports → Realtime,
   or Admin → DebugView (turn on debug with the Google Tag Assistant browser extension).
3. **Key event.** Admin → Events (once the first ones have arrived) → mark **`generate_lead`** as a key event
   (conversion). Also `demo_open` if you want "opened the demo" counted.
4. **Custom dimensions.** Admin → Custom definitions → *Create custom dimension*, scope **Event**, for each parameter you
   want in reports: `cta`, `cta_text`, `cta_location`, `link_domain`, `assistant`, `tab_name`, `faq_question`,
   `form_name`, `lead_type`, `team_size`, `focus`, `interest`, `plan`, `timeline`, `error_fields`, `video_percent`.
   Parameters without a custom dimension are still collected, but standard reports cannot break down by them.

## Where to look

| Question | In GA4 |
|---|---|
| Is it working right now? | Reports → Realtime, or Admin → DebugView |
| How many leads, and from where? | Reports → Engagement → Events → `generate_lead`, broken down by *Session source / medium* or `lead_type` |
| Where do people drop off in a form? | Explore → Funnel: `form_start` → `form_submit` → `generate_lead`, filtered by `form_name` |
| Which fields fail? | Events → `form_error` by `error_fields` |
| Which buttons work? | Events → `cta_click` by `cta` and `cta_location` (hero, header, footer, pricing section …) |
| Do people ask AIs about us? | Events → `ask_ai_click` by `assistant` |
| Is the video watched? | `video_start`, `video_progress` by `video_percent`, `video_complete`, `video_sound_on` |
| What do buyers worry about? | Events → `faq_open` by `faq_question`; `tab_select` by `tab_name` |

## Event reference

| Event | When | Parameters |
|---|---|---|
| `cta_click` | A link to /demo, /contact or /pricing | `cta` (start_demo, talk_to_sales, see_pricing), `cta_text`, `cta_location`, `link_url` |
| `nav_click` | Any other header or footer link | `cta_text`, `cta_location`, `link_url` |
| `outbound_click` | A link to another site | `cta_text`, `cta_location`, `link_url`, `link_domain` |
| `email_click` | A mailto link | `cta_text`, `cta_location` |
| `ask_ai_click` | Ask ChatGPT / Claude / Gemini / Perplexity | `assistant`, `cta_location` |
| `announcement_click`, `announcement_close` | The top bar's link, or its close button | `announcement` (its id) |
| `tab_select` | Pricing cloud/own-server switch, FAQ topics | `tab_group`, `tab_name` |
| `faq_open` | A question is opened | `faq_question` |
| `form_start` | First keystroke or choice in a form | `form_name` (demo, contact) |
| `form_submit` | The send button | `form_name` and the choices made |
| `form_error` | The bot check, the field checks or the server refused it | `form_name`, `error` (captcha, invalid, server), `error_fields` |
| `generate_lead` | A demo was created or a sales request was sent | `form_name`, `lead_type` (demo, sales), `team_size`, `focus` / `interest`, `plan`, `timeline` |
| `demo_ready` | The demo link and sign-in were shown | `form_name`, `team_size`, `focus` |
| `demo_open` | "Open your demo" | `cta_text` |
| `video_start` | The hero video starts | `video_title`, `autoplay` |
| `video_progress` | 25, 50, 75 % watched | `video_title`, `video_percent` |
| `video_complete` | Watched to the end | `video_title` |
| `video_pause`, `video_sound_on`, `video_sound_off` | The video's buttons | `video_title`, `video_percent` |

Choices sent with forms: `team_size` (1-10, 11-50 …), `focus` (what to see first in the demo), `interest`, `plan` and
`timeline` (contact form). Campaign details (UTM) come from GA4's own session attribution.

## Adding an event

- Any link or button: add `data-track="event_name"` and `data-track-some-param="value"` (sent as `some_param`), and add
  the name to `EventName` in `src/lib/analytics.ts`. It reaches GA4 with no GTM change.
- In code: `track("event_name", { form_name: "demo" })`.
