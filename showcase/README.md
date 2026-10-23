# Crux product showcase

A 65.5 s narrated product film (1920×1080, 30 fps), made in HTML with [HyperFrames](https://hyperframes.heygen.com):
voiceover, music, effects and burned-in captions. The brief for every shot is `SPEC.md`; the last review is `REVIEW.md`.

```sh
npx hyperframes@0.8.186 preview --background   # Studio preview in the browser
npx hyperframes@0.8.186 check                  # lint, runtime, layout, motion
npx hyperframes@0.8.186 render -q high -o out/crux-showcase.mp4
```

The render comes out at about -18.6 LUFS. For social it is normalised to -15 LUFS (true peak under -1.5 dBTP) with
ffmpeg's two-pass `loudnorm`, the video stream copied as is: measure with
`ffmpeg -i out/crux-showcase.mp4 -af loudnorm=I=-15:TP=-1.5:LRA=7:print_format=json -f null -`, then run it again with
the `measured_*` values, `linear=true`, `-c:v copy -c:a aac -b:a 192k`.

| Time | Scene (`compositions/`) | Voice |
|---|---|---|
| 0–11.9 s | `hook` | "Running a business shouldn't mean spending hours managing it…" |
| 11.9–18.4 s | `reveal` | "Meet Crux. Your AI-powered business operating system…" |
| 18.4–28.6 s | `demo` | "Manage your projects, track your team…" |
| 28.6–45.2 s | `mei` | "And with Mei, your AI assistant…" |
| 45.2–50.6 s | `proof` | "Unlimited users. No per-user price. Live within 24 hours." |
| 50.6–57.9 s | `statement` | "Less busywork. More meaningful work…" |
| 57.9–65.5 s | `endcard` | "Crux. Your business, working smarter. Try the demo at trycrux.in." |

## Sound and captions

- **Voice**: Kokoro (`af_heart`, speed 0.95), one file per line in `assets/vo/b1-7.wav`. In the spoken text Mei is written
  "May" and the address "try crux dot in" so they are said right. Kokoro needs Python 3.10–3.12 with
  `kokoro-onnx soundfile`; its bundled eSpeak looks for data at a build-machine path, so point `ESPEAK_DATA_PATH` at a folder
  holding the contents of `espeakng_loader/espeak-ng-data` (and that folder itself) before running it.
- **Timings**: `assets/vo/words.json` holds every word on the film clock (Parakeet transcript of the seven lines, shifted
  to where each line is placed in `index.html`). Scene cues are set from it.
- **Captions**: `python3 tools/build_captions.py` writes `compositions/captions.html` from `words.json`; the phrases are
  listed in the script. Captions are left out where the picture already says the words.
- **Music and effects**: `python3 tools/make_sound.py` (numpy, scipy) synthesises `assets/audio/music.wav` and `sfx.wav`
  with the same instruments as the hero video's soundtrack; nothing to license. Cue times mirror the scenes.

Change a voice line: re-record it, transcribe, rebuild `words.json`, then move the scene cues and the sound cues that
follow it.

All names and figures are invented sample data. The product screens are rebuilt from the real interface (labels from
`erp-software/web`, layouts from `public/shots/`), not captured from a running instance.
