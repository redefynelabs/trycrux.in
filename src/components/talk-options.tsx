import { ArrowRightIcon, CalendarIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A wa.me link with a first message, so the chat does not open empty. No personal details go in it. */
export function whatsappHref(text = "Hi, I would like to know more about Crux.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Book a call (cal.com) and, when a number is set, chat on WhatsApp: the two ways to talk without the form. */
export function TalkOptions({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("grid gap-px bg-line ring-1 ring-line", SITE.whatsapp && !compact && "sm:grid-cols-2", className)}>
      <a href={SITE.calUrl} target="_blank" rel="noopener noreferrer" data-track="book_call_click" className="group flex items-center gap-4 bg-brand p-5 text-white transition-colors hover:bg-brand/90">
        <span className="grid size-11 shrink-0 place-items-center bg-white/15 text-2xl"><CalendarIcon /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Book a call</span>
          <span className="block text-sm text-white/80">Pick a time; we show you Crux for your use case.</span>
        </span>
        <ArrowRightIcon className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </a>
      {SITE.whatsapp && (
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="group flex items-center gap-4 bg-bg p-5 transition-colors hover:bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/whatsapp-icon.png" alt="" width={44} height={44} className="size-11 shrink-0 object-contain" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Chat on WhatsApp</span>
            <span className="block text-sm text-muted">Ask a quick question and get a reply from our team.</span>
          </span>
          <ArrowRightIcon className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}
