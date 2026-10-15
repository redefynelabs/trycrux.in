# Crux hero video

The product video under the home page hero, made in code with [Remotion](https://www.remotion.dev): about 41 seconds at
1920×1080, 30 fps, with an original soundtrack (music and effects synthesised in `sound/`, nothing to license),
built to loop.

```sh
npm install
npm run studio   # preview and scrub in the browser
python3 sound/make_soundtrack.py   # music and effects -> public/soundtrack.wav (needs numpy, scipy)
npm run render   # writes ../public/video/crux-hero.mp4, .webm and -poster.jpg, with the soundtrack
```

Scenes (`src/scenes`, order and lengths in `src/Root.tsx`):

| Time | Scene | What it shows |
|---|---|---|
| 0–4 s | intro | The mark lands, "Crux", the tagline |
| 4–9 s | problem | Six separate tools pulled into one mark |
| 9–13 s | one-system | The dashboard with the four modules |
| 13–18 s | people | Today's roster checking in, a leave request approved |
| 18–24 s | sales | Quote accepted → order fulfilled → invoice draft with GST |
| 24–28 s | finance | Revenue, expenses and profit counting up, revenue by month |
| 28–36 s | mei | Mei answers "top clients this quarter" and drafts an invoice to confirm |
| 36–41 s | close | "The only software your business needs.", three points, trycrux.in |

The colours and type match the website (`src/theme.ts`): Punta for headlines (copied into `public/`), Geist for the
interface. All names and figures are invented sample data. Re-render after changing any scene, the logo or the font.
