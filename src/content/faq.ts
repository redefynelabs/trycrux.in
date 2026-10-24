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
  { q: "What is Crux?", a: "The AI-powered business operating system: the only software you need to run a company. It comes in two editions: Services, for firms that sell their time (clients, projects and timesheets), and Goods, for businesses that sell products (orders, stock and purchasing). Both have CRM, People & HR, payroll and accounting with estimates and invoices, all on one set of records and one login. It also includes Mei, an AI assistant that answers from your own data." },
  { q: "Which modules are included?", a: "First pick your edition. The Services edition has CRM, Accounting, Projects & tasks, People & HR and Payroll; the Goods edition has CRM, Accounting, Inventory & orders, People & HR and Payroll. Start takes any two of your edition's five app groups, Grow any four and Complete all five. Mei the AI assistant, roles, the audit log and unlimited users are in every plan, on top of them." },
  { q: "Why two editions?", a: "A firm that sells its time and a business that sells products work differently: one runs projects and timesheets, the other orders and stock. Each edition shows only the screens its kind of business uses, so teams learn it faster and nothing gets in the way. If what you sell changes, we move you to the other edition and your records stay." },
  { q: "Does it handle my taxes and other currencies?", a: "Yes. You can define named tax rates such as VAT or sales tax on every document (and GST with CGST, SGST and IGST for India), and you can bill in other currencies while the base-currency value is kept with the rate you used." },
  { q: "We only need CRM, inventory and HR. Can we pay for just those?", a: "Yes. Choose the Goods edition in the plan builder on the pricing page and tick those app groups. Three groups fit the Grow plan, which takes any four. Payroll needs People & HR, so choosing Payroll adds it." },
  { q: "Do I have to use every module?", a: "No. You choose the app groups your team needs, for example only CRM, Accounting and People & HR, and we switch on just those. Each feature inside an app can be switched on or off too. Change the mix whenever you like; the records are shared, so nothing is retyped." },
  { q: "Is it only for certain kinds of company?", a: "No. Software and tech companies, agencies, clinics, trades and field service, distributors and consultancies all run on it. We start you with the words and defaults of your trade, for example Patients and Cases for a clinic, or Customers and Jobs for field service. Most run on the Services edition; distributors and traders run on the Goods edition. See the industries page." },
  { q: "Does it do payroll?", a: "Yes. You set up pay components and a salary structure for each person, run a pay run each month from attendance, leave and timesheets, have it approved by someone other than the person who prepared it, and give everyone a payslip. Tax and statutory deductions are not worked out for you yet: your accountant enters them as components." },
  { q: "How quickly can we start?", a: "Within 24 hours. Talk to us, and we set up your system with you, bring in your people and clients, and set roles, so your business runs on it the next day." },
  { q: "Can I bring in the data I already have?", a: "Leads can be imported from a spreadsheet: you check a preview, nothing is imported until you confirm. For other records, tell us what you have and we will advise on the quickest way in." },
  { q: "Can I try it first?", a: "Yes. Request a demo and you get a private copy with sample data for one hour, no card and no installation. Mei, the AI assistant, answers up to 15 questions in the demo, on us." },
];

export const PRICING_GROUP_FAQ: QA[] = [
  { q: "Is there a per-user price?", a: "No. Every plan has unlimited users. You pay for the plan, which follows how many app groups you pick and the capacity they need, not for the number of logins." },
  { q: "What do the sizes mean?", a: "A plan is how many app groups you pick: any two on Start, any four on Grow, all five of your edition on Complete. Users are never counted, so the only limit on how many people use it is your own server. Our guide: a server with 2 CPUs and 4 GB of memory runs 50 people comfortably." },
  { q: "Are there add-on modules or hidden costs?", a: "No add-ons to buy one by one: you choose Start, Grow or Complete. The only other cost is your own AI provider's bill if you use Mei, because the AI is billed to you by that provider at their price. Prices exclude applicable taxes such as GST or VAT." },
  { q: "Do you charge for setup?", a: "We install it on your server with you and bring in your people and clients, so you are running within a day. Ask us for the current setup and training options." },
  { q: "How does a licence on my own server work?", a: "You receive a licence key and enter it once when we install the system, which needs an internet connection that day. The key carries which apps you have, when the licence ends and the date your updates run to. After that the system runs on your server with no connection to us. A lifetime licence never stops working; updates continue with the yearly support plan." },
  { q: "What does a lifetime licence include?", a: "The right to run the software forever on your server, with updates for the first year and the first year of the server included. If you already have a server, the price drops by what that year is worth. After that, updates are optional through the yearly support plan for your plan; the software never stops working." },
  { q: "What happens when a term licence ends?", a: "The term you bought is over. Renew it to keep using the software and to receive updates and support. Your data is always yours: we never delete, lock or encrypt it, and you can export it at any time." },
];

export const INTEGRATIONS_FAQ: QA[] = [
  { q: "Which tools does it connect to?", a: "Email through your own mail server, WhatsApp through your own Meta Business account, Google Calendar and Meet, Outlook and Microsoft Teams calendars, and AI through OpenAI, Claude, Gemini or OpenRouter." },
  { q: "Do emails go out from my own address?", a: "Yes. You connect your own mail server, so invoices and reminders come from your domain. Every email template can be edited, and a delivery log shows what was sent and lets you retry a failure." },
  { q: "How does WhatsApp work?", a: "You connect your own Meta Business account, so messages are sent from your number. Invoices and updates can go to clients on WhatsApp as well as by email." },
  { q: "Will meetings show in my calendar?", a: "Yes. Each person can connect their Google or Microsoft calendar, and meetings and follow-ups sync to it, with a Meet or Teams link where you want one." },
  { q: "Where are my files stored?", a: "In a private bucket you own, such as Cloudflare R2 or AWS S3, set up once when we install it. Files are never mixed with anyone else's, and confidential documents are only ever opened through short-lived links." },
  { q: "What if I need a tool that is not listed?", a: "Tell us which one and what you need it to do. Your data is standard PostgreSQL and can be exported at any time, so you are never stuck." },
];

export const SECURITY_FAQ: QA[] = [
  { q: "Who owns the data?", a: "You do. It sits in your own database on your own server, and you can export it whenever you like." },
  { q: "Can I control who sees what?", a: "Yes. There are built-in roles you can change, and fine permissions for every action, so people see only what their job needs. Confidential employee documents are visible only to the people you allow." },
  { q: "Is there an audit trail?", a: "Yes. The audit log records who changed what and when, for the things that matter, and approvals leave a trail too." },
  { q: "Can I run it on my own server?", a: "Yes, that is how Crux is sold. Buy a licence and install it on a Linux server with Docker; we install it with you. After setup it needs no connection to us to run." },
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
  { q: "Is there a per-user price?", a: "No. Every plan has unlimited users. You pay for the plan, which follows how many app groups you pick and the capacity they need, not for the number of logins." },
  { q: "What do the sizes mean?", a: "A plan is how many app groups you pick: any two on Start, any four on Grow, all five of your edition on Complete. Users are never counted, so the only limit on how many people use it is your own server. Our guide: a server with 2 CPUs and 4 GB of memory runs 50 people comfortably." },
  { q: "Is it cheaper to run it on my own server?", a: "Over a few years, yes. You pay once instead of every month, and a lifetime licence includes the first year of the server. After that the only recurring costs are the server, about \u20b9800 a month for a company of 50 people, and optional yearly support. You do need someone to look after the server, or you can ask us to." },
  { q: "Can I move up a plan later?", a: "Yes. Swap or add an app group at any time. If you go past your plan's limit you move to the next plan: you pay the difference and receive a new licence key." },
  { q: "What happens when a term licence ends?", a: "The term you bought is over. Renew it to keep using the software and to receive updates and support. Your data is always yours: we never delete, lock or encrypt it, and you can export it at any time." },
  { q: "How does a licence on my own server work?", a: "You receive a licence key and enter it once when we install the system, which needs an internet connection that day. The key carries which apps you have, when the licence ends and the date your updates run to. After that the system runs on your server with no connection to us. A lifetime licence never stops working; updates continue with the yearly support plan." },
  { q: "What does a lifetime licence include?", a: "The right to run the software forever on your server, with updates for the first year and the first year of the server included. If you already have a server, the price drops by what that year is worth. After that, updates are optional through the yearly support plan for your plan; the software never stops working." },
  { q: "Who owns the data?", a: "You do. It sits in your own database on your own server, and you can export it whenever you like." },
  { q: "Do you charge for setup?", a: "We install it on your server with you and bring in your people and clients, so you are running within a day. Ask us for the current setup and training options." },
  { q: "Is the AI assistant included?", a: "Yes, Mei is part of every plan. You connect your own AI provider account, so the cost of the AI is billed to you by that provider, at their price." },
  { q: "Is tax included?", a: "Prices exclude applicable taxes such as GST or VAT, which are added on the invoice." },
  { q: "Which currencies can I pay in?", a: "Indian rupees, US dollars, British pounds, euros and UAE dirhams. The site shows prices in the currency for your country, and you can switch it above the plans. You are invoiced in the currency you choose, at the price shown." },
];

export const RUNNING_FAQ: QA[] = [
  { q: "Can I try it first?", a: "Yes. Request a demo and you get a private copy with sample data for one hour, no card and no installation. Mei, the AI assistant, answers up to 15 questions in the demo, on us." },
  { q: "How many users can my own server handle?", a: "As many as the machine can carry, since a licence never counts users. A server with 2 CPUs, 4 GB of memory and 40 GB of disk is our recommended minimum and comfortably runs 50 people. Use 4 CPUs and 8 GB for up to 150 people. Everything stays private on your server: the database, the files and the backups." },
  { q: "What do I need to run it on my own server?", a: "A Linux server (Ubuntu 22.04 or 24.04) with Docker and a domain name. Two CPUs, 4 GB of memory and 40 GB of disk comfortably run a company of 50 people; for 50 to 150 people use 4 CPUs, 8 GB and 100 GB. Users are never counted, so the server is the only limit. Our installer does the rest." },
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
