"""
Writes compositions/captions.html from assets/vo/words.json (word timings on the film's clock).

    python3 tools/build_captions.py

Captions show only where the picture does not already say the words: not over the hook's headline, the reveal's
tagline, the proof statements, the two big lines of the statement or the end card.
"""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
words = json.load(open(os.path.join(ROOT, "assets/vo/words.json")))

# Film-time windows where captions run.
WINDOWS = [(3.7, 11.2), (15.8, 17.9), (18.6, 26.8), (28.8, 44.6), (53.4, 57.5)]

shown = [w for w in words if any(a <= w["start"] < b for a, b in WINDOWS)]

# Phrases, written out so each caption is a whole thought. Matched to the timed words in order.
PHRASES = [
    "Yet most teams juggle", "a pile of tools,", "endless copy and paste,", "and hectic days,", "just to keep things moving.",
    "built to bring everything together.",
    "Manage your projects,", "track your team,", "handle sales and finances,", "and stay on top", "of your entire business.", "All in one place.",
    "And with Mei,", "your AI assistant,", "hours of manual work", "take seconds.", "Ask for last month's", "attendance report,",
    "find your top clients,", "or have an invoice drafted.", "Mei works from your own data,", "and nothing is created", "until you confirm.",
    "Crux gives you the clarity", "to run your business,", "and the freedom to grow it.",
]
groups, k = [], 0
for ph in PHRASES:
    n = len(ph.split())
    g = shown[k : k + n]
    assert len(g) == n, ph
    for w, t in zip(g, ph.split()):
        w["text"] = t
    groups.append(g)
    k += n
assert k == len(shown), f"{len(shown) - k} timed words left over"


def text_of(g, first_in_window):
    out = []
    for k, w in enumerate(g):
        t = w["text"]
        if k == 0:
            t = t[0].upper() + t[1:]
        out.append(t)
    return " ".join(out)


rows, script = [], []
for n, g in enumerate(groups):
    start = round(g[0]["start"] - 0.06, 3)
    nxt = groups[n + 1][0]["start"] - 0.06 if n + 1 < len(groups) else 999
    end = round(min(g[-1]["end"] + 0.35, nxt - 0.02), 3)
    gid = f"cap-{n}"
    rows.append(f'      <div class="cap" id="{gid}">{text_of(g, True)}</div>')
    script.append(f'      [ "#{gid}", {start}, {end} ],')

html = f"""<template>
  <style>
    @font-face {{ font-family: "Geist"; src: url("assets/fonts/geist-latin.woff2") format("woff2"); font-weight: 100 900; }}
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .cap {{ position: absolute; left: 0; right: 0; bottom: 92px; text-align: center; font: 500 40px/1.2 "Geist", sans-serif; color: #0b0d12; opacity: 0; visibility: hidden; overflow: visible; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1920" data-height="1080" data-layout-allow-caption-zone>
{chr(10).join(rows)}
  </div>
  <script>
    (function () {{
      // Written by tools/build_captions.py from assets/vo/words.json. Each group: [selector, in, out] in film seconds.
      const tl = gsap.timeline({{ paused: true }});
      [
{chr(10).join(script)}
      ].forEach(([sel, a, b]) => {{
        tl.set(sel, {{ visibility: "visible" }}, a);
        tl.fromTo(sel, {{ opacity: 0, y: 8 }}, {{ opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }}, a);
        tl.to(sel, {{ opacity: 0, duration: 0.1, ease: "power2.in" }}, b - 0.1);
        tl.set(sel, {{ opacity: 0, visibility: "hidden" }}, b);
      }});
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
"""
open(os.path.join(ROOT, "compositions/captions.html"), "w").write(html)
print(f"{len(groups)} caption groups")
for g in groups:
    print(f'  {g[0]["start"]:6.2f}  {" ".join(w["text"] for w in g)}')
