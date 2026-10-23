"""
Writes assets/vo/words.json: every spoken word on the film's clock, with caption spellings.

    python3 tools/build_words.py

Input: assets/vo/transcript-all.json, a Parakeet transcript of the seven lines joined end to end
(`ffmpeg -i b1.wav ... -filter_complex concat=n=7:v=0:a=1 all.wav`, then `npx hyperframes transcribe all.wav -e parakeet`).
PLACE must match each <audio id="voN"> data-start in index.html.
"""
import json
import os
import subprocess

ROOT = os.path.join(os.path.dirname(__file__), "..")
PLACE = [0.4, 12.3, 18.7, 29.0, 45.5, 50.9, 58.2]

d = json.load(open(os.path.join(ROOT, "assets/vo/transcript-all.json")))
words = d if isinstance(d, list) else d["words"]
durs = [
    float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(ROOT, f"assets/vo/b{i}.wav")]))
    for i in range(1, 8)
]
cum = [0.0]
for x in durs:
    cum.append(cum[-1] + x)

timed = []
for w in words:
    # A word that starts just before a file boundary belongs to the next file.
    b = max(k for k in range(7) if w["start"] >= cum[k] - 0.3)
    off = PLACE[b] - cum[b]
    timed.append({"b": b + 1, "text": w["text"], "start": round(w["start"] + off, 3), "end": round(w["end"] + off, 3)})

# The voice says "May" and "try crux dot in"; captions spell the product's words.
JOIN = {("AI", "powered"): "AI-powered", ("per", "user"): "per-user", ("busy", "work,"): "busywork,", ("Try", "Crux.in."): "trycrux.in"}
SWAP = {"May,": "Mei,", "May": "Mei"}
out, i = [], 0
while i < len(timed):
    w = dict(timed[i])
    nxt = timed[i + 1]["text"] if i + 1 < len(timed) else ""
    if (w["text"], nxt) in JOIN:
        w["text"], w["end"] = JOIN[(w["text"], nxt)], timed[i + 1]["end"]
        i += 1
    else:
        w["text"] = SWAP.get(w["text"], w["text"])
    out.append(w)
    i += 1
for k, w in enumerate(out):
    w["id"] = f"w{k}"
json.dump(out, open(os.path.join(ROOT, "assets/vo/words.json"), "w"), indent=0)
print(f"{len(out)} words")
