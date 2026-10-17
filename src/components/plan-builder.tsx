"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/buttons";
import { useCurrency } from "@/components/currency-picker";
import { SparkIcon } from "@/components/icons";
import { AppPicker } from "@/components/app-picker";
import { APP_GROUPS, CLOUD, licencePrice, serverYearValue, money, planForGroups, withNeeds, type GroupId } from "@/content/pricing";

/**
 * "Build your plan": tick the app groups a team needs and see which plan fits and what it costs, as a licence. The groups are the ones the product is switched on with, so what is priced here is what is delivered.
 */
export function PlanBuilder() {
  const currency = useCurrency();
  const [picked, setPicked] = useState<GroupId[]>(["sales", "inventory", "people"]);
  const all = withNeeds(picked);
  const planId = planForGroups(all.length);
  const plan = CLOUD.tiers.find((t) => t.id === planId);
  const names = all.map((g) => APP_GROUPS.find((x) => x.id === g)!.name);
  const next = plan && plan.groups < APP_GROUPS.length ? CLOUD.tiers.find((t) => t.perMonth && t.groups > plan.groups) : undefined;

  return (
    <div className="grid gap-px bg-line ring-1 ring-line lg:grid-cols-[1.3fr_1fr]">
      <div className="bg-bg p-6 sm:p-8">
        <AppPicker value={picked} onChange={setPicked} meiText="Ask in plain words and get answers and drafts from the apps you pick. It does not count toward your groups." />
      </div>

      <div className="flex flex-col justify-between bg-soft p-6 sm:p-8">
        {plan && plan.perMonth ? (
          <>
            <div>
              <p className="text-sm font-semibold text-muted">Your plan</p>
              <h3 className="mt-1 text-3xl font-semibold tracking-tight">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{all.length} of {APP_GROUPS.length} app groups: {names.join(", ")}.</p>
              <p className="mt-3 inline-flex items-center gap-2 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand"><SparkIcon className="size-4" /> Plus Mei AI, included</p>
              <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                <div className="flex items-center justify-between py-3"><dt className="text-muted">1 year</dt><dd className="font-semibold tabular-nums">{money(licencePrice(plan.id, "term1", currency), currency)}</dd></div>
                <div className="flex items-center justify-between py-3"><dt className="text-muted">2 years</dt><dd className="font-semibold tabular-nums">{money(licencePrice(plan.id, "term2", currency), currency)}</dd></div>
                <div className="flex items-center justify-between py-3"><dt className="text-muted">Lifetime <span className="block text-xs">includes 1 year of the server, worth {money(serverYearValue(plan.id, currency), currency)}</span></dt><dd className="font-semibold tabular-nums">{money(licencePrice(plan.id, "lifetime", currency), currency)}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-muted">Unlimited users in every plan. Before tax.{next && all.length === plan.groups ? ` One more group moves you to ${next.name}.` : ""}</p>
            </div>
            <Link href={`/contact?interest=on_prem&plan=${plan.id}&apps=${all.join(",")}`} className={buttonClass("brand", "lg", "mt-6 w-full")} data-track="plan_builder_cta">Get this plan</Link>
          </>
        ) : (
          <div>
            <p className="text-sm font-semibold text-muted">Your plan</p>
            <p className="mt-2 text-muted">Pick at least one app group to see the price.</p>
          </div>
        )}
      </div>
    </div>
  );
}
