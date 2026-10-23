"""
Builds the showcase's music bed and sound effects, synthesised here (the same instruments as the hero video's
../video/sound/make_soundtrack.py), so there is nothing to license.

    python3 tools/make_sound.py      # writes assets/audio/music.wav and assets/audio/sfx.wav (needs numpy, scipy)

Cue times are film seconds and mirror the scene scripts in compositions/; change them together. The two files are
separate tracks in index.html so the music can sit under the voice.
"""
import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 65.5
N = int(DUR * SR)
rng = np.random.default_rng(11)
music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def t_of(n):
    return np.arange(n) / SR


def lowpass(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def highpass(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def add(buf, at_s, sig, gain=1.0, pan=0.0):
    i = int(at_s * SR)
    if i >= len(buf) or i < 0:
        return
    sig = sig[: len(buf) - i]
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i : i + len(sig), 0] += sig * gain * left * 1.414
    buf[i : i + len(sig), 1] += sig * gain * right * 1.414


def env(n, a, d):
    t = t_of(n)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(d, 1e-4))


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


# ---------------------------------------------------------------- music: 100 BPM, Am7 Fmaj7 C G, two bars each

BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
CHORDS = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67]]
ROOTS = [45, 41, 48, 43]
DRUMS_FROM, HATS_FROM, CALM_FROM, CLOSE = 3.7, 12.2, 50.6, 57.9
MEI = (28.6, 45.2)


def pad(notes, length):
    n = int(length * SR)
    t = t_of(n)
    out = np.zeros(n)
    for note in notes:
        for det in (-0.08, 0.08):
            f = hz(note + det)
            for k in range(1, 7):
                out += np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6.28)) / (k ** 1.6)
    out = lowpass(out, 1400)
    a = np.minimum(1, t / 0.9) * np.minimum(1, (length - t) / 0.9)
    return out * a / (len(notes) * 6)


def bass(note, length):
    n = int(length * SR)
    t = t_of(n)
    f = hz(note)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * env(n, 0.01, 0.55)


def kick():
    n = int(0.35 * SR)
    t = t_of(n)
    f = 52 + 90 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.16)


def hat():
    n = int(0.06 * SR)
    return highpass(rng.standard_normal(n), 7000) * env(n, 0.001, 0.018)


def bell(note, length=1.6):
    n = int(length * SR)
    t = t_of(n)
    f = hz(note)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3)
    return s * env(n, 0.004, 0.6)


bars = int(np.ceil(DUR / BAR))
for b in range(bars):
    start = b * BAR
    if start >= CLOSE:
        break
    ci = (b // 2) % 4
    if b % 2 == 0:
        add(music, start, pad(CHORDS[ci], min(2 * BAR + 0.6, CLOSE + 0.6 - start)), 0.55)
    if start >= DRUMS_FROM - BAR:
        for beat in (0, 2.5):
            add(music, start + beat * BEAT, bass(ROOTS[ci], BEAT * 1.4), 0.3)
    for beat in range(4):
        at = start + beat * BEAT
        if DRUMS_FROM <= at < CALM_FROM:
            add(music, at, kick(), 0.4)
        if HATS_FROM <= at < CALM_FROM:
            add(music, at + BEAT / 2, hat(), 0.08, pan=0.3)
            if beat in (1, 3):
                snare = bandpass(rng.standard_normal(int(0.18 * SR)), 1200, 5000) * env(int(0.18 * SR), 0.002, 0.06)
                add(music, at, snare, 0.06)
    # A light arpeggio under Mei, where the picture moves slowest.
    if MEI[0] <= start < MEI[1]:
        for k, note in enumerate(CHORDS[ci]):
            add(music, start + k * BEAT / 2, bell(note + 12, 1.0), 0.045, pan=-0.4 + 0.25 * k)

# The close: one held chord that resolves under the end card.
add(music, CLOSE, pad([48, 55, 60, 64, 71], DUR - CLOSE), 0.6)
for k, note in enumerate([72, 76, 79, 84]):
    add(music, CLOSE + 0.3 + k * 0.12, bell(note, 2.4), 0.08, pan=-0.3 + 0.2 * k)

t_all = t_of(N)
music *= (np.minimum(1, t_all / 0.8) * np.minimum(1, (DUR - t_all) / 2.5))[:, None]

# ---------------------------------------------------------------- effects


def whoosh(length=0.6, lo=300, hi=3500):
    n = int(length * SR)
    t = t_of(n)
    noise = rng.standard_normal(n)
    a, b = bandpass(noise, lo, lo * 3), bandpass(noise, hi / 3, hi)
    w = t / length
    return (a * (1 - w) + b * w) * np.sin(np.pi * np.clip(t / length, 0, 1)) ** 2


def pop(f0=900, f1=480, length=0.09):
    n = int(length * SR)
    t = t_of(n)
    f = f1 + (f0 - f1) * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.035)


def click():
    n = int(0.03 * SR)
    t = t_of(n)
    return (0.6 * highpass(rng.standard_normal(n), 2500) + np.sin(2 * np.pi * 2200 * t)) * env(n, 0.0005, 0.006)


def tick():
    n = int(0.025 * SR)
    return bandpass(rng.standard_normal(n), 2000, 6000) * env(n, 0.0005, 0.005)


def boom():
    n = int(1.2 * SR)
    t = t_of(n)
    f = 45 + 40 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.005, 0.45)


def riser(length=1.3):
    n = int(length * SR)
    t = t_of(n)
    f = 220 * 2 ** (2 * t / length)
    return (0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * highpass(rng.standard_normal(n), 1500)) * (t / length) ** 2


# Two takes of each whoosh, rotated, so the cuts never repeat one sound.
W = [lambda: whoosh(0.6, 300, 3500), lambda: whoosh(0.5, 400, 4500), lambda: whoosh(0.7, 250, 3000)]
wk = [0]


def sw(at, gain=0.1):
    add(sfx, at - 0.25, W[wk[0] % 3](), gain, pan=rng.uniform(-0.35, 0.35))
    wk[0] += 1


def sp(at, gain=0.2, k=0):
    add(sfx, at + 0.033, pop(760 + 50 * (k % 5), 460 + 30 * (k % 5)), gain, pan=rng.uniform(-0.5, 0.5))


# Hook opener: the clock ticks as the day races by; the sliver of real work lands with a pop.
for k in range(15):
    add(sfx, 1.88 + k * 0.1, tick(), 0.11 + 0.02 * (k % 2), pan=-0.3)
sp(3.32, 0.2, 4)

# Hook: each window lands with a pop; the copy is a click, the paste a pop; the counters tick; a riser into the mark.
for k, t in enumerate([3.8, 4.4, 4.8, 5.45, 6.0, 6.2, 6.72, 7.0, 8.4, 8.96]):
    sp(t, 0.2, k)
add(sfx, 7.23, click(), 0.35)
sp(7.9, 0.22, 3)
for k in range(12):
    add(sfx, 8.45 + k * 0.18, tick(), 0.12 + 0.01 * (k % 3), pan=0.4)
add(sfx, 10.5, riser(1.35), 0.12)
sw(11.3, 0.12)

# Reveal: the impact as the mark lands, then the lockup moves and the modules fly in.
add(sfx, 12.23, boom(), 0.5)
sw(12.6, 0.08)
sw(13.2, 0.08)
sw(16.0, 0.09)
sw(16.3, 0.07)
sp(17.1, 0.16, 2)
sw(17.85, 0.09)

# Demo: the frame opens, the drag, check-ins, the approve click, each pane change, the documents, the counters.
sw(18.45, 0.09)
add(sfx, 19.5, click(), 0.35, pan=0.3)
sp(20.0, 0.18, 1)
for k in range(6):
    add(sfx, 20.26 + k * 0.06, tick(), 0.16, pan=-0.2)
add(sfx, 20.82, click(), 0.38, pan=0.4)
for t in (21.02, 22.12, 23.0):
    sw(t, 0.07)
for k, t in enumerate((21.25, 21.55, 21.85)):
    sp(t, 0.18, k + 1)
for k in range(8):
    add(sfx, 22.3 + k * 0.09, tick(), 0.1, pan=-0.4)
sw(25.4, 0.1)
add(sfx, 28.1, click(), 0.4, pan=-0.4)

# Mei: the iris, typing, send, each answer, the push-in, the confirm click.
sw(28.65, 0.1)
for k in range(21):
    add(sfx, 31.45 + k * 0.07, tick(), 0.13 + rng.uniform(-0.03, 0.03), pan=0.25)
add(sfx, 32.98, click(), 0.32)
sp(33.08, 0.18, 0)
sp(34.02, 0.18, 2)
for k in range(7):
    add(sfx, 34.25 + k * 0.07, tick(), 0.09, pan=-0.2)
sp(36.55, 0.16, 1)
sp(37.05, 0.16, 3)
sp(38.1, 0.16, 1)
sp(38.65, 0.16, 4)
sw(40.1, 0.08)
add(sfx, 43.6, click(), 0.45, pan=0.35)
sp(43.66, 0.2, 2)

# Proof: the flood, each statement, the 24 rolling up.
sw(45.25, 0.12)
for k, t in enumerate((45.48, 46.76, 48.2)):
    sp(t, 0.16, k)
for k in range(6):
    add(sfx, 48.82 + k * 0.07, tick(), 0.1)

# Statement and end card.
sw(50.65, 0.11)
sw(53.45, 0.08)
sw(57.95, 0.07)
sp(60.4, 0.16, 2)


def write(path, buf, peak):
    buf = np.tanh(buf * 1.3) / np.tanh(1.3)
    buf *= peak / max(1e-9, np.max(np.abs(buf)))
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((buf * 32767).astype("<i2").tobytes())
    print(f"wrote {os.path.normpath(path)}")


out = os.path.join(os.path.dirname(__file__), "..", "assets", "audio")
os.makedirs(out, exist_ok=True)
write(os.path.join(out, "music.wav"), music, 0.85)
write(os.path.join(out, "sfx.wav"), sfx, 0.8)
