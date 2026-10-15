import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);

/** What the demo form sends. The control plane checks it again; this keeps junk from being forwarded. */
export const TEAM_SIZES = ["1-10", "11-25", "26-100", "101-300", "300+"] as const;
export const FOCUSES = ["people", "projects", "crm", "finance", "mei"] as const;
export const TIMELINES = ["now", "month", "quarter", "exploring"] as const;

export const demoSchema = z.object({
  name: text(120).min(1, "Enter your name"),
  email: text(254).min(1, "Enter your email address").email("Enter a valid email address"),
  phone: text(40)
    .min(1, "Enter a contact number")
    .refine((v) => /^[+(]?[0-9][0-9\s().-]{6,}$/.test(v) && v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 15, "Enter a valid phone number"),
  company: text(160).optional().default(""),
  team_size: z.enum(TEAM_SIZES).or(z.literal("")).optional().default(""),
  focus: z.enum(FOCUSES).or(z.literal("")).optional().default(""),
  website: z.string().max(200).optional().default(""), // honeypot
  captcha_token: z.string().max(4096).optional().default(""),
  attribution: z.record(z.string().max(60), z.string().max(300)).optional().default({}),
});

export const INTERESTS = [
  { value: "cloud", label: "Cloud hosting (we run it for you)", short: "Cloud", text: "We host and look after it for you" },
  { value: "on_prem", label: "On our own server (one-time licence)", short: "Own server", text: "A licence, on your own server" },
  { value: "other", label: "Something else", short: "Something else", text: "Larger teams, moving data, or a question" },
] as const;

// The control plane rejects fields it does not know, so the demo form's "focus" is left out here.
export const contactSchema = demoSchema.omit({ focus: true }).extend({
  interest: z.enum(["cloud", "on_prem", "other"]).optional().default("other"),
  plan: z.enum(["small", "business", "larger"]).or(z.literal("")).optional().default(""),
  timeline: z.enum(TIMELINES).or(z.literal("")).optional().default(""),
  message: text(2000).min(1, "Write a short message"),
});

export type DemoInput = z.input<typeof demoSchema>;
export type ContactInput = z.input<typeof contactSchema>;

/** Field errors the control plane or the proxy sends, by field name. */
export type FieldErrors = Record<string, string>;
