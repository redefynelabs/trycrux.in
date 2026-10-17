/**
 * One page per product module: /product/<slug>. The text comes from features.ts so a page and the home page never
 * disagree; this file adds what a module page needs on top (its picture, its steps, who uses it).
 */
import { MODULES, type Feature } from "@/content/features";
import type { VisualKind } from "@/components/module-grid";

export interface ProductPage {
  slug: string;
  name: string;
  tagline: string;
  /** A paragraph under the headline. */
  intro: string;
  features: Feature[];
  /** The live picture; absent for Mei, which has its own demo. */
  visual?: VisualKind;
  /** Sidebar words in the app window. */
  nav: string[];
  /** What a normal use looks like, as steps. */
  steps: string[];
  /** Plain facts a buyer asks about. */
  facts: string[];
  /** Industry slugs that lean on it. */
  industries: string[];
  /** Short notices that pop over the window, as the app would raise them. */
  toasts: string[];
  /** The first plan that has it. */
  plan: "Start" | "Grow" | "Complete" | "all";
  /** Whether it is off unless asked for. */
  optional?: boolean;
}

const mod = (id: string) => MODULES.find((m) => m.id === id)!;
/** Payroll is a part of People & HR; its features are listed here because the module list holds it as one line. */
const PAYROLL: Feature[] = [
  { title: "Pay components", text: "Earnings, deductions and employer costs, each a fixed amount, a percent of basic pay, an hourly rate or a daily rate." },
  { title: "Salary structures", text: "A person's pay as dated versions, so a raise is a new version and earlier months never change." },
  { title: "A pay run each month", text: "Worked out from attendance, leave and timesheets, with unpaid days, joiners and leavers prorated for you." },
  { title: "Approval by someone else", text: "The person who prepared the run cannot approve it, and a run that would pay someone below zero is stopped." },
  { title: "Payslip PDFs", text: "A payslip with your letterhead for every person, emailed on approval and kept as calculated, whatever changes later." },
  { title: "Salary stays private", text: "People see only their own payslips. Pay never shows in the people list, exports or Mei." },
  { title: "Posts to accounting", text: "An approved run records one payroll expense, and cancelling the run removes it." },
];

export const PRODUCT_PAGES: ProductPage[] = [
  {
    toasts: ["Leave approved for Meera Iyer, 14 to 15 Oct", "Sameer Khan marked late, 41 minutes", "Attendance corrected for Arjun Mehta"],
    plan: "Grow",
    slug: "people-hr", name: "People & HR", tagline: mod("people").tagline,
    intro: "Employee records, attendance, shifts and leave on one calendar. Everything a manager needs to know who is in, who is off and who is where.",
    features: mod("people").features.filter((f) => f.title !== "Payroll and payslips"), visual: "people",
    nav: ["Dashboard", "People", "Attendance", "Shifts", "Leave", "Documents"],
    steps: ["Add people and their teams", "Set shifts and the holiday calendar", "People check in; corrections go for approval", "Leave is requested and approved", "Month-end reports are ready"],
    facts: ["Confidential documents are visible only to people you allow", "Attendance follows each person's shift and the holiday calendar", "Every correction and approval leaves a trail"],
    industries: ["clinics", "trades-and-field-service", "software-and-it"],
  },
  {
    toasts: ["Run for October calculated, 12 payslips", "Approved by Priya Nair, not the preparer", "Payslip emailed to Meera Iyer"],
    plan: "Complete",
    slug: "payroll", name: "Payroll & Payslips", tagline: "A pay run each month, approved by someone else.",
    intro: "Turn attendance, leave and timesheets into a monthly pay run and a payslip for every person, with approval and a clear record of what was paid.",
    features: PAYROLL, visual: "payroll",
    nav: ["Pay runs", "Salary structures", "Pay components", "My payslips"],
    steps: ["Set up pay components once", "Give each person a salary structure", "Create and calculate the month's run", "Someone else approves it", "Mark it paid; payslips go out by email"],
    facts: ["You enter tax and statutory deductions as components; the product does not work them out for you", "Unpaid leave, absence, joiners and leavers are prorated automatically", "An approved run posts one payroll expense to Finance"],
    industries: ["clinics", "software-and-it", "trades-and-field-service"],
  },
  {
    toasts: ["Task BRD-4 moved to Working", "Timesheet submitted, 38 hours", "Project at 72% of budget"],
    plan: "Grow",
    slug: "projects-tasks", name: "Projects & Tasks", tagline: mod("work").tagline,
    intro: "Projects with members and leads, tasks on a board, and timesheets that follow each person's shift. See who is doing what and how long it takes.",
    features: mod("work").features, visual: "tasks",
    nav: ["Projects", "Board", "My tasks", "Timesheets", "Files"],
    steps: ["Open a project for a client", "Break it into tasks and assign them", "Move work across the board", "People log time against tasks", "Compare hours with the budget"],
    facts: ["Project budgets and profit are visible only to people with finance access", "A won lead becomes a client and a project without retyping", "Statuses are yours to define"],
    industries: ["agencies", "software-and-it", "professional-services"],
  },
  {
    toasts: ["Quote QT-0021 emailed to Granite Builders", "Lead moved to Qualified", "Follow-up due today, 3 calls"],
    plan: "Start",
    slug: "crm-sales", name: "CRM & Sales", tagline: mod("crm").tagline,
    intro: "Leads, follow-ups and meetings, then quotes and orders that turn into invoices. Nothing a sale needs is typed twice.",
    features: mod("crm").features, visual: "pipeline",
    nav: ["Leads", "Clients", "Follow-ups", "Quotes", "Orders", "Products"],
    steps: ["Capture a lead and follow it up", "Move it through your stages", "Send a quote as a branded PDF", "An accepted quote becomes an order", "A fulfilled order drafts its invoice"],
    facts: ["Quotes are emailed from your own address", "Import leads from a spreadsheet with a preview first", "Meetings sync to Google or Microsoft calendars"],
    industries: ["agencies", "clinics", "distribution-and-retail"],
  },
  {
    toasts: ["Invoice INV-0044 issued", "Payment of 84,200 recorded, receipt RC-0044 sent", "Expense claim approved"],
    plan: "Start",
    slug: "finance-billing", name: "Finance & Billing", tagline: mod("finance").tagline,
    intro: "Invoices with the right tax, a receipt for every payment, expenses and bank reconciliation, with reports you can hand to your accountant.",
    features: mod("finance").features, visual: "invoices",
    nav: ["Invoices", "Receipts", "Payments", "Expenses", "Banking", "Reports"],
    steps: ["Raise an invoice from a quote or order", "Email it as a PDF", "Record the payment", "A receipt is issued with the invoice number on it", "Reconcile and report"],
    facts: ["Invoice and receipt are separate documents", "GST with CGST, SGST and IGST, VAT or sales tax", "Bill in other currencies with the rate kept"],
    industries: ["professional-services", "distribution-and-retail", "agencies"],
  },
  {
    toasts: ["Low stock: Switch 24-port", "PO-0042 received into Main warehouse", "Stock out on invoice INV-0058"],
    plan: "Complete",
    slug: "inventory-purchasing", name: "Inventory & Purchasing", tagline: mod("inventory").tagline,
    intro: "Stock across warehouses, purchase orders to vendors and goods receipt. An optional app: switch it on only if you sell or use goods.",
    features: mod("inventory").features, visual: "stock",
    nav: ["Stock", "Warehouses", "Movements", "Purchase orders", "Vendors"],
    steps: ["Add items and warehouses", "Order from a vendor", "Receive goods into stock", "Stock goes out on invoice or delivery", "Reorder when an alert arrives"],
    facts: ["Not included: manufacturing, point of sale, serial or batch numbers and delivery notes", "Cost is a weighted average", "Quantities can be fractions, such as 1.5 kg"],
    industries: ["distribution-and-retail", "trades-and-field-service"], optional: true,
  },
  {
    toasts: [],
    plan: "all",
    slug: "mei-ai", name: "Mei AI Assistant", tagline: mod("ai").tagline,
    intro: "Ask in plain words and get answers, reports and drafts from your own records, within the permissions of the person asking.",
    features: mod("ai").features, nav: [],
    steps: ["Connect your own AI key", "Choose who can use Mei", "Ask a question", "Review a draft card", "Confirm, and only then is anything created"],
    facts: ["Mei cannot issue, send, void or delete anything", "AI use is billed to you by your provider, with no mark-up", "Switch it off for anyone, at any time"],
    industries: ["professional-services", "software-and-it", "agencies"],
  },
];

export function productBySlug(slug: string): ProductPage | undefined {
  return PRODUCT_PAGES.find((p) => p.slug === slug);
}
