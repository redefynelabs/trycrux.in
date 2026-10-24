"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/buttons";
import { CurrencyPicker, Local } from "@/components/currency-picker";
import { ArrowRightIcon } from "@/components/icons";
import { NavCrmIcon, NavFinanceIcon, NavInventoryIcon, NavPayrollIcon, NavPeopleIcon, NavProjectsIcon, NavSparkIcon } from "@/components/nav-icons";
import { Logo } from "@/components/logo";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const MODULES = [
  { href: "/product/people-hr", label: "People & HR", text: "Attendance, leave, payroll", Icon: NavPeopleIcon },
  { href: "/product/projects-tasks", label: "Projects & Tasks", text: "Boards and timesheets", Icon: NavProjectsIcon },
  { href: "/product/crm-sales", label: "CRM", text: "Leads and follow-ups", Icon: NavCrmIcon },
  { href: "/product/finance-billing", label: "Accounting", text: "Estimates, invoices, expenses", Icon: NavFinanceIcon },
  { href: "/product/inventory-purchasing", label: "Inventory", text: "Products, orders and stock", Icon: NavInventoryIcon },
  { href: "/product/payroll", label: "Payroll", text: "Pay runs and payslips", Icon: NavPayrollIcon },
] as const;

const MORE = [
  { href: "/product", label: "All apps" },
  { href: "/#one", label: "Why one system" },
  { href: "/#how", label: "How it works" },
  { href: "/#control", label: "Security and control" },
  { href: "/changelog", label: "What is new" },
] as const;

const LINKS = [
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/contact", label: "Contact" },
] as const;

/** The soft highlight behind the link under the pointer. One element shared by every link, so it glides from one to the next. */
function Pill() {
  return <motion.span layoutId="nav-hover" transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} className="absolute inset-0 rounded-lg bg-soft" />;
}

/** The product menu: the modules, the places on the home page people look for, and Mei with a preview of a chat. */
function ProductMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_1.1fr] gap-2 rounded-2xl bg-bg p-2 shadow-[0_24px_60px_-20px_rgba(30,50,120,0.35)] ring-1 ring-line">
      <div className="p-2">
        <p className="px-2 pb-2 text-[11px] font-semibold tracking-widest text-muted uppercase">Modules</p>
        <ul className="grid grid-cols-2 gap-1">
          {MODULES.map(({ href, label, text, Icon }) => (
            <li key={label}>
              <Link href={href} onClick={onNavigate} className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-brand-soft to-bg text-xl text-brand shadow-xs ring-1 ring-brand/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:from-brand group-hover:to-brand group-hover:text-white group-hover:shadow-md"><Icon /></span>
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs leading-5 text-muted">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-line p-2 pl-4">
        <p className="px-2 pb-2 text-[11px] font-semibold tracking-widest text-muted uppercase">Explore</p>
        <ul>
          {MORE.map((m) => (
            <li key={m.href + m.label}>
              <Link href={m.href} onClick={onNavigate} className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-soft hover:text-fg">
                {m.label}
                <ArrowRightIcon className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/#mei" onClick={onNavigate} className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-neutral-950 p-5 text-white">
        <span aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-brand/50 blur-3xl transition-opacity group-hover:opacity-80" />
        <span className="relative">
          <span className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-7 place-items-center rounded-lg bg-brand text-base text-white"><NavSparkIcon /></span>Mei AI Assistant</span>
          <span className="mt-4 block rounded-lg bg-white/10 px-3 py-2 text-xs leading-5 text-white/90 ring-1 ring-white/10">Which invoices are overdue this month?</span>
          <span className="mt-2 block rounded-lg bg-white/5 px-3 py-2 text-xs leading-5 text-white/70 ring-1 ring-white/10"><Local>7 invoices, ₹2.4 lakh outstanding. Draft reminders?</Local></span>
        </span>
        <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">See Mei <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></span>
      </Link>
    </div>
  );
}

export function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menus remember the page they were opened on, so moving to another page closes them without an effect.
  const [productAt, setProductAt] = useState<string | null>(null);
  const [mobileAt, setMobileAt] = useState<string | null>(null);
  const product = productAt === path;
  const mobile = mobileAt === path;
  const wrap = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<string | null>(null);
  const hover = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!product && !mobile) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductAt(null);
        setMobileAt(null);
      }
    };
    const away = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setProductAt(null);
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("mousedown", away);
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("mousedown", away);
    };
  }, [product, mobile]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const openProduct = () => {
    clearTimeout(hover.current);
    setProductAt(path);
  };
  const closeProduct = () => {
    clearTimeout(hover.current);
    hover.current = setTimeout(() => setProductAt(null), 120);
  };
  const close = () => {
    setProductAt(null);
    setMobileAt(null);
  };

  const tab = "relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors hover:text-fg";

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6">
      <div ref={wrap} className={cn("relative mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl pr-2 pl-5 ring-1 backdrop-blur-xl transition-all duration-300", scrolled ? "bg-bg/90 shadow-[0_10px_34px_-12px_rgba(30,50,120,0.35)] ring-line" : "bg-bg/70 shadow-[0_8px_30px_-14px_rgba(30,50,120,0.2)] ring-line/70")}>
        <Link href="/" aria-label={`${SITE.name} home`} onClick={close} className="flex items-center justify-self-start">
          <Logo />
        </Link>

        <nav aria-label="Main" onMouseLeave={() => setHot(null)} className="hidden items-center gap-1 md:flex">
          <div onMouseEnter={() => { setHot("product"); openProduct(); }} onMouseLeave={closeProduct} onFocus={openProduct} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) closeProduct(); }}>
            <button type="button" aria-expanded={product} aria-haspopup="true" onClick={() => setProductAt(product ? null : path)} className={cn(tab, product ? "text-fg" : "text-muted")}>
              {hot === "product" && <Pill />}
              <span className="relative z-10">Product</span>
              <svg aria-hidden="true" viewBox="0 0 12 12" className={cn("relative z-10 size-3 transition-transform", product && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
            </button>
            <AnimatePresence>
              {product && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.16 }} className="absolute top-full right-0 left-0 pt-2">
                  <ProductMenu onNavigate={close} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {LINKS.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} onMouseEnter={() => setHot(n.href)} aria-current={active ? "page" : undefined} className={cn(tab, active || hot === n.href ? "text-fg" : "text-muted")}>
                {hot === n.href && <Pill />}
                <span className="relative z-10">{n.label}</span>
                {active && <motion.span layoutId="nav-active" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} className="absolute inset-x-3 -bottom-0.5 z-10 h-0.5 rounded-full bg-brand" />}
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center gap-1 justify-self-end sm:gap-2">
          <CurrencyPicker />
          <span className="hidden md:block">
            <Link href="/demo" className={buttonClass("primary", "sm", "h-9 gap-1.5 pr-3")}>
              Try for free <ArrowRightIcon className="size-3.5" />
            </Link>
          </span>
          <span className="md:hidden">
            <button type="button" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobileAt(mobile ? null : path)} className={buttonClass("outline", "sm", "gap-2")}>
              <span aria-hidden="true" className="relative block h-3 w-4 shrink-0">
                <span className={cn("absolute left-0 h-0.5 w-4 bg-fg transition-all", mobile ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cn("absolute top-1.5 left-0 h-0.5 w-4 bg-fg transition-opacity", mobile && "opacity-0")} />
                <span className={cn("absolute left-0 h-0.5 w-4 bg-fg transition-all", mobile ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
              Menu
            </button>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="mx-auto mt-2 max-h-[calc(100dvh-5.5rem)] max-w-6xl overflow-y-auto rounded-2xl bg-bg p-3 shadow-xl ring-1 ring-line md:hidden">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">Product</p>
            <ul>
              {MODULES.map(({ href, label, text, Icon }) => (
                <li key={label}>
                  <Link href={href} onClick={close} className="flex items-center gap-3 p-3 hover:bg-soft">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-brand-soft to-bg text-xl text-brand ring-1 ring-brand/15"><Icon /></span>
                    <span><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-muted">{text}</span></span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#mei" onClick={close} className="flex items-center gap-3 p-3 hover:bg-soft">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-xl text-white"><NavSparkIcon /></span>
                  <span><span className="block text-sm font-semibold">Mei AI Assistant</span><span className="block text-xs text-muted">Ask your business anything</span></span>
                </Link>
              </li>
            </ul>
            <ul className="mt-2 border-t border-line pt-2">
              {LINKS.map((n) => (
                <li key={n.href}><Link href={n.href} onClick={close} className="block px-3 py-3 text-sm font-medium hover:bg-soft">{n.label}</Link></li>
              ))}
            </ul>
            <Link href="/demo" onClick={close} className={buttonClass("brand", "lg", "mt-3 w-full")}>Try for free</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
