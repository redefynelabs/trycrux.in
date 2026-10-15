import { buttonClass } from "@/components/buttons";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-2xl border border-line bg-soft/60 px-4 py-2.5 text-base text-fg transition-colors placeholder:text-muted/70 focus:border-brand focus:bg-bg focus:outline-none focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-bad";

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  // The hint and the error sit outside the <label>, so the field's accessible name is just its label.
  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{label}</span>
        {children}
      </label>
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-bad">
          {error}
        </span>
      )}
    </div>
  );
}

export function TextInput({ invalid, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} aria-invalid={invalid || undefined} className={base} />;
}

export function TextArea({ invalid, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea {...props} aria-invalid={invalid || undefined} className={base} />;
}

/** A field only a bot fills in: hidden from people and from assistive technology. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function Button({ children, disabled, type = "submit" }: { children: ReactNode; disabled?: boolean; type?: "submit" | "button" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClass("primary", "lg", "w-full")}
    >
      {children}
    </button>
  );
}

/** A set of pills, one of which can be chosen; choosing the same one again clears it when `clearable`. */
export function Pills<T extends string>({ label, value, onChange, options, clearable = true }: { label: string; value: T | ""; onChange: (v: T | "") => void; options: { value: T; label: string }[]; clearable?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange(on && clearable ? "" : o.value)} className={cn("rounded-full px-4 py-2 text-sm font-medium transition-colors", on ? "bg-accent text-white" : "bg-soft text-muted ring-1 ring-line hover:text-fg")}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Square cards, one of which can be chosen. */
/** `dense` puts the cards side by side on phones too, as an icon and a name, with the line of text from sm up. */
export function ChoiceCards<T extends string>({ label, value, onChange, options, columns = "sm:grid-cols-3", clearable = false, dense = false }: { label: string; value: T | ""; onChange: (v: T | "") => void; options: { value: T; label: string; text: string; icon?: ReactNode }[]; columns?: string; clearable?: boolean; dense?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("grid gap-2", columns)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange(on && clearable ? "" : o.value)} className={cn("flex items-start gap-3 p-3.5 text-left ring-1 transition-colors", dense && "max-sm:flex-col max-sm:items-center max-sm:gap-2 max-sm:p-3 max-sm:text-center", on ? "bg-brand-soft ring-2 ring-brand" : "bg-bg ring-line hover:bg-soft")}>
            {o.icon && <span className={cn("grid size-9 shrink-0 place-items-center text-lg", on ? "bg-brand text-white" : "bg-soft text-brand")}>{o.icon}</span>}
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{o.label}</span>
              <span className={cn("block text-xs text-muted", dense && "max-sm:hidden")}>{o.text}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
