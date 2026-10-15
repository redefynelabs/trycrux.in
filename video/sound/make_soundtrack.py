"""
Builds the hero video's soundtrack: an original music bed (soft pads, bass, light drums at 100 BPM) and sound effects
cued to the animation. Everything is synthesised here, so there is nothing to license.

    python3 sound/make_soundtrack.py      # writes public/soundtrack.wav

The cue frames mirror src/Root.tsx (scene starts) and the delays inside each scene; change them together.
"""
import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
TOTAL_FRAMES = 1230
DUR = TOTAL_FRAMES / FPS
rng = np.random.default_rng(7)

# Scene starts in frames (src/Root.tsx: each scene starts 10 frames before the previous one ends).
S = {"intro": 0, "problem": 110, "one": 250, "people": 390, "sales": 530, "finance": 700, "mei": 840, "close": 1080}

N = int(DUR * SR)
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
    """Mixes a mono signal into a stereo buffer at a time in seconds, panned -1 (left) to 1 (right)."""
    i = int(at_s * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i : i + len(sig), 0] += sig * gain * left * 1.414
    buf[i : i + len(sig), 1] += sig * gain * right * 1.414


def env(n, a, d):
    """Attack then exponential decay, in seconds."""
    t = t_of(n)
    e = np.minimum(1, t / max(a, 1e-4))
    return e * np.exp(-np.maximum(0, t - a) / max(d, 1e-4))


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


# ---------------------------------------------------------------- music

BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
# Am7, Fmaj7, C, G: two bars each, round and round.
CHORDS = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67]]
ROOTS = [45, 41, 48, 43]


def pad(notes, length):
    n = int(length * SR)
    t = t_of(n)
    out = np.zeros(n)
    for note in notes:
        for det in (-0.08, 0.08):
            f = hz(note + det)
            # A soft saw: a few harmonics, falling off.
            for k in range(1, 7):
                out += np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6.28)) / (k ** 1.6)
    out = lowpass(out, 1400)
    a = np.minimum(1, t / 0.9) * np.minimum(1, (length - t) / 0.9)
    return out * a / (len(notes) * 6)


def bass(note, length):
    n = int(length * SR)
    t = t_of(n)
    f = hz(note)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * env(n, 0.01, 0.55)


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
    ci = (b // 2) % 4
    if b % 2 == 0:
        add(music, start, pad(CHORDS[ci], min(2 * BAR + 0.6, DUR - start)), 0.55)
    if start >= 3.6:  # bass from the problem scene
        for beat in (0, 2.5):
            add(music, start + beat * BEAT, bass(ROOTS[ci] - 12 + 12, BEAT * 1.4), 0.32)
    # Drums play from the problem scene to the close, which is held on a chord.
    close_s = S["close"] / FPS
    for beat in range(4):
        at = start + beat * BEAT
        if 3.6 <= at < close_s:
            add(music, at, kick(), 0.42)
        if 8.3 <= at < close_s:
            add(music, at + BEAT / 2, hat(), 0.09, pan=0.3)
            if beat in (1, 3):
                snare = bandpass(rng.standard_normal(int(0.18 * SR)), 1200, 5000) * env(int(0.18 * SR), 0.002, 0.06)
                add(music, at, snare, 0.07)
    # A light bell arpeggio over the Mei scene, where nothing else moves fast.
    if S["mei"] / FPS <= start < close_s:
        for k, note in enumerate(CHORDS[ci]):
            add(music, start + k * BEAT / 2, bell(note + 12, 1.0), 0.05, pan=-0.4 + 0.25 * k)

# The close: one held chord with bells, fading so the loop restarts calmly.
close_s = S["close"] / FPS
add(music, close_s, pad([48, 55, 60, 64, 71], DUR - close_s), 0.6)
for k, note in enumerate([72, 76, 79, 84]):
    add(music, close_s + 0.15 + k * 0.12, bell(note, 2.4), 0.11, pan=-0.3 + 0.2 * k)

# Fade the bed in and out so the loop joins without a click.
t_all = t_of(N)
fade = np.minimum(1, t_all / 0.6) * np.minimum(1, (DUR - t_all) / 1.6)
music *= fade[:, None]

# ---------------------------------------------------------------- effects


def whoosh(length=0.7, lo=300, hi=3500):
    n = int(length * SR)
    t = t_of(n)
    noise = rng.standard_normal(n)
    # Sweep a band upwards by mixing two fixed bands with moving weights (cheap and smooth).
    a = bandpass(noise, lo, lo * 3)
    b = bandpass(noise, hi / 3, hi)
    w = t / length
    s = a * (1 - w) + b * w
    e = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 2
    return s * e


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


def ding(notes=(84, 91), length=1.2):
    out = np.zeros(int(length * SR))
    for k, note in enumerate(notes):
        b = bell(note, length)
        out[int(k * 0.07 * SR) :] += b[: len(out) - int(k * 0.07 * SR)]
    return out


def boom():
    n = int(1.2 * SR)
    t = t_of(n)
    f = 45 + 40 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.005, 0.45)


def riser(length=1.3):
    n = int(length * SR)
    t = t_of(n)
    f = 220 * 2 ** (2 * t / length)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR)
    noise = highpass(rng.standard_normal(n), 1500)
    return (0.5 * tone + 0.4 * noise) * (t / length) ** 2


def at(scene, frame):
    return (S[scene] + frame) / FPS


# Intro: the mark lands with a low boom and a chime, the name slides out with a whoosh.
add(sfx, at("intro", 8), boom(), 0.55)
add(sfx, at("intro", 8), ding((79, 86, 91), 2.0), 0.18)
add(sfx, at("intro", 20), whoosh(0.6, 400, 4000), 0.12, pan=0.4)

# Problem: each tool pops in, then a riser as they are pulled together and a chime when they become the mark.
for i, p in enumerate([-0.7, -0.6, -0.2, 0.6, 0.7, 0.2]):
    add(sfx, at("problem", 22 + i * 6), pop(700 + i * 60, 420 + i * 30), 0.22, pan=p)
add(sfx, at("problem", 88), riser(1.4), 0.12)
add(sfx, at("problem", 120), ding((84, 88, 91), 1.6), 0.2)
add(sfx, at("problem", 120), boom(), 0.3)

# Scene changes: a soft whoosh each.
for scene in ("one", "people", "sales", "finance", "mei", "close"):
    add(sfx, at(scene, -4), whoosh(0.65), 0.1, pan=rng.uniform(-0.3, 0.3))

# One system: the four module cards.
for i in range(4):
    add(sfx, at("one", 28 + i * 8), pop(820 + i * 70, 500 + i * 40), 0.2, pan=-0.4 + 0.27 * i)

# People: check-ins tick, the pointer clicks Approve, a confirmation chime.
for i in range(5):
    if i != 3:
        add(sfx, at("people", 24 + i * 9), tick(), 0.25, pan=-0.3)
add(sfx, at("people", 98), click(), 0.4, pan=0.4)
add(sfx, at("people", 106), ding((88, 95), 1.0), 0.14, pan=0.4)

# Sales: each document arrives, statuses change with a tick, the invoice lands with a chime.
for d, p in ((16, -0.6), (64, 0), (112, 0.6)):
    add(sfx, at("sales", d), pop(760, 460), 0.22, pan=p)
for d in (52, 100):
    add(sfx, at("sales", d), click(), 0.22)
add(sfx, at("sales", 118), ding((86, 93), 1.0), 0.12, pan=0.6)

# Finance: the counters tick up, the bars rise under a short riser.
for k in range(0, 40, 3):
    add(sfx, at("finance", 18 + k), tick(), 0.1, pan=-0.5)
add(sfx, at("finance", 18), riser(1.2), 0.07, pan=0.4)
add(sfx, at("finance", 60), ding((84, 91), 1.0), 0.1)

# Mei: typing, a send click, the answer appears; then the draft and the confirm click.
for k in range(0, 27, 2):
    add(sfx, at("mei", 14 + k), tick(), 0.16 + rng.uniform(-0.04, 0.04), pan=0.35)
add(sfx, at("mei", 58), pop(900, 600), 0.2, pan=-0.3)
for k in range(0, 27, 2):
    add(sfx, at("mei", 152 + k), tick(), 0.16 + rng.uniform(-0.04, 0.04), pan=0.35)
add(sfx, at("mei", 190), pop(900, 600), 0.2, pan=-0.3)
add(sfx, at("mei", 210), click(), 0.4, pan=0.2)
add(sfx, at("mei", 212), ding((88, 95, 100), 1.2), 0.15, pan=0.2)

# Close: the logo lands, the three points pop in.
add(sfx, at("close", 2), boom(), 0.4)
for i in range(3):
    add(sfx, at("close", 36 + i * 6), pop(760 + i * 80, 480 + i * 50), 0.18, pan=-0.4 + 0.4 * i)

# ---------------------------------------------------------------- mix

mix = music * 0.8 + sfx * 0.9
mix = np.tanh(mix * 1.4) / np.tanh(1.4)  # gentle limiter
mix *= 0.68 / np.max(np.abs(mix))  # about -16 LUFS, a normal level for web video

out = os.path.join(os.path.dirname(__file__), "..", "public", "soundtrack.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"wrote {os.path.normpath(out)}: {DUR:.2f} s")
