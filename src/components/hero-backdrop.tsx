/**
 * The hero's backdrop. It is exactly one screen tall, not as tall as the section: the pale blue arc of light rises from
 * the bottom edge of the first screen and fades out there, so the video begins on the gradient and carries on below it
 * onto the plain page.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-14 -z-10 h-[calc(100svh+3.5rem)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
      <div className="absolute -left-40 top-10 size-[30rem] rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute -right-40 top-32 size-[26rem] rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="absolute inset-x-[-12%] bottom-0 h-[30rem] rounded-t-[100%] bg-gradient-to-b from-transparent via-blue-200/50 to-blue-500/80 blur-xl" />
    </div>
  );
}
