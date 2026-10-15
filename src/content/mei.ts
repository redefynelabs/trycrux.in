/** What Mei, the AI assistant, does: the words on the home page and the FAQ come from here. */

export interface Capability {
  title: string;
  text: string;
}

export const CAPABILITIES: Capability[] = [
  { title: "Ask in plain words", text: "No filters, no report builder. Ask a question the way you would ask a colleague and get the answer, with the figures behind it." },
  { title: "Reports on demand", text: "Monthly attendance, profit and loss, receivables, tax summary, project status, timesheet hours. Download any answer as CSV or print it as a PDF." },
  { title: "Acts only with your OK", text: "Mei can propose a new client or a draft invoice. You see a card, edit anything, and confirm. Nothing is created until you do, and invoices stay drafts." },
  { title: "A tax pack with only what is needed", text: "One ZIP for the period: the tax reports as CSV plus the invoice PDFs and expense receipts those reports are made of. Nothing extra." },
  { title: "You choose who gets it", text: "Give Mei to everyone, or only to chosen people, teams and departments. Anyone else is told to contact their administrator." },
  { title: "See who used it and how much", text: "Questions, people and tokens for any period, by person and by model, so there are no surprises on the provider's bill." },
];

export const TRUST: Capability[] = [
  { title: "It sees only what you can see", text: "Mei reads your data as you, through the same permissions as the app. If your role cannot open finance, neither can Mei for you." },
  { title: "Your own AI account", text: "Connect your own key from OpenAI, Claude, Gemini or OpenRouter. AI usage is billed to you by the provider, at their price, with no mark-up." },
  { title: "Nothing changes by surprise", text: "Every change goes through a confirmation you can edit, and is made as you, with the same checks as doing it by hand." },
];

export const PROVIDERS = [
  { name: "OpenAI", src: "/icons/openai.svg" },
  { name: "Claude", src: "/icons/claude.svg" },
  { name: "Gemini", src: "/icons/gemini.svg" },
  { name: "OpenRouter", src: "" },
] as const;

/** The one screen of Mei shown on the site, captured from the running product on the demo company. */
export const MEI_SHOTS = {
  attendance: { src: "/shots/mei-attendance.jpg", alt: "Mei answering a request for last month's attendance report, with a table of days present, late and absent and hours worked for each employee" },
} as const;

export const DEMO = [
  {
    id: "attendance",
    label: "Attendance report",
    question: "Generate the attendance report for September, with hours per person",
    reading: ["Attendance records", "Holiday calendar", "Shifts"],
    intro: "Here is September for the whole company. There were 22 working days after 1 public holiday, and 12 people on the roster.",
    head: ["Employee", "Present", "Late", "Absent", "Hours"],
    rows: [
      ["Aiko Tanaka", "15", "1", "7", "133:30"],
      ["Ben Walker", "15", "0", "7", "132:45"],
      ["Liam Carter", "15", "4", "7", "131:15"],
      ["Meera Iyer", "14", "2", "8", "128:40"],
      ["Alex Morgan", "14", "1", "8", "125:18"],
      ["Nadia Hussain", "13", "0", "9", "119:05"],
    ],
    points: ["1,474 hours worked in all, 6% fewer than August.", "Liam Carter was late 4 times, the most this month.", "Nadia Hussain has 2 unapproved absences; both are waiting for a correction request."],
    note: "Download as CSV, print as a PDF, or ask me to break it down by team.",
  },
  {
    id: "overdue",
    label: "Overdue invoices",
    question: "Which invoices are overdue, who owes the most, and what should I chase first?",
    reading: ["Receivables ageing", "Invoices", "Payment history"],
    intro: "6 invoices are overdue, ₹2,88,381.50 in all, which is 31% of everything outstanding. The largest balances:",
    head: ["Client", "Invoice", "Balance due", "Days late"],
    rows: [
      ["Anita Desai", "INV-0004", "₹84,200.00", "41"],
      ["Granite Builders", "INV-0002", "₹66,150.00", "27"],
      ["Lumen Studio", "INV-0005", "₹52,030.50", "12"],
      ["Cedar Wellness", "INV-0006", "₹48,000.00", "9"],
      ["Summit Fitness", "INV-0007", "₹38,001.00", "4"],
    ],
    points: ["Anita Desai is 41 days late and has paid late twice before, so start there.", "Granite Builders usually pays within 3 days of a reminder.", "Collecting the top three would bring receivables down by ₹2,02,380.50."],
    note: "Want me to draft a reminder to each of them? You will see every message before it goes.",
  },
  {
    id: "invoice",
    label: "Draft an invoice",
    question: "Draft an invoice for Anita Desai: October retainer and 12 extra design hours, with GST",
    reading: ["Clients", "Tax rates", "Last invoice"],
    intro: "I have prepared a draft from her last invoice and your 18% GST rate. Check the lines, change anything you like, then confirm. Nothing is created until you do.",
    head: [],
    rows: [
      ["Monthly retainer, October", "1", "₹45,000.00"],
      ["Extra design hours", "12", "₹42,000.00"],
      ["GST at 18%", "", "₹15,660.00"],
    ],
    points: ["Total ₹1,02,660.00, due in 15 days, the same terms as her last invoice.", "The invoice stays a draft until you issue it."],
    note: "Before tax: ₹87,000.00",
  },
] as const;
