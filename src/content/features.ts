/** Everything the product does, by module. This is the single source for the home page and search. */
export interface Feature {
  title: string;
  text: string;
}

export interface Module {
  id: string;
  name: string;
  tagline: string;
  features: Feature[];
}

export const MODULES: Module[] = [
  {
    id: "people",
    name: "People & HR",
    tagline: "From joining day to the last working day, in one place.",
    features: [
      { title: "Employee records", text: "Profiles, employment details, departments and teams, with a photo and a clear reporting structure." },
      { title: "Confidential documents", text: "Contracts, IDs and certificates stored per employee, visible only to the people you allow." },
      { title: "Attendance", text: "Check-in and check-out, daily and monthly views, and corrections with a request and approval trail." },
      { title: "Shifts & holidays", text: "Define shifts, assign them to people, and keep a holiday calendar so working days are always right." },
      { title: "Leave management", text: "Leave types, balances and requests with approval, so nobody counts days in a spreadsheet." },
    ],
  },
  {
    id: "work",
    name: "Projects & Tasks",
    tagline: "Know who is doing what, and how long it really takes.",
    features: [
      { title: "Projects", text: "Statuses you define, members and leads, files attached to the project they belong to." },
      { title: "Task boards", text: "Tasks on a board or in a list with priorities, due dates and assignees." },
      { title: "Timesheets", text: "People log time against tasks; timesheets follow each person's shift and the holiday calendar." },
      { title: "Linked to clients", text: "A won lead becomes a client and a project without retyping anything." },
    ],
  },
  {
    id: "crm",
    name: "CRM & Sales",
    tagline: "Every lead followed up, every sale billed.",
    features: [
      { title: "Leads & pipeline", text: "Capture leads, move them through your own stages, and see what is stuck." },
      { title: "Quotes & orders", text: "Priced quotes emailed as a PDF from your own address; an accepted quote becomes an order, and a fulfilled order its invoice." },
      { title: "Product catalog", text: "Products and services with categories, prices, units and tax, added to any quote or order in one click." },
      { title: "Clients", text: "One record per client with contacts, history, projects and invoices together." },
      { title: "Follow-ups & meetings", text: "Due and overdue follow-ups with reminders, and meetings that sync to Google or Microsoft calendars." },
      { title: "Bulk import", text: "Bring leads in from a spreadsheet, check the preview, then import." },
    ],
  },
  {
    id: "finance",
    name: "Finance & Billing",
    tagline: "Quote to cash without leaving the system.",
    features: [
      { title: "Invoices & credit notes", text: "Numbered invoices with line items, discounts and taxes, ready as PDF and by email." },
      { title: "GST and tax rates", text: "Named tax rates and optional GST with CGST/SGST/IGST components on every document." },
      { title: "Multi-currency", text: "Bill in other currencies; the base-currency value is kept with the rate you used." },
      { title: "Recurring invoices", text: "Schedules that issue and email invoices on time, every time." },
      { title: "Payments & expenses", text: "Record payments against invoices, track expenses and employee expense claims with approvals." },
      { title: "Banking & reports", text: "Bank accounts and transactions with reconciliation, plus finance reports and a document archive." },
    ],
  },
  {
    id: "ai",
    name: "Mei AI Assistant",
    tagline: "Ask in plain words. Get answers and drafts from your own data.",
    features: [
      { title: "Ask anything about your business", text: "Finance, attendance, leave, sales, projects and timesheets, answered from your own records in seconds." },
      { title: "Reports on demand", text: "Profit and loss, receivables, tax summary, monthly attendance, project status and hours per project, with CSV download and print." },
      { title: "Draft invoices and clients, with your OK", text: "Mei proposes a new client, a client change or a draft invoice as an editable card. Nothing is created until you confirm, and invoices stay drafts." },
      { title: "Tax pack with its documents", text: "A ZIP for the period: tax reports as CSV plus only the invoice PDFs and expense receipts those reports contain." },
      { title: "Your choice of model", text: "Connect your own key from OpenAI, Claude, Gemini or OpenRouter, and pick the model. AI usage is billed to you by the provider." },
      { title: "Access you control", text: "Give Mei to everyone, or only to chosen people, teams and departments. Everyone else is told to contact an administrator." },
      { title: "Usage you can see", text: "Who asked, how often and how many tokens, by person, by day and by model." },
      { title: "It respects permissions", text: "Mei reads your data as the person asking, so it never shows anyone more than their role allows." },
    ],
  },
  {
    id: "platform",
    name: "Built for control",
    tagline: "The things that matter once you have more than ten people.",
    features: [
      { title: "Roles & permissions", text: "Built-in roles you can change, and fine permissions for every action, so people see only what they should." },
      { title: "Audit log", text: "Who changed what and when, for the things that matter." },
      { title: "Notifications", text: "In-app notifications and email for due work, approvals and reminders; edit every email template." },
      { title: "WhatsApp & email", text: "Send invoices and updates by email through your own mail server, and by WhatsApp through your own Meta Business account." },
      { title: "Private file storage", text: "Every file sits in a private Cloudflare R2 bucket made for your company, never shared with another customer. On your own server it is your own bucket." },
      { title: "Your data is yours", text: "Standard PostgreSQL underneath. Export everything, any time, even if you stop paying." },
    ],
  },
];

export const HIGHLIGHTS = [
  { title: "All modules, always", text: "No add-on modules and no per-user price. Every feature, including the Mei AI assistant, is in every plan." },
  { title: "AI that answers from your data", text: "Ask Mei for a report, a draft invoice or a tax pack. It reads only what you are allowed to see." },
  { title: "Running within 24 hours", text: "We set it up with you on our cloud, or install it on your own server. Either way your business runs on it within a day." },
  { title: "You own your data", text: "Export it any time. You are never locked out of your own data." },
  { title: "Try it before you talk to us", text: "A private demo with sample data, ready in seconds." },
];
