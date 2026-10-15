import { cn } from "@/lib/utils";

const COUNT = 9;

/** A round portrait picked from the portraits in /public/avatars. The pick follows the name, so a person keeps their face. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const n = ([...name].reduce((sum, c) => sum * 31 + c.charCodeAt(0), 7) >>> 0) % COUNT;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/avatars/p${n + 1}.jpg`} alt="" width={64} height={64} className={cn("size-8 shrink-0 rounded-full object-cover", className)} />
  );
}
