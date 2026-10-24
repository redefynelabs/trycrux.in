"use client";

import { CheckIcon, SparkIcon } from "@/components/icons";
import { APP_GROUPS, EDITIONS, PRESETS, groupsOf, inEdition, withNeeds, type Edition, type GroupId } from "@/content/pricing";
import { cn } from "@/lib/utils";

/**
 * Pick the edition, then app groups: starting points for common teams, Mei shown as always included, and one card per
 * group of the edition. Payroll brings People & HR with it, and taking People & HR away takes Payroll too. Switching
 * edition drops the other one's group. Used by the plan builder and the demo form.
 */
export function AppPicker({ edition, onEditionChange, value, onChange, presetsLabel = "Start from a team like yours", groupsLabel = "Pick your app groups", meiText }: { edition: Edition; onEditionChange: (e: Edition) => void; value: GroupId[]; onChange: (v: GroupId[]) => void; presetsLabel?: string; groupsLabel?: string; meiText: string }) {
  const all = withNeeds(value);
  const toggle = (id: GroupId) => {
    if (value.includes(id)) {
      const drop = new Set<GroupId>([id]);
      for (const g of APP_GROUPS) if (g.needs?.includes(id)) drop.add(g.id);
      onChange(value.filter((x) => !drop.has(x)));
    } else {
      onChange([...value, id]);
    }
  };
  return (
    <div>
      <p className="text-sm font-semibold text-muted">What do you sell?</p>
      <div role="radiogroup" aria-label="Edition" className="mt-3 grid gap-2 sm:grid-cols-2">
        {EDITIONS.map((e) => {
          const on = e.id === edition;
          return (
            <button
              key={e.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                onEditionChange(e.id);
                onChange(inEdition(value, e.id));
              }}
              className={cn("p-3.5 text-left ring-1 transition-colors", on ? "bg-brand-soft ring-brand/40" : "bg-bg ring-line hover:bg-soft")}
            >
              <span className="block text-sm font-semibold">{e.name}</span>
              <span className="block text-xs leading-relaxed text-muted">{e.for}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm font-semibold text-muted">{presetsLabel}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {PRESETS.filter((p) => p.edition === edition).map((p) => {
          const on = p.groups.length === all.length && p.groups.every((g) => all.includes(g));
          return (
            <li key={p.name}>
              <button type="button" onClick={() => onChange(p.groups)} aria-pressed={on} className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors", on ? "bg-brand text-white ring-brand" : "bg-soft text-muted ring-line hover:text-fg")}>{p.name}</button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex items-start gap-3 bg-neutral-950 p-4 text-white">
        <span className="grid size-9 shrink-0 place-items-center bg-brand text-lg"><SparkIcon /></span>
        <span>
          <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">Mei AI assistant <span className="bg-white/15 px-2 py-0.5 text-[11px] font-medium">Included in every plan</span></span>
          <span className="mt-1 block text-xs leading-relaxed text-white/70">{meiText}</span>
        </span>
      </div>
      <p className="mt-6 text-sm font-semibold text-muted">{groupsLabel}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {groupsOf(edition).map((g) => {
          const on = all.includes(g.id);
          const forced = on && !value.includes(g.id);
          return (
            <li key={g.id}>
              <label className={cn("flex h-full cursor-pointer items-start gap-3 p-3.5 ring-1 transition-colors", on ? "bg-brand-soft ring-brand/40" : "bg-bg ring-line hover:bg-soft")}>
                <input type="checkbox" className="sr-only" checked={on} disabled={forced} onChange={() => toggle(g.id)} />
                <span aria-hidden="true" className={cn("mt-0.5 grid size-5 shrink-0 place-items-center ring-1", on ? "bg-brand text-white ring-brand" : "bg-bg ring-line")}>{on && <CheckIcon className="size-3" />}</span>
                <span>
                  <span className="block text-sm font-semibold">{g.name}</span>
                  <span className="block text-xs leading-relaxed text-muted">{g.text}{forced ? " Added because Payroll needs it." : ""}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
