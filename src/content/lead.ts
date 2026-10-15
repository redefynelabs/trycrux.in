import { CrmIcon, FinanceIcon, PeopleIcon, ProjectsIcon, SparkIcon } from "@/components/icons";

/** The choices on the demo and contact forms, and what each means. */

export const TEAM_SIZE_LABELS: Record<string, string> = { "1-10": "1 to 10", "11-25": "11 to 25", "26-100": "26 to 100", "101-300": "101 to 300", "300+": "300 or more" };

export const TIMELINE_LABELS: Record<string, string> = { now: "As soon as possible", month: "Within a month", quarter: "In the next three months", exploring: "Just exploring" };

export const FOCUS = [
  { value: "people", label: "People & HR", text: "Attendance, leave, shifts", Icon: PeopleIcon },
  { value: "projects", label: "Projects", text: "Tasks and timesheets", Icon: ProjectsIcon },
  { value: "crm", label: "CRM & Sales", text: "Leads and follow-ups", Icon: CrmIcon },
  { value: "finance", label: "Finance", text: "Invoices, GST, expenses", Icon: FinanceIcon },
  { value: "mei", label: "Mei AI", text: "Ask your data anything", Icon: SparkIcon },
] as const;

/** What to try first, by what the visitor said they want to see. */
export const TRY_FIRST: Record<string, { title: string; steps: string[]; mei: string[] }> = {
  people: {
    title: "People & HR",
    steps: ["Open Attendance and look at this month", "Request a leave as Sam, then approve it as the administrator", "Open an employee and see their documents and shift"],
    mei: ["Generate the attendance report for last month, with hours per person", "Who was late most often this month?"],
  },
  projects: {
    title: "Projects",
    steps: ["Open a project and move a task to Done", "Log time on a task in Timesheets", "Check the project's files and members"],
    mei: ["Give me a status report for each active project", "How many hours were logged per project this month?"],
  },
  crm: {
    title: "CRM & Sales",
    steps: ["Open Leads and move one through the pipeline", "Add a follow-up and see it appear for the owner", "Turn a won lead into a client"],
    mei: ["Which follow-ups are overdue and who owns them?", "Draft a new client called Lakeview Hotels, with a contact"],
  },
  finance: {
    title: "Finance",
    steps: ["Open Invoices and look at what is overdue", "Record a payment against an invoice", "Open Reports and look at profit and loss"],
    mei: ["Which invoices are overdue and who owes the most?", "Draft an invoice for Anita Desai: a monthly retainer and 12 extra hours"],
  },
  mei: {
    title: "Mei AI",
    steps: ["Open Mei AI Assistant from the button at the bottom right", "Ask a question and watch it read your data", "Ask for something to be drafted, then confirm or edit the card"],
    mei: ["Generate the attendance report for last month", "Which invoices are overdue and who owes the most?", "Prepare a tax pack for last quarter"],
  },
};
