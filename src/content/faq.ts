export interface QA {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  label: string;
  items: QA[];
}

export const PRODUCT_FAQ: QA[] = [
  { q: "What is Crux?", a: "The AI-powered business operating system: the only software you need to run a company. People and HR, projects and timesheets, CRM and sales, and invoicing with taxes, all on one set of records and one login. It also includes Mei, an AI assistant that answers from your own data." },
  { q: "Which modules are included?", a: "All of them, in every plan: People & HR (records, documents, attendance, shifts, holidays, leave), Projects & Tasks (boards, timesheets), CRM & Sales (leads, clients, follow-ups, meetings, quotes, orders and a product catalog) and Finance & Billing (invoices, credit notes, recurring invoices, payments, expenses, banking and reports), plus Mei and the admin controls." },
  { q: "Does it handle my taxes and other currencies?", a: "Yes. You can define named tax rates such as VAT or sales tax on every document (and GST with CGST, SGST and IGST for India), and you can bill in other currencies while the base-currency value is kept with the rate you used." },
  { q: "Do I have to use every module?", a: "No. HR, Projects, CRM and Finance each work on their own, and features inside them can be switched on or off. Use what your team needs today and turn on more later; the records are shared when you do." },
  { q: "How quickly can we start?", a: "Within 24 hours. Talk to us, and we set up your system with you, bring in your people and clients, and set roles, so your business runs on it the next day." },
  { q: "Can I bring in the data I already have?", a: "Leads can be imported from a spreadsheet: you check a preview, nothing is imported until you confirm. For other records, tell us what you have and we will advise on the quickest way in." },
  { q: "Can I try it first?", a: "Yes. Request a demo and you get a private copy with sample data for one hour, no card and no installation. Mei, the AI assistant, answers up to 15 questions in the demo, on us." },
];

export const PRICING_GROUP_FAQ: QA[] = [
  { q: "Is there a per-user price?", a: "No. Every plan includes every feature and unlimited users. On the cloud you pay one flat monthly price for the size of your system, so it follows the capacity you need, not the number of logins." },
  { q: "What do the sizes mean?", a: "Your company gets its own private copy of the system with its own database and file bucket. A bigger size reserves more processing power and memory for it, a larger file allowance and longer backups. There is no user limit at any size; the team size shown is only a guide, and you can change size later." },
  { q: "Are there add-on modules or hidden costs?", a: "No add-on modules. The only other cost is your own AI provider's bill if you use Mei, because the AI is billed to you by that provider at their price. Prices exclude applicable taxes such as GST or VAT." },
  { q: "Do you charge for setup?", a: "Cloud setup is free, and your system is running within 24 hours. For your own server we install it with you; ask us for the current setup and training options." },
  { q: "What does a lifetime licence include?", a: "The right to run the software forever on your server, with updates for the first year. After that, updates are optional through the yearly support plan; the software never stops working." },
  { q: "What happens when a term licence ends?", a: "The term you bought is over. Renew it to keep using the software and to receive updates and support. Your data is always yours: we never delete, lock or encrypt it, and you can export it at any time." },
];

export const INTEGRATIONS_FAQ: QA[] = [
  { q: "Which tools does it connect to?", a: "Email through your own mail server, WhatsApp through your own Meta Business account, Google Calendar and Meet, Outlook and Microsoft Teams calendars, and AI through OpenAI, Claude, Gemini or OpenRouter." },
  { q: "Do emails go out from my own address?", a: "Yes. You connect your own mail server, so invoices and reminders come from your domain. Every email template can be edited, and a delivery log shows what was sent and lets you retry a failure." },
  { q: "How does WhatsApp work?", a: "You connect your own Meta Business account, so messages are sent from your number. Invoices and updates can go to clients on WhatsApp as well as by email." },
  { q: "Will meetings show in my calendar?", a: "Yes. Each person can connect their Google or Microsoft calendar, and meetings and follow-ups sync to it, with a Meet or Teams link where you want one." },
  { q: "Where are my files stored?", a: "On the cloud, in a private Cloudflare R2 bucket created for your company alone, so your files are never mixed with another customer's. On your own server, in a bucket you own, such as Cloudflare R2 or AWS S3, set up once when we install it. Confidential documents are only ever opened through short-lived links." },
  { q: "What if I need a tool that is not listed?", a: "Tell us which one and what you need it to do. Your data is standard PostgreSQL and can be exported at any time, so you are never stuck." },
];

export const SECURITY_FAQ: QA[] = [
  { q: "Who owns the data?", a: "You do. It sits in your database, on your server (or your own instance on our cloud), and you can export it whenever you like, even if you stop paying." },
  { q: "Can I control who sees what?", a: "Yes. There are built-in roles you can change, and fine permissions for every action, so people see only what their job needs. Confidential employee documents are visible only to the people you allow." },
  { q: "Is there an audit trail?", a: "Yes. The audit log records who changed what and when, for the things that matter, and approvals leave a trail too." },
  { q: "Can I run it on my own server?", a: "Yes. Buy a licence and install it on a Linux server with Docker; we install it with you. The software is the same as the cloud, and it needs no connection to us to run." },
  { q: "Can I move between cloud and my own server?", a: "Yes. Your data is a standard PostgreSQL database, and we will help you export it and set it up on your server, or the other way round." },
];

export const AI_FAQ: QA[] = [
  { q: "What is Mei?", a: "Mei is the AI assistant built into the system. You ask in plain words, for example for last month's attendance report or the invoices that are overdue, and Mei reads your records and answers. It can also draft a client or an invoice for you to confirm, and prepare a tax pack." },
  { q: "Can Mei see data I am not allowed to see?", a: "No. Mei reads your data as you, through the same permissions as the app. If your role cannot open finance, Mei cannot show you finance." },
  { q: "Can Mei change or delete my data?", a: "It cannot do so by itself. It can propose a new client, a change to a client or a draft invoice, and you see an editable card and confirm. Invoices are only ever created as drafts, and it cannot issue, send, void or delete anything." },
  { q: "Which AI models can I use?", a: "You connect your own account with OpenAI, Claude (Anthropic), Gemini (Google) or OpenRouter, and choose the model. You can connect more than one and pick a default." },
  { q: "Is my data sent to an AI company?", a: "When someone asks a question, the figures needed to answer it are sent to the provider you connected, and only that provider. Your database is never handed over, and you can switch Mei off for anyone, or for everyone, at any time." },
  { q: "Who can use Mei, and can I limit it?", a: "You decide. Give it to everyone, or only to chosen people, teams and departments. Anyone else sees a message to contact their administrator to enable it." },
  { q: "Can I see who used it and how much?", a: "Yes. A usage page shows questions, people and tokens for any period, by person, by day and by model." },
  { q: "What does Mei cost?", a: "Mei is part of every plan. The AI itself is billed to you by the provider whose key you connect, at that provider's price, with no mark-up from us." },
];

export const PRICING_FAQ: QA[] = [
  { q: "Is there a per-user price?", a: "No. Every plan includes every feature and unlimited users. On the cloud you pay one flat monthly price for the size of your system, so it follows the capacity you need, not the number of logins." },
  { q: "What do the sizes mean?", a: "Your company gets its own private copy of the system with its own database and file bucket. A bigger size reserves more processing power and memory for it, a larger file allowance and longer backups. There is no user limit at any size; the team size shown is only a guide, and you can change size later." },
  { q: "Can I move from cloud to my own server later?", a: "Yes. Your data is a standard PostgreSQL database, and we will help you export it and set it up on your server with a licence." },
  { q: "What happens when a term licence ends?", a: "The term you bought is over. Renew it to keep using the software and to receive updates and support. Your data is always yours: we never delete, lock or encrypt it, and you can export it at any time." },
  { q: "What does a lifetime licence include?", a: "The right to run the software forever on your server, with updates for the first year. After that, updates are optional through the yearly support plan; the software never stops working." },
  { q: "Who owns the data?", a: "You do. It sits in your database, on your server (or your own instance on our cloud), and you can export it whenever you like." },
  { q: "Do you charge for setup?", a: "Cloud setup is free, and your system is running within 24 hours. For your own server we install it with you; ask us for the current setup and training options." },
  { q: "Is the AI assistant included?", a: "Yes, Mei is part of every plan. You connect your own AI provider account, so the cost of the AI is billed to you by that provider, at their price." },
  { q: "Is tax included?", a: "Prices exclude applicable taxes such as GST or VAT, which are added on the invoice." },
  { q: "Which currencies can I pay in?", a: "Indian rupees, US dollars, British pounds, euros and UAE dirhams. The site shows prices in the currency for your country, and you can switch it above the plans. You are invoiced in the currency you choose, at the price shown." },
];

export const RUNNING_FAQ: QA[] = [
  { q: "Can I try it first?", a: "Yes. Request a demo and you get a private copy with sample data for one hour, no card and no installation. Mei, the AI assistant, answers up to 15 questions in the demo, on us." },
  { q: "What do I need to run it on my own server?", a: "A Linux server with Docker, 2 CPUs and 4 GB of memory to start, and a domain name. Our installer does the rest." },
  { q: "How do updates reach my server?", a: "With the yearly support plan or a current term licence you pull new releases with one command. A copy of your data is taken first, and it rolls back automatically if the new version does not start." },
  { q: "Is my data safe in the demo?", a: "A demo contains only invented sample data and is deleted after one hour. Do not enter real customer or employee information." },
];

/** What the demo page lists. */
export const GENERAL_FAQ: QA[] = RUNNING_FAQ;

/** The home page FAQ: the whole product first, then price, connections, safety and AI. */
export const FAQ_GROUPS: FaqGroup[] = [
  { id: "product", label: "Product", items: PRODUCT_FAQ },
  { id: "pricing", label: "Pricing", items: PRICING_GROUP_FAQ },
  { id: "integrations", label: "Integrations", items: INTEGRATIONS_FAQ },
  { id: "security", label: "Data and security", items: SECURITY_FAQ },
  { id: "mei", label: "Mei AI", items: AI_FAQ },
  { id: "running", label: "Running it", items: RUNNING_FAQ.filter((i) => i.q !== "Can I try it first?") },
];

/** The pricing page FAQ: price first, then the rest of what a buyer asks. */
export const PRICING_PAGE_FAQ: FaqGroup[] = [
  { id: "pricing", label: "Pricing", items: PRICING_FAQ },
  { id: "product", label: "Product", items: PRODUCT_FAQ },
  { id: "integrations", label: "Integrations", items: INTEGRATIONS_FAQ },
  { id: "security", label: "Data and security", items: SECURITY_FAQ },
  { id: "mei", label: "Mei AI", items: AI_FAQ },
];
