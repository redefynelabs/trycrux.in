// Pill buttons, as in the ERP. One place, so every call to action looks the same.
const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all select-none active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-accent text-accent-fg hover:bg-accent-hover",
  brand: "bg-brand text-white hover:opacity-90",
  outline: "border-line bg-bg shadow-xs hover:bg-soft",
  ghost: "hover:bg-soft",
  onDark: "bg-white text-neutral-950 hover:bg-white/90",
  outlineOnDark: "border-white/25 text-white hover:bg-white/10",
};

const sizes = { sm: "h-8 px-3.5 text-sm", md: "h-10 px-5 text-sm", lg: "h-12 px-7 text-base" };

export function buttonClass(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", extra = "") {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}
