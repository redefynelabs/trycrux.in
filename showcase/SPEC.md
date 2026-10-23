# Crux product showcase: spec

GOAL:    a business owner watching once understands that Crux runs projects, people, sales, finance and an AI
         assistant on one system, and remembers trycrux.in.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, MP4 with voice, music, effects and burned-in captions.
TIME:    65.5 s x 30 = 1965 frames. Music 100 BPM, 18 frames a beat, 72 a bar. The voice is the clock.

LOOK:    ground #f3f5fa flat (no texture, no gradient). Panels #ffffff on it, separated by the tone step and a
         1 px #e3e7ef border (product UI only). Ink #0b0d12, muted #5b6472. One accent, Crux blue #1f5bf0, only on
         actions (buttons, the active nav item, bars) and the mark. One field of colour: the proof scene is a
         full #1f5bf0 ground with white type. Success green #0f9d6a only on states that turn done.
         Display: Punta (the brand face) at weight 600, 96-180 px, tracking -0.01em, leading 1.0.
         Interface: Geist 400/500/600, 26-34 px for anything read (the real UI at about 1.7x), 20-24 px only for
         table texture. Captions Geist 500 40 px, ink, on the ground, 96 px from the bottom.
         Corners square everywhere (person's call); only avatars and status dots are round. No shadows at rest.
OBJECTS: the Crux mark (assets/img/crux-mark.png, never redrawn); the Crux app shell: 300 px sidebar with the logo
         and the nav of the real product (Dashboard, Mei AI, Projects, Tasks, Attendance, Leave, Quotes,
         Invoices, Reports), a main pane with a 40 px title. Each pane is a rebuilt piece of a real screen with
         the product's own labels (To do / In progress / In review / Done, Check in, Approve, Accepted,
         Fulfilled, Create invoice, "Ask Mei a question or request a report…", "Read from Monthly attendance",
         "You are all caught up."). Sample figures add up. The hook's tools are plain generic app windows
         (spreadsheet, inbox, PDF, chat, timesheet), no real brand.
MOTION:  enter expo.out 0.35-0.5 s; camera and pane moves power2.inOut 0.5 s; exits power3.in, 40-50% shorter
         than their entrance; words 70-110 ms apart; list rows 50 ms apart. A landed title holds dead still.
         No loops, no bounce on UI, no floating.
SHOTS:
  s1 hook       0.0-11.9   headline lit word by word with the voice; at "Yet" app windows pile in on the words
                           (tools, copy and paste, hectic days); badges climb; at 11.1 every window is pulled to
                           the centre (carry) - whoosh + riser.
  s2 reveal    11.9-18.4   the pulled-in point becomes the mark (impact on "Meet"), "Crux" wipes in beside it,
                           the lockup lifts, the tagline arrives word by word, five module names fly in from both
                           sides and close up on "together"; the lockup shrinks into the sidebar logo.
  s3 demo      18.4-28.6   the app builds around the logo. One pane per phrase: board (a card dragged to Done),
                           attendance (check-ins, a leave approved), quote -> order -> invoice with sales tax,
                           finance counting up, the dashboard; on "All in one place" the four panes fold into one
                           2 x 2 view of the same screen; the cursor clicks Mei AI.
  s4 mei       28.6-45.2   iris from the click into Mei. The request is typed and sent; the attendance report
                           builds row by row; top clients; an invoice draft; punch-in on "your own data"; the
                           cursor presses Confirm on the word "confirm" and the draft turns created.
  s5 proof     45.2-50.6   colour flood from the Confirm button to Crux blue: three statements stacked, the
                           earlier ones dim; 24 rolls up.
  s6 statement 50.6-57.9   flood back to the ground; "Less busywork." / "More meaningful work." at 170 px; they
                           lift away as the calm dashboard rises (all caught up, revenue growing on "grow").
  s7 end       57.9-65.5   the mark fills from the bottom on "Crux", the name wipes in, the tagline, then the
                           Try the demo button and trycrux.in held 3 s; music resolves.
BANNED:  dark void, glow, gradients, glass, three cards in a row, KPI grids as decoration, a title over a dimmed
         screenshot, the logo docked in a corner, eyebrow labels, monospace, index numbers, pill chips, rounded
         panels, tilted 3D product UI, everything fading up, floating loops, chimes.
QA:      1.5 (headline lit), 7.8 (copy and paste), 11.4 (pull-in), 12.6 (mark), 16.9 (modules together),
         19.6, 20.9, 21.9, 22.8, 23.8, 26.5 (2 x 2), 34.8, 37.6, 39.5, 43.8 (created), 48.5, 51.8, 56.6, 61.5.
