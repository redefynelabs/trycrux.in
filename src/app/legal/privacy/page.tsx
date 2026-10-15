import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = pageMeta("/legal/privacy", "Privacy notice", "What Crux collects on this website, in demos and in the product, why, who sees it, how long it is kept and how to ask for it to be deleted.");

export default function Privacy() {
  return (
    <LegalPage title="Privacy notice" updated="16 October 2026">
      <p>Crux is made by Redefyne (&ldquo;we&rdquo;, &ldquo;us&rdquo;). This notice explains what personal data we handle when you visit this website, try a demo or use Crux, and what you can ask us to do with it.</p>

      <h2>What we collect on this website</h2>
      <ul>
        <li>What you type into the demo and contact forms: your name and work email, and if you give them, your phone number, company, team size and message.</li>
        <li>How you found us: the campaign details in the link you followed, the site that referred you and the first page you opened. These are kept in your browser for the visit and sent only with a form.</li>
        <li>Your IP address and browser details, used to stop spam and abuse of the forms.</li>
      </ul>

      <h2>Cookies and browser storage</h2>
      <p>We use Google Analytics, loaded with Google Tag Manager, to count visits and see which pages, buttons and campaigns bring people to us, and Microsoft Clarity to see how people use the site through heatmaps and recordings of page activity (clicks, scrolls and mouse movement). Clarity masks what you type into forms, and neither tool receives the details you enter. Both set cookies and process the data under their own terms, and the site works the same without them. The site also keeps two small things in your browser: that you closed the announcement bar, and how you found us until you send a form or close the tab. The forms use Cloudflare Turnstile to tell people from bots, and it may set what it needs for that check.</p>

      <p>You choose. In the EU and EEA, the UK and Switzerland both stay off until you allow them in the cookie banner; elsewhere they are on unless you turn them off. Either way, &ldquo;Cookie settings&rdquo; at the bottom of every page lets you accept, reject or pick each one and change your mind at any time. Your choice is kept in your browser for six months. While analytics is off, Google receives only cookieless signals that cannot identify you, and Clarity is not loaded until you allow recordings.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To create your demo and send you its address and sign-in details.</li>
        <li>To answer your message and follow up about Crux. You can ask us to stop at any time.</li>
        <li>To learn which campaigns bring people to us, and to keep the forms free of abuse.</li>
      </ul>
      <p>We do not sell your details and we do not share them for others&rsquo; marketing.</p>

      <h2>Demos</h2>
      <p>A demo is your own short-lived copy of Crux with sample data. You sign in with the email you gave us. If you ask Mei questions in a demo, they are sent to the AI provider we use for demos to produce the answer. The demo and everything in it is deleted when it expires. Please do not enter real personal or business data in a demo.</p>

      <h2>Your data inside Crux</h2>
      <p>The people, clients, invoices and other records you keep in Crux belong to your company. Your company decides what goes in and who can see it, and we handle it only to provide and support the service. On our cloud we act on your company&rsquo;s instructions; on your own server we have no access unless you open a support session.</p>
      <ul>
        <li><strong>Mei, the AI assistant:</strong> when someone asks Mei a question, the question and the records needed to answer it are sent to the AI provider your company connected (for example OpenAI, Anthropic, Google or OpenRouter), under your company&rsquo;s own account with that provider. Mei sees only what the person asking is allowed to see.</li>
        <li><strong>Integrations:</strong> if your company connects Google or Microsoft email and calendars, or WhatsApp through its own Meta Business account, Crux exchanges data with those services only to send the messages and create the meetings people ask for.</li>
      </ul>

      <h2>Who sees it</h2>
      <p>Our sales and support team, and the providers that run our systems for us: hosting and backups, email delivery, website analytics (Google Analytics and Microsoft Clarity) and the bot check on our forms. They may use the data only to provide their service to us.</p>

      <h2>How long we keep it</h2>
      <p>Enquiry details are kept while we are in touch with you and for up to two years after our last contact, then deleted. Demos are deleted when they expire. Customer data is kept for as long as your company uses Crux and is handed back or deleted when it leaves, as set out on the data ownership page.</p>

      <h2>How we protect it</h2>
      <p>Connections are encrypted, each cloud customer has its own database, access is limited to the people who need it, and stored secrets such as connection keys are encrypted.</p>

      <h2>Your rights</h2>
      <p>You can ask to see, correct or delete the details we hold about you, or ask us to stop contacting you. Use the contact form and tell us what you need. If your details are in a company&rsquo;s Crux, ask that company first; we will help them answer you.</p>

      <h2>Changes</h2>
      <p>If we change this notice we update the date above. Important changes will be announced on this website.</p>
    </LegalPage>
  );
}
