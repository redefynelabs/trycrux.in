"use client";

import { useState } from "react";
import type { FaqGroup, QA } from "@/content/faq";
import { cn } from "@/lib/utils";

/** A list of questions that open in place. */
export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-line ring-1 ring-line">
      {items.map((i) => (
        <details key={i.q} className="group bg-bg px-6 py-5 transition-colors open:bg-soft/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            {i.q}
            <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center bg-soft text-muted transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-2xl text-muted">{i.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Questions sorted into topics, so a buyer can go straight to price, integrations or safety. */
export function FaqTabs({ groups }: { groups: FaqGroup[] }) {
  const [id, setId] = useState(groups[0].id);
  const group = groups.find((g) => g.id === id) ?? groups[0];
  return (
    <div>
      <div role="tablist" aria-label="Question topics" className="mb-8 flex flex-wrap justify-center gap-2">
        {groups.map((g) => (
          <button key={g.id} role="tab" aria-selected={g.id === id} onClick={() => setId(g.id)} className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", g.id === id ? "bg-accent text-white" : "bg-soft text-muted ring-1 ring-line hover:text-fg")}>
            {g.label}
          </button>
        ))}
      </div>
      <Faq key={group.id} items={group.items} />
    </div>
  );
}
