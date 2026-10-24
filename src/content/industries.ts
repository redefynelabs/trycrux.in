import type { VisualKind } from "@/components/module-grid";
import type { Edition } from "@/content/pricing";

/**
 * Industry pages: who Crux fits and how it is set up for them. Every claim here is something the product does today.
 * The starting templates (agency, clinic, trades, wholesale) come from the ERP; the others use the same apps with the
 * default words. Each industry runs on one edition: services firms on Services, traders on Goods. Add an industry by adding an entry; the pages, sitemap and llms.txt follow.
 */
export interface Industry {
  slug: string;
  name: string;
  /** One line for the card. */
  short: string;
  /** The page headline. */
  headline: string;
  intro: string;
  /** Words the product uses for this trade, when it starts with its own. */
  words?: { generic: string; used: string }[];
  /** The edition it runs on. */
  edition: Edition;
  /** Apps switched on to begin with. */
  apps: string[];
  /** Problems this trade has and how the product answers them. */
  fits: { title: string; text: string }[];
  /** A normal week, as steps. */
  flow: string[];
  /** Things the buyer should know it does not do. */
  notes?: string[];
  /** Starting template in the product, if any. */
  template?: string;
  /** The live picture shown in the window on the page. */
  visual: VisualKind;
  /** The sidebar of that window, in the trade's own words. */
  nav: string[];
  /** A few numbers the trade cares about, shown over the hero. */
  stats: { value: string; label: string }[];
  /** Product page slugs it leans on. */
  modules: string[];
  /** The plan that usually fits, and why. */
  plan: { id: "Start" | "Grow" | "Complete"; why: string };
  /** The live scene on the page: a piece of work moving through the system, one card per stage. */
  scene: SceneStage[];
}

export interface SceneStage {
  stage: string;
  title: string;
  detail: string;
  /** What changed in the system at this stage, e.g. "Invoice INV-0031 drafted". */
  result: string;
}

type Core = Omit<Industry, "visual" | "nav" | "stats" | "modules" | "scene" | "plan">;

/** The picture, sidebar words, figures and modules for each industry, by slug. */
const LOOK: Record<string, Pick<Industry, "visual" | "nav" | "stats" | "modules" | "scene" | "plan">> = {
  "software-and-it": { visual: "tasks", nav: ["Projects", "Sprint board", "Timesheets", "Invoices", "People", "Payroll"], stats: [{ value: "1", label: "record from lead to invoice" }, { value: "0", label: "per-user fees" }, { value: "Monthly", label: "payroll from real hours" }], modules: ["projects-tasks", "crm-sales", "finance-billing", "payroll"], plan: { id: "Complete", why: "Projects, people and payroll from real hours." }, scene: [{ stage: "Lead", title: "Northwind Labs", detail: "Wants a mobile app built in 3 months", result: "Lead moved to Qualified" },{ stage: "Estimate", title: "Estimate QT-0021", detail: "Build and launch \u00b7 2 designers, 3 engineers", result: "Estimate emailed as a branded PDF" },{ stage: "Project", title: "Northwind app", detail: "12 tasks assigned across 5 people", result: "Project and client created from the won lead" },{ stage: "Timesheets", title: "Week 14", detail: "212 hours logged against tasks", result: "Hours counted against the budget" },{ stage: "Invoice", title: "INV-0044", detail: "Milestone 1 \u00b7 40% of the estimate", result: "Invoice issued, receipt follows the payment" }] },
  agencies: { visual: "pipeline", nav: ["Clients", "Leads", "Projects", "Timesheets", "Estimates", "Invoices"], stats: [{ value: "Pitch", label: "to payment, one flow" }, { value: "Hours", label: "against every budget" }, { value: "Retainers", label: "invoiced on time" }], modules: ["crm-sales", "projects-tasks", "finance-billing"], plan: { id: "Grow", why: "Clients, projects, timesheets and billing. Add payroll by moving to Complete." }, scene: [{ stage: "Enquiry", title: "Lumen Studio", detail: "Brand refresh and a new website", result: "Enquiry captured and followed up" },{ stage: "Estimate", title: "Brand refresh", detail: "Estimate sent \u00b7 accepted this week", result: "Lead won, client created" },{ stage: "Project", title: "Lumen website", detail: "Design, build and review tasks", result: "Project opened for the new client" },{ stage: "Timesheets", title: "This week", detail: "46 hours across design and build", result: "Hours against the project budget" },{ stage: "Retainer", title: "INV-0112", detail: "Monthly retainer \u00b7 issued and emailed", result: "Recurring invoice sent, receipt on payment" }] },
  clinics: { visual: "people", nav: ["Patients", "Cases", "Enquiries", "Shifts", "Invoices", "Payroll"], stats: [{ value: "Patients", label: "not clients, in every screen" }, { value: "Managers", label: "only see sensitive fields" }, { value: "Shifts", label: "for every role on the rota" }], modules: ["crm-sales", "projects-tasks", "people-hr", "finance-billing", "payroll"], plan: { id: "Complete", why: "Patients, cases and billing, staff shifts and monthly payroll." }, scene: [{ stage: "Enquiry", title: "Ananya Rao", detail: "Asked about a dental check-up", result: "Enquiry followed up by phone" },{ stage: "Patient", title: "Ananya Rao", detail: "First visit booked for Thursday", result: "Patient record created" },{ stage: "Case", title: "Case C-014", detail: "Check-up and scaling \u00b7 assigned to Dr. Shah", result: "Case opened for the visit" },{ stage: "Visit", title: "Case C-014", detail: "Three sessions agreed with the patient", result: "Case moved to In treatment" },{ stage: "Billing", title: "INV-0031", detail: "Visit billed, receipt RC-0031 handed over", result: "Invoice and receipt issued" }] },
  "trades-and-field-service": { visual: "tasks", nav: ["Customers", "Enquiries", "Jobs", "Quotes", "Invoices", "Shifts"], stats: [{ value: "Jobs", label: "from booking to invoice" }, { value: "Quotes", label: "accepted and billed in one step" }, { value: "Crews", label: "on shifts and timesheets" }], modules: ["projects-tasks", "crm-sales", "finance-billing", "payroll"], plan: { id: "Complete", why: "Jobs and billing, crew shifts and payroll." }, scene: [{ stage: "Enquiry", title: "Orchard Foods", detail: "Cold room fan not running", result: "Enquiry logged with site notes" },{ stage: "Quote", title: "Quote QT-0033", detail: "Replace fan motor \u00b7 parts and labour", result: "Quote accepted by the customer" },{ stage: "Job", title: "Orchard cold room", detail: "Crew of two booked for Friday", result: "Job created with the site details" },{ stage: "On site", title: "Friday", detail: "6 hours logged, fan motor fitted", result: "Job moved to Invoiced" },{ stage: "Invoice", title: "INV-0058", detail: "The accepted quote, parts and labour", result: "Invoice issued, receipt on payment" }] },
  "distribution-and-retail": { visual: "stock", nav: ["Products", "Sales orders", "Stock", "Warehouses", "Purchase orders", "Invoices"], stats: [{ value: "Every", label: "stock change explained" }, { value: "Low", label: "stock alerts each day" }, { value: "GST/VAT", label: "on every document" }], modules: ["inventory-purchasing", "crm-sales", "finance-billing"], plan: { id: "Grow", why: "Products, orders, stock and purchasing linked to invoices. Add payroll by moving to Complete." }, scene: [{ stage: "Reorder", title: "Switch 24-port", detail: "9 left, reorder level is 8", result: "Low-stock alert raised" },{ stage: "Purchase order", title: "PO-0042", detail: "20 units from Apex Networks", result: "Purchase order sent to the vendor" },{ stage: "Receive", title: "PO-0042", detail: "20 units received into Main warehouse", result: "Stock and average cost updated" },{ stage: "Sell", title: "Order SO-0107", detail: "6 units to Harbor Logistics", result: "Order confirmed against stock" },{ stage: "Invoice", title: "INV-0066", detail: "Stock out on invoice \u00b7 GST applied", result: "Invoice issued, receipt on payment" }] },
  "professional-services": { visual: "invoices", nav: ["Clients", "Engagements", "Timesheets", "Invoices", "Receipts", "Reports"], stats: [{ value: "One", label: "record per client" }, { value: "Private", label: "client documents" }, { value: "Trail", label: "for every approval" }], modules: ["crm-sales", "projects-tasks", "finance-billing", "mei-ai"], plan: { id: "Grow", why: "Clients, engagements, timesheets and billing." }, scene: [{ stage: "Estimate", title: "Estimate QT-0018", detail: "Annual advisory engagement \u00b7 fixed fee", result: "Estimate accepted by the client" },{ stage: "Engagement", title: "Cedar Wellness", detail: "Project opened, team of three assigned", result: "Client and project linked" },{ stage: "Time", title: "This month", detail: "58 hours logged against the engagement", result: "Hours against the budget" },{ stage: "Invoice", title: "INV-0075", detail: "Fixed fee plus approved expenses", result: "Invoice emailed as a PDF" },{ stage: "Receipt", title: "RC-0075", detail: "Payment recorded, invoice INV-0075 shown", result: "Receipt issued and filed" }] },
};

const CORE: Core[] = [
  {
    slug: "software-and-it",
    name: "Software and IT companies",
    short: "Projects, timesheets, recurring billing and payroll for product and services teams.",
    headline: "Run a software or IT company on one system",
    intro: "Product studios, IT services firms and SaaS teams juggle sprints, client retainers and a payroll that follows who worked when. Crux keeps projects, hours, invoices and people on one set of records.",
    edition: "services",
    apps: ["CRM", "Projects & Tasks", "Accounting", "People & HR", "Payroll"],
    fits: [
      { title: "Hours that become invoices", text: "People log time against tasks, timesheets follow each person's shift and holidays, and project budgets show what is left against what has been billed." },
      { title: "Retainers and subscriptions", text: "Recurring invoices issue and email themselves on schedule, with a receipt for every payment that carries the invoice number." },
      { title: "From lead to project", text: "A won lead becomes a client and a project without retyping, so delivery starts with the context sales gathered." },
      { title: "Remote and shifting teams", text: "Attendance, leave and shifts for people across locations, with approvals and an audit trail." },
      { title: "Payroll from real attendance", text: "A monthly pay run worked out from attendance, leave and timesheets, approved by someone other than the preparer, with a payslip for everyone." },
      { title: "Money that stays private", text: "Project budgets, prices and salaries are shown only to people with the permission, never just because they manage a team." },
    ],
    flow: ["A lead is qualified and an estimate is emailed as a branded PDF", "The client accepts it and the project opens", "The team logs time on tasks", "The estimate becomes an invoice and a receipt follows each payment", "At month end the pay run is calculated and approved"],
  },
  {
    slug: "agencies",
    name: "Agencies and studios",
    short: "Clients, projects, timesheets and billing for creative, marketing and consulting teams.",
    headline: "An agency system that follows the work from pitch to payment",
    intro: "Agencies live on clients, projects and billable hours. Crux starts with the words and defaults of agency work, a budget range on every lead and a review step on projects.",
    template: "agency",
    edition: "services",
    words: [
      { generic: "Client", used: "Clients" },
      { generic: "Estimate", used: "Estimates" },
      { generic: "Project", used: "Projects" },
    ],
    apps: ["CRM", "Projects & Tasks", "Accounting", "People & HR"],
    fits: [
      { title: "Leads for every pitch", text: "Leads move through your own stages and become a client and a project when won." },
      { title: "Estimates clients can accept", text: "Priced estimates with discounts and tax, emailed from your own address; an accepted estimate becomes an invoice in one step." },
      { title: "Timesheets by project", text: "See hours per person and per project, and compare them with the project budget." },
      { title: "Retainers on a schedule", text: "Recurring invoices for monthly retainers, emailed on time with receipts for payments." },
      { title: "Client files in one place", text: "Documents sit with the client and the project they belong to, in a private bucket made for your company." },
      { title: "See what a project earns", text: "Revenue, expenses and profit against the project budget, visible only to people you allow." },
    ],
    flow: ["Capture an enquiry and follow it up", "Send an estimate and win the work", "Plan the project and assign tasks", "Track time and review work", "Invoice, record the payment, send the receipt"],
  },
  {
    slug: "clinics",
    name: "Clinics and wellness centres",
    short: "Patients, visits, treatment plans, staff shifts and billing.",
    headline: "A clinic system built around patients and visits",
    intro: "Clinics, dental practices and wellness centres need patients, appointments, a visit flow and staff rosters. Crux starts with patient words, details only managers see, and a visit flow for cases.",
    template: "clinic",
    edition: "services",
    words: [
      { generic: "Client", used: "Patients" },
      { generic: "Lead", used: "Enquiries" },
      { generic: "Project", used: "Cases" },
    ],
    apps: ["CRM", "Projects & Tasks", "Accounting", "People & HR", "Payroll"],
    fits: [
      { title: "Patients, not clients", text: "The whole product speaks your language: Patients, Cases and Enquiries." },
      { title: "A visit flow for every case", text: "Cases move through the steps of a visit, with tasks for the people involved." },
      { title: "Details only the right people see", text: "Patient fields marked for managers stay hidden from everyone else." },
      { title: "Shifts, attendance and leave", text: "Rosters for doctors, nurses and front desk, with leave approvals and holidays." },
      { title: "Invoices, receipts and payroll", text: "Bill a visit, hand over a receipt, and run monthly payroll with payslips for staff." },
      { title: "Follow-ups that happen", text: "Reminders for follow-up calls and return visits, so patients are not forgotten." },
    ],
    flow: ["An enquiry becomes a patient", "A case is opened for the visit", "The treatment is agreed on the case", "The invoice is issued and the receipt handed over", "Follow-ups are scheduled"],
    notes: ["Crux is a business system, not clinical software. It does not store medical records or prescriptions."],
  },
  {
    slug: "trades-and-field-service",
    name: "Trades and field service",
    short: "Customers, jobs, quotes, crews and billing for electricians, installers and repair teams.",
    headline: "Jobs, crews and billing in one place",
    intro: "Contractors and field service teams quote a job, send a crew and invoice when it is done. Crux starts with Customers, Jobs and Quotes, site details on every record and a job flow from booking to invoice.",
    template: "trades",
    edition: "services",
    words: [
      { generic: "Client", used: "Customers" },
      { generic: "Project", used: "Jobs" },
      { generic: "Lead", used: "Enquiries" },
      { generic: "Estimate", used: "Quotes" },
    ],
    apps: ["CRM", "Projects & Tasks", "Accounting", "People & HR", "Payroll"],
    fits: [
      { title: "A job flow from booking to invoice", text: "Jobs move from booked to scheduled, on site and invoiced, with tasks for the crew." },
      { title: "Site details on customers and jobs", text: "Extra fields for access notes, site address and permit numbers travel with the record." },
      { title: "Quotes that become invoices", text: "Parts and labour on a quote the customer accepts, billed in one step when the job is done." },
      { title: "Crews on shifts", text: "Shifts, timesheets and payroll that follows hours worked, with payslips." },
      { title: "Recurring service contracts", text: "Maintenance plans billed on schedule with recurring invoices." },
      { title: "Follow-ups that happen", text: "Reminders to call back about a quote or book the next service visit." },
    ],
    flow: ["A customer calls and a quote is sent", "The accepted quote becomes a job", "The crew is booked and logs its time", "The job is done and the quote becomes the invoice", "Payment is recorded and a receipt is issued"],
    notes: ["Parts are billed as invoice lines. Stock and purchasing are in the Goods edition."],
  },
  {
    slug: "distribution-and-retail",
    name: "Distributors and retailers",
    short: "Products, sales orders, stock, purchase orders and invoices for businesses that sell goods.",
    headline: "Know what you have before you promise it",
    intro: "Wholesalers, distributors and shops sell things they have to buy first. Crux ties purchase orders, stock levels, quotations, sales orders and invoices together, so the number on the shelf and the number on the invoice agree.",
    template: "wholesale",
    edition: "goods",
    words: [
      { generic: "Client", used: "Customers" },
      { generic: "Estimate", used: "Quotations" },
      { generic: "Order", used: "Sales orders" },
    ],
    apps: ["Inventory & Orders", "CRM", "Accounting", "People & HR"],
    fits: [
      { title: "Stock with a history", text: "Every receipt, sale, adjustment, transfer and count is a movement that is never edited, so each level has an explanation." },
      { title: "Several warehouses", text: "Keep stock in more than one place and transfer between them." },
      { title: "Low-stock alerts", text: "A daily check tells the right people when an item falls below its reorder level." },
      { title: "Purchase orders and receiving", text: "Order from vendors, receive in part or in full, and keep the average cost current." },
      { title: "Sales that know your stock", text: "Product pickers on quotations, orders and invoices warn when you are short." },
      { title: "GST or VAT, and receipts", text: "Named tax rates on every document, multi-currency billing, and a separate receipt for every payment." },
    ],
    flow: ["Order stock from a vendor", "Receive it into a warehouse", "Send a quotation and take the sales order", "Stock goes out on invoice or delivery", "Reorder when the alert arrives"],
    notes: ["Not included: manufacturing, point of sale, serial or batch numbers and delivery notes."],
  },
  {
    slug: "professional-services",
    name: "Consultancies and professional firms",
    short: "Engagements, time, client billing and staff management for advisers, accountants and law firms.",
    headline: "Engagements, time and billing without the spreadsheets",
    intro: "Advisory firms sell expertise by the hour or by the engagement. Crux tracks the client, the engagement as a project, the time spent and the invoice that follows.",
    edition: "services",
    apps: ["CRM", "Projects & Tasks", "Accounting", "People & HR"],
    fits: [
      { title: "One record per client", text: "Contacts, history, projects, documents and invoices together." },
      { title: "Confidential documents", text: "Engagement letters and client papers are visible only to the people you name." },
      { title: "Time against engagements", text: "Timesheets by person and project, against a budget." },
      { title: "Fixed fees and retainers", text: "Recurring invoices for retainers, and estimates for fixed-fee work that become invoices once accepted." },
      { title: "Approvals and a trail", text: "Expense claims, leave and payroll need approval, and the audit log shows who changed what." },
      { title: "Mei for quick answers", text: "Ask which invoices are overdue or how many hours a project used, answered from your data within your permissions." },
    ],
    flow: ["Win the engagement with an estimate", "Open the project and assign the team", "Log time and expenses", "Invoice and record payment", "Issue the receipt"],
  },
];

export const INDUSTRIES: Industry[] = CORE.map((c) => ({ ...c, ...LOOK[c.slug] }));

export function industryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
