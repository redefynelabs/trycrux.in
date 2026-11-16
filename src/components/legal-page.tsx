import type { ReactNode } from "react";

/** The shell of a legal page. Until the legal review is done, the page tells visitors so in plain words; pass draft={false} once it is. */
export function LegalPage({ title, updated, draft = true, children }: { title: string; updated: string; draft?: boolean; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-20 sm:px-6">
      {draft && (
        <p role="note" className="mb-6 rounded-2xl bg-soft px-4 py-3 text-sm text-muted ring-1 ring-line">
          <strong>Under legal review.</strong> This is how we handle your data today. The wording may be refined once our review is complete; we&rsquo;ll update the date below when it is.
        </p>
      )}
      <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
      <div className="mt-8 space-y-4 text-muted [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-fg">{children}</div>
    </article>
  );
}
