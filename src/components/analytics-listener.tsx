"use client";

import { useEffect } from "react";
import { locationOf, textOf, track, type EventName } from "@/lib/analytics";

/** Internal pages whose links count as calls to action, by what they lead to. */
const CTA: Record<string, string> = { "/demo": "start_demo", "/contact": "talk_to_sales", "/pricing": "see_pricing" };

/**
 * Turns clicks anywhere on the site into analytics events, so links and buttons need no wiring of their own:
 *  - an element with data-track="event_name" sends that event, with every data-track-* attribute as a parameter;
 *  - links to /demo, /contact and /pricing send cta_click; links to other sites send outbound_click; mailto, email_click;
 *  - other links in the header and footer send nav_click;
 *  - opening a FAQ question sends faq_open.
 */
export function AnalyticsListener() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.("a, button, [data-track]");
      if (!el) return;
      const base = { cta_text: textOf(el), cta_location: locationOf(el) };

      const named = el.closest("[data-track]");
      if (named) {
        const params: Record<string, string> = { ...base };
        for (const a of Array.from(named.attributes)) {
          if (a.name.startsWith("data-track-")) params[a.name.slice(11).replace(/-/g, "_")] = a.value;
        }
        track(named.getAttribute("data-track") as EventName, params);
        return;
      }

      if (!(el instanceof HTMLAnchorElement) || !el.href) return;
      const url = new URL(el.href, location.href);
      if (url.protocol === "mailto:") return track("email_click", { ...base, link_url: url.pathname });
      if (url.host !== location.host) return track("outbound_click", { ...base, link_url: url.href, link_domain: url.host });
      const cta = CTA[url.pathname];
      if (cta) return track("cta_click", { ...base, cta, link_url: url.pathname + url.hash });
      if (base.cta_location === "header" || base.cta_location === "footer") track("nav_click", { ...base, link_url: url.pathname + url.hash });
    }

    // <details> toggles do not bubble, so they are caught on the way down.
    function onToggle(e: Event) {
      const d = e.target;
      if (d instanceof HTMLDetailsElement && d.open) {
        track("faq_open", { faq_question: textOf(d.querySelector("summary") ?? d), cta_location: locationOf(d) });
      }
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("toggle", onToggle, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);
  return null;
}
