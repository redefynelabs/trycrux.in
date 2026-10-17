import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = pageMeta("/legal/terms", "Terms of service", "The terms for using Crux on your own server, for Mei the AI assistant, and for trying a demo.");

export default function Terms() {
  return (
    <LegalPage title="Terms of service" updated="15 October 2026" draft={false}>
      <p>These terms cover your company&rsquo;s use of Crux, the business operating system made by Redefyne (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using Crux, or by signing an order with us, your company (&ldquo;you&rdquo;) agrees to them.</p>

      <h2>The service</h2>
      <p>Crux is software for running a company: people, HR and payroll, projects and timesheets, CRM and sales, inventory and purchasing, and finance, with Mei, an AI assistant. You can use it on our cloud, where we host and run it for you, or on your own server under a licence.</p>

      <h2>Your account</h2>
      <ul>
        <li>You decide who in your company gets access and what each person can do. Keep sign-in details private; you are responsible for what is done under your accounts.</li>
        <li>Use Crux lawfully, and only for your own company&rsquo;s work. Do not try to break, overload or get around its security.</li>
      </ul>

      <h2>Cloud plans</h2>
      <ul>
        <li>You pay the price of your plan in advance, monthly or yearly. Prices are in the currency you choose (INR, USD, GBP, EUR or AED) and exclude taxes such as GST or VAT.</li>
        <li>We keep your instance running, apply updates and take daily backups for the period of your plan.</li>
        <li>You may change plan or cancel at the end of any billing period. Fees already paid are not refunded unless the law requires it.</li>
        <li>If a payment fails we tell you and give you reasonable time to pay before we suspend the instance. A suspended instance is unavailable, but we keep its data for at least 30 days and you can export it during that time.</li>
      </ul>

      <h2>Licences for your own server</h2>
      <ul>
        <li>A licence is for one company and one production installation, plus reasonable test and backup copies.</li>
        <li>You may not resell, share or sub-license Crux, or move a licence to another company.</li>
        <li>A term licence ends on its end date; renew it to keep using Crux. A lifetime licence does not end, and includes updates for the period stated on it, then through the optional yearly support plan.</li>
        <li>Whether or not you renew, your data stays yours and you can always export it.</li>
      </ul>

      <h2>Mei and other services</h2>
      <ul>
        <li>Mei uses an AI provider that you connect with your own key. That provider bills you for its use under its own terms.</li>
        <li>AI answers can be wrong. Check figures and drafts before you rely on them. Mei proposes changes, such as a new client or an invoice draft, and nothing is created until a person confirms it.</li>
        <li>Email, calendar and WhatsApp connections run through your own accounts with those services and are subject to their terms.</li>
      </ul>

      <h2>Your data</h2>
      <p>Everything you put into Crux is yours. We use it only to provide and support the service, as described in our privacy notice and on the data ownership page.</p>

      <h2>Demos</h2>
      <p>A demo is free, provided as it is, holds only sample data and is deleted after a short time. Do not enter real personal or business data in a demo.</p>

      <h2>Availability and support</h2>
      <p>We work to keep the cloud service available and to fix problems quickly, and we give notice of planned maintenance where we can. Support is by email, and your plan or support agreement may add more.</p>

      <h2>Liability</h2>
      <p>To the extent the law allows, we are not liable for indirect or consequential losses such as lost profit or lost data, and our total liability is limited to the fees you paid us in the twelve months before the claim. Nothing in these terms limits liability that the law does not allow us to limit.</p>

      <h2>Ending</h2>
      <p>You can stop using Crux at any time. We may end or suspend the service if these terms are seriously broken and the problem is not fixed after notice. Either way, you can export your data.</p>

      <h2>Changes and law</h2>
      <p>We may update these terms; if a change matters to you, we tell you before it applies. These terms are governed by the laws of India.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: use the contact form.</p>
    </LegalPage>
  );
}
