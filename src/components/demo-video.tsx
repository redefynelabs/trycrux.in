"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { SITE } from "@/lib/site";

const isFile = (u: string) => /\.(mp4|webm|ogg)(\?|$)/i.test(u);

/** The hero video, made in /video with Remotion (npm run render there writes these files). */
const HERO = { webm: "/video/crux-hero.webm", mp4: "/video/crux-hero.mp4", poster: "/video/crux-hero-poster.jpg" };

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
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) v.pause();
    else v.play().catch(() => setPlaying(false));
  }, [reduced]);

  // Browsers only autoplay muted video, so sound starts off; turning it on also plays the video.
  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) void v.play();
  };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO.poster}
        onPlay={() => setPlaying(true)}
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
