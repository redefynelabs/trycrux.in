# Review

## Creative calls

- The person wrote and approved the script (v2, no counts in the hook), so the three-storyline step was skipped.
- Look from the person's earlier calls and tasteskill's rules: square corners, a flat ground, one accent (Crux blue), Punta
  for statements, Geist for the interface, no gradients, glows or shadows at rest. The proof scene is the one field of colour.
- The product is rebuilt, not captured: no Crux instance was running and Docker was off. Each pane uses the real product's
  labels (`erp-software/web`) and the layouts of `public/shots/dashboard.jpg` and `mei-attendance.jpg`. A capture of a
  running demo would be more honest still.
- Mei's invoice goes to Harbor Ltd so its figures do not contradict the Acme invoice in the demo scene. All figures add up.
- No workflow automation is shown or claimed (it is not built); Mei always waits for Confirm, as the product does.
- Voice: Kokoro `af_heart` at 0.95. Music and effects are synthesised by `tools/make_sound.py`, no chimes.

## Measured vs looked at

- `hyperframes check`: passes. Warnings kept on purpose: small text inside the hook's tool windows (texture, not meant to
  be read), month labels on the charts (22 px), one window title shown 0.14 s before others cover it (the pile-up), and
  the end card's two copies of the mark (the outline and the fill).
- Looked at snapshots of every scene at its key moments (SPEC.md QA list) and fixed: the hook headline wrapping, the mark
  covering the name in the reveal and end card, panes rendered shrunk from frame 0 (a tween pre-applying its start
  state), a doc-number crossfade overlap, the Created label overflowing, the cursor missing Confirm after the push-in, the
  flood starting away from the button.
- The sound was measured, not heard: nobody has listened to the mix. Music sits at 0.22 under the voice.

## Weakest shot

The demo montage (18.4-25 s) changes pane every 0.9-1.2 s to follow the voice; it reads, but each screen is short. With
more time: slow the voice line slightly or hold the board and the invoice longer.
