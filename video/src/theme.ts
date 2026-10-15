import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { continueRender, delayRender, interpolate, spring, staticFile } from "remotion";

/** The website's colours and type, so the video and the page look like one thing. */
export const C = {
  bg: "#fbfcff",
  card: "#ffffff",
  soft: "#f4f6fb",
  fg: "#0b0d12",
  muted: "#5b6472",
  line: "#e6e9f0",
  brand: "#1f5bf0",
  brandSoft: "#e8eeff",
  ok: "#0f9d6a",
  okSoft: "#e3f6ee",
  warn: "#b7791f",
  warnSoft: "#fdf3dc",
  bad: "#d23f3f",
  badSoft: "#fde8e8",
};

const geist = loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
export const UI = geist.fontFamily;
export const DISPLAY = "Punta";

// Punta is the brand face (headings and the wordmark); it is a local file, so it is loaded before any frame renders.
// Only the Light cut exists: declared as 300 so weight 600 gets the browser's bolder rendering, as on the website.
const waitPunta = delayRender("Loading Punta");
new FontFace(DISPLAY, `url(${staticFile("punta-light.otf")})`, { weight: "300" })
  .load()
  .then((f) => {
    (document.fonts as unknown as Set<FontFace>).add(f);
    continueRender(waitPunta);
  })
  .catch(() => continueRender(waitPunta));

export const FPS = 30;

/** 0 to 1 over [from, from + len] frames, eased, clamped. */
export function ramp(frame: number, from: number, len = 15): number {
  return interpolate(frame, [from, from + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
}

/** A soft spring that settles without bouncing, starting at `delay`. */
export function pop(frame: number, delay = 0, damping = 200): number {
  return spring({ frame: frame - delay, fps: FPS, config: { damping, mass: 0.6 } });
}

