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
      { title: "Payroll and payslips", text: "A salary structure for each person, a pay run each month worked out from attendance, leave and timesheets, approval by someone other than the preparer, and a payslip PDF for every person." },
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
    name: "CRM",
    tagline: "Every lead followed up, every client in one place.",
    features: [
      { title: "Leads & stages", text: "Capture leads, move them through your own stages, see what is stuck, and turn a won lead into a client." },
      { title: "Clients", text: "One record per client with contacts, history, projects or orders, estimates and invoices together." },
      { title: "Follow-ups & meetings", text: "Due and overdue follow-ups with reminders, and meetings that sync to Google or Microsoft calendars." },
      { title: "Bulk import", text: "Bring leads in from a spreadsheet, check the preview, then import." },
    ],
  },
  {
    id: "finance",
    name: "Accounting",
    tagline: "Estimate to cash without leaving the system.",
    features: [
      { title: "Estimates", text: "Priced estimates emailed as a PDF from your own address. An accepted one becomes an invoice in one step, or an order in the Goods edition." },
      { title: "Invoices & credit notes", text: "Numbered invoices with line items, discounts and taxes, ready as PDF and by email." },
      { title: "Recurring invoices", text: "Schedules that issue and email invoices on time, every time." },
      { title: "Receipts", text: "A separate receipt for every payment, with its own number and the invoice number on it, as a PDF you can email." },
      { title: "Tax rates", text: "Named tax rates on every document: VAT, sales tax, or GST with CGST, SGST and IGST components for India." },
      { title: "Multi-currency", text: "Bill in other currencies; the base-currency value is kept with the rate you used." },
      { title: "Payments & expenses", text: "Record payments against invoices, track expenses and employee expense claims with approvals." },
      { title: "Banking & reports", text: "Bank accounts and transactions with reconciliation, plus finance reports and a document archive." },
    ],
  },
  {
    id: "inventory",
    name: "Inventory & Orders",
    tagline: "Know what you sold, what you have, and what you ordered.",
    features: [
      { title: "Product catalog", text: "Products with categories, prices, units and tax, added to any estimate, order or invoice in one click." },
      { title: "Orders", text: "An accepted estimate becomes an order, or take one directly; a fulfilled order drafts its invoice." },
      { title: "Items and warehouses", text: "Stock items across one or more warehouses, with units, reorder levels and transfers between locations." },
      { title: "A movement for every change", text: "Receipts, issues, adjustments, transfers, counts and returns are all recorded and never edited, so the stock level always has an explanation." },
      { title: "Low-stock alerts", text: "A daily check notifies the right people when an item falls below its reorder level." },
      { title: "Purchase orders", text: "Order from vendors, receive goods in part or in full, and let the cost of stock update itself." },
      { title: "Cost stays private", text: "Stock cost and value are visible only to people with finance or stock-management permission." },
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
      { title: "Private file storage", text: "Every file sits in a private bucket you own, such as Cloudflare R2 or AWS S3, never shared with anyone else." },
      { title: "Your data is yours", text: "Standard PostgreSQL underneath. Export everything, any time, even if you stop paying." },
    ],
  },
];

export const HIGHLIGHTS = [
  { title: "Pay for the apps, never per user", text: "Three plans, from selling and billing to payroll and stock. Unlimited users and the Mei AI assistant are in every plan, and you move up as you grow." },
  { title: "Built for any kind of company", text: "Software and tech teams, agencies, clinics, trades, distributors and consultancies run on the same system, with the words and defaults of their trade." },
  { title: "AI that answers from your data", text: "Ask Mei for a report, a draft invoice or a tax pack. It reads only what you are allowed to see." },
  { title: "Running within 24 hours", text: "We install it on your own server with you, bring in your people and clients, and your business runs on it within a day." },
  { title: "You own your data", text: "Export it any time. You are never locked out of your own data." },
  { title: "Try it before you talk to us", text: "A private demo with sample data, ready in seconds." },
];
