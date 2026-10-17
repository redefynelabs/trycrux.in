/**
 * What shipped in the product, by date, newest first.
 *
 * To add an update, put an entry at the top of ENTRIES with its date (YYYY-MM-DD). Nothing else needs editing.
 */

export interface Entry {
  /** The day it shipped, YYYY-MM-DD. */
  date: string;
  /** The part of the product it belongs to. */
  area: string;
  title: string;
  text: string;
  /** The main things it added, as short lines. */
  points: string[];
}

export const ENTRIES: Entry[] = [
  {
    date: "2026-10-17", area: "People & HR", title: "Payroll, with a payslip for everyone",
    text: "A monthly pay run worked out from attendance, leave and timesheets, approved by someone other than the person who prepared it.",
    points: ["Pay components and a salary structure for each person, kept as dated versions", "A pay run each month: calculate, approve, mark paid", "Payslip PDFs with your letterhead, emailed to each person", "People see only their own payslips; salary never appears in the people list or to Mei", "An approved run posts one payroll expense to Accounting"],
  },
  {
    date: "2026-10-15", area: "Finance", title: "See what every project and product earns",
    text: "Sales now carry the project and the product all the way to the invoice, so revenue lands where it belongs.",
    points: ["Quotes and orders can name one of the client's projects, and the invoice keeps it", "Add invoice lines straight from the product catalog, with its price, unit and tax", "Revenue reports broken down by product and by product category", "A budget for each project, with budget left, revenue, expenses and profit on the project page, seen only by people with finance access", "An order that has been invoiced is locked until its invoice is voided, so orders and invoices never disagree"],
  },
  {
    date: "2026-10-15", area: "Control", title: "An audit log that names every change",
    text: "Know who changed what, and when, across the whole business.",
    points: ["Quotes, orders, products, clients, invoices, credit notes, payments and refunds are all recorded", "Employee changes and role changes, including who was given which role", "Each line names the record, such as \"Quote QT-0007 marked as accepted\"", "Filter the log by the kind of record you are looking for"],
  },
  {
    date: "2026-10-14", area: "Mei AI Assistant", title: "Mei knows the whole business",
    text: "Mei can now answer questions across sales, finance, people and the company itself, still with only the permissions you have.",
    points: ["Quotes, orders, the product catalog and sales settings", "Invoice details, payments, refunds, reimbursements and the sales and purchase registers", "Employee history, the org chart, leave types and attendance requests", "What each project earned against its budget", "Who did what, from the audit log"],
  },
  {
    date: "2026-10-13", area: "CRM & Sales", title: "From quote to invoice, without retyping a line",
    text: "CRM now covers the whole sale: price a quote, email it, turn it into an order, and let the invoice write itself when you deliver.",
    points: ["Quotes with discounts, taxes and live totals, emailed to the client as a branded PDF from your own address", "Your own quote email templates, and a history of every quote you sent", "An accepted quote becomes an order in one click, and a fulfilled order can create its draft invoice automatically", "A product and service catalog with categories, prices, units and tax, ready to drop onto any quote or order", "Sales settings for automatic billing, how long a quote stays valid and your default terms"],
  },
  {
    date: "2026-10-10", area: "Platform", title: "Use only the modules you need",
    text: "HR, Projects, CRM and Finance now stand on their own, so each team gets exactly the system it needs, with nothing in the way.",
    points: ["Run CRM without Projects, or Projects without CRM; each module works on its own", "Switch features on or off inside a module, such as quotes and orders or the product catalog", "Modules connect by themselves when both are on: a won lead opens a project, an order becomes an invoice", "Fewer menus for teams that do not need them, and the same records underneath when they do"],
  },
  {
    date: "2026-10-06", area: "Platform", title: "Version 0.3.0: cleaner screens, safer demos",
    text: "The screens people use every day are tidier, and every demo environment now belongs to one visitor.",
    points: ["Redesigned dashboard, organization profile, account, apps and AI settings pages", "A clearer employee popup with the details people look for first", "Demo environments sign each visitor in with their own email and a new password", "Mei AI assistant, interface styles, a brand colour and installable apps are all part of this release"],
  },
  {
    date: "2026-10-04", area: "Mei AI Assistant", title: "Pick the right model for the right task",
    text: "Choose which model answers each chat, right where you type. Use a fast, light model for quick questions and a stronger one for reports, and keep your AI costs down.",
    points: ["A model menu in the chat box lists the models of every provider you have connected", "Quick lookups on a small model cost a fraction of a full report on a large one", "Models show readable names and a short hint, such as fast, balanced or most capable", "Your choice is remembered on your device, and usage shows which model answered each question"],
  },
  {
    date: "2026-10-02", area: "Mei AI Assistant", title: "Mei, the AI assistant, arrives",
    text: "Ask in plain words and get answers, reports and drafts from your own data, with the same permissions you have.",
    points: ["Reports for finance, attendance, leave, sales and projects, including a monthly attendance report", "Draft clients and invoices you confirm before anything is created", "A tax pack ZIP with only the documents the reports contain", "Your own OpenAI, Claude, Gemini or OpenRouter key; choose who can use it and see usage by person"],
  },
  {
    date: "2026-09-26", area: "Control", title: "A look of your own for every organization",
    text: "Choose how the whole app looks and what it holds, and everyone in your organization sees it.",
    points: ["Eight interface styles, from Vega to Atlas, each setting corner roundness, spacing and card depth; try one on the page you are on before you save it", "Your organization's own brand colour across the app", "Install or remove HR, projects, CRM and finance per organization", "A permission matrix that shows every role against every permission", "A new sidebar with a command menu, a cleaner dashboard and profile pages, one search and filter design, and kanban cards that drag as a whole"],
  },
  {
    date: "2026-09-24", area: "Integrations", title: "Email, WhatsApp and calendar",
    text: "Connect the tools your team already uses.",
    points: ["Send invoices and reminders from Google, Outlook or your own mail server, with editable templates and a delivery log", "WhatsApp messages through your own Meta Business account", "Google and Microsoft calendars for meetings, with Meet or Teams links"],
  },
  {
    date: "2026-09-16", area: "Finance", title: "Finance reports and recurring invoices",
    text: "Close the month with reports that already add up.",
    points: ["Revenue, expenses, profit and loss, cash flow and receivables ageing", "Tax summary, sales and purchase registers and a GST return", "Recurring invoices that issue and email themselves on time", "CSV export of every report"],
  },
  {
    date: "2026-09-08", area: "Finance", title: "Payments, expenses, claims and banking",
    text: "Money in and out, recorded against the documents it belongs to.",
    points: ["Record payments and refunds against invoices", "Expenses with receipts, vendors and categories", "Employee expense claims with approval and reimbursement", "Bank accounts, transactions and reconciliation"],
  },
  {
    date: "2026-08-28", area: "Finance", title: "Invoices, credit notes and GST",
    text: "Quote to cash without leaving the system.",
    points: ["Numbered invoices and credit notes with line items, discounts and taxes", "CGST, SGST and IGST components on every document", "Multi-currency billing that keeps the rate you used", "Three PDF designs with your own accent colour"],
  },
  {
    date: "2026-08-20", area: "CRM", title: "Clients, leads, follow-ups and meetings",
    text: "Every lead followed up, nothing forgotten.",
    points: ["A lead board with stages you define", "Clients with contacts, history, projects and invoices together", "Follow-ups with reminders and overdue counts", "Import leads from a spreadsheet after checking a preview"],
  },
  {
    date: "2026-08-12", area: "Projects", title: "Timesheets",
    text: "Know how long work really takes.",
    points: ["Log time against tasks by week", "Timesheets follow each person's shift and the holiday calendar", "Submit, approve or send back", "Hours per project and per person"],
  },
  {
    date: "2026-08-04", area: "Projects", title: "Projects and task boards",
    text: "See who is doing what without chasing anyone.",
    points: ["Projects with statuses, members and leads", "Task boards and lists with priorities, due dates and assignees", "Statuses you define for projects and tasks", "Files kept with the project they belong to"],
  },
  {
    date: "2026-07-20", area: "People", title: "Shifts, holidays and attendance corrections",
    text: "Working days that are always right.",
    points: ["Define shifts and assign them to people", "A company holiday calendar", "Late and early flags judged against each person's shift", "Correction requests with an approval trail"],
  },
  {
    date: "2026-07-08", area: "People", title: "Attendance and leave",
    text: "Check in, take leave and get approval, in one place.",
    points: ["Check-in and check-out stamped by the server", "A daily roster of who is in, late or on leave", "Leave types, balances and requests with approval", "A month calendar of hours worked"],
  },
  {
    date: "2026-06-24", area: "People", title: "Departments, teams and the org chart",
    text: "Structure that matches how the company is organised.",
    points: ["Departments with heads and teams with leads", "Move people between teams", "An org chart of who reports to whom"],
  },
  {
    date: "2026-06-15", area: "People", title: "Employees",
    text: "From joining day to the last working day.",
    points: ["An employee directory with search and filters", "Profiles with photo, employment type and status", "Employment lifecycle: probation, resignation and exit", "Invite people and assign roles"],
  },
  {
    date: "2026-06-10", area: "Organization", title: "Organization settings",
    text: "Tell the system who you are and how you work.",
    points: ["Company profile, legal name, tax ID and logo", "Office locations and addresses", "Currencies, with a default for billing", "Time zone for attendance and reports"],
  },
  {
    date: "2026-06-03", area: "Platform", title: "Accounts, sign-in and roles",
    text: "The foundation: secure access, with people seeing only what they should.",
    points: ["Sign-in with sessions that renew safely", "Built-in roles you can change", "A permission for every action", "Password rules and forced changes"],
  },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** The entries, newest first. Entries whose date is malformed are left out. */
export function sortedEntries(entries: readonly Entry[]): Entry[] {
  return entries
    .filter((e) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(e.date))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** A date as "Jun 10". */
export function dayLabel(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${MONTHS[m - 1].slice(0, 3)} ${d}`;
}

/** A date as "June 10, 2026". */
export function longDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** The month a date falls in, as "October 2026". */
export function monthLabel(date: string): string {
  const [y, m] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
