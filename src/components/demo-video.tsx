"use client";

import { useEffect, useRef, useState } from "react";
import { useRegion } from "@/components/currency-picker";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

const isFile = (u: string) => /\.(mp4|webm|ogg)(\?|$)/i.test(u);

/** The hero video, made in /video with Remotion: one cut per region, with that region's money and tax (npm run render there writes them). */
/** Regions whose cut is rendered; any other region (and a missing one) plays the US dollar cut. */
const RENDERED = ["INR", "USD", "GBP", "EUR", "AED"];

function heroFiles(region: string) {
  const r = (RENDERED.includes(region) ? region : "USD").toLowerCase();
  return { webm: `/video/crux-hero-${r}.webm`, mp4: `/video/crux-hero-${r}.mp4`, poster: `/video/crux-hero-${r}-poster.jpg` };
}

/**
 * The product video under the hero. It plays muted and loops, like a moving screenshot, with a button to pause it; for
 * people who ask for less motion it starts paused on its poster. NEXT_PUBLIC_DEMO_VIDEO_URL replaces it with another file
 * or an embed (YouTube, Vimeo).
 */
export function DemoVideo() {
  const src = SITE.demoVideoUrl;
  return (
    <div className="relative mx-auto -mt-2 max-w-[76rem] rounded-[2rem] bg-bg p-2 ring-1 ring-line sm:p-3">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-soft ring-1 ring-line">
        {src && !isFile(src) ? (
          <iframe src={src} title="Product demo video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen className="size-full border-0" />
        ) : (
          <HeroVideo src={src} />
        )}
      </div>
    </div>
  );
}

function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const region = useRegion();
  const HERO = heroFiles(region);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // Progress marks already sent this page view; the video loops, so each is sent once.
  const marks = useRef(new Set<number>());
  // Whether the person has pressed play, pause or sound, to tell their plays from autoplay.
  const acted = useRef(false);

  const onTime = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    for (const m of [25, 50, 75]) {
      if (pct >= m && !marks.current.has(m)) {
        marks.current.add(m);
        track("video_progress", { video_title: "Crux hero", video_percent: m });
      }
    }
    if (pct >= 97 && !marks.current.has(100)) {
      marks.current.add(100);
      track("video_complete", { video_title: "Crux hero" });
    }
  };

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) v.pause();
    else v.play().catch(() => setPlaying(false));
  }, [reduced, region]);

  // Browsers only autoplay muted video, so sound starts off; turning it on also plays the video.
  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    acted.current = true;
    v.muted = !v.muted;
    setMuted(v.muted);
    track(v.muted ? "video_sound_off" : "video_sound_on", { video_title: "Crux hero", video_percent: Math.round((v.currentTime / (v.duration || 1)) * 100) });
    if (!v.muted && v.paused) void v.play();
  };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    acted.current = true;
    if (v.paused) void v.play();
    else {
      v.pause();
      track("video_pause", { video_title: "Crux hero", video_percent: Math.round((v.currentTime / (v.duration || 1)) * 100) });
    }
  };

  return (
    <>
      {/* Keyed by region, so a change of region loads that cut. */}
      <video
        key={region}
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO.poster}
        onPlay={() => {
          setPlaying(true);
          if (!marks.current.has(0)) {
            marks.current.add(0);
            track("video_start", { video_title: "Crux hero", autoplay: !acted.current });
          }
        }}
        onTimeUpdate={onTime}
        onPause={() => setPlaying(false)}
        aria-label="Crux product tour: the dashboard, people and attendance, quote to invoice, finance reports and Mei, the AI assistant"
        className="size-full object-cover"
      >
        {src ? (
          <source src={src} />
        ) : (
          <>
            <source src={HERO.webm} type="video/webm" />
            <source src={HERO.mp4} type="video/mp4" />
          </>
        )}
      </video>
      <div className="absolute right-4 bottom-4 flex gap-2">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-bg/85 px-4 text-sm font-medium text-fg shadow-md ring-1 ring-line backdrop-blur transition-colors hover:bg-bg"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m22 9-6 6M16 9l6 6" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
          )}
          {muted ? "Sound on" : "Sound off"}
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the video" : "Play the video"}
          className="grid size-11 place-items-center rounded-full bg-bg/85 text-fg shadow-md ring-1 ring-line backdrop-blur transition-colors hover:bg-bg"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
          )}
        </button>
      </div>
    </>
  );
}
