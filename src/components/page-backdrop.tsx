/**
 * The faint grid behind the top of every page, from the top of the page column (behind the navigation) fading out
 * below. It is part of the page column so it shows on every page, not just the home page.
 */
export function PageBackdrop() {
  return <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-x-0 top-0 z-0 h-[34rem] opacity-60" />;
}
