import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = pageMeta("/legal/data-ownership", "Your data, your ownership", "Everything you put into Crux is yours: how to export it, who can open it, how Mei uses it and what happens when you leave.");

export default function DataOwnership() {
  return (
    <LegalPage title="Your data, your ownership" updated="15 October 2026">
      <p>Everything you put into Crux is yours: your people, clients, projects, invoices, files and settings. This page says what that means in practice.</p>

      <h2>On our cloud</h2>
      <ul>
        <li>Your company has its own instance, its own database and its own private file storage, not a share of someone else&rsquo;s.</li>
        <li>We back it up daily and keep the backups for the period of your plan.</li>
        <li>You can export your data at any time. If you leave, we hand over a full copy of your database and files.</li>
        <li>Our staff open your instance only to support you or to keep it running, and every opening is recorded.</li>
      </ul>

      <h2>On your own server</h2>
      <ul>
        <li>The database is a standard PostgreSQL database on your server. You can read, back up, copy and move it.</li>
        <li>We have no access to it. Support happens only when you open a time-limited session, and you can end it.</li>
        <li>If your licence ends we never delete, lock or encrypt your data, and you can always export it.</li>
      </ul>

      <h2>Mei and connected services</h2>
      <ul>
        <li>Mei sends a question, and the records needed to answer it, to the AI provider your company connected, under your company&rsquo;s own key. Nothing is sent to an AI provider you have not connected.</li>
        <li>Mei sees only what the person asking is allowed to see, and it changes nothing until a person confirms.</li>
        <li>We do not use your data to train AI models, and we do not sell it.</li>
      </ul>

      <h2>Leaving us</h2>
      <p>Ask for an export and we provide it. You can also move between our cloud and your own server at any time. After a cloud account closes, we delete its instance and backups once you have your copy, or 30 days after it closes, whichever comes first.</p>
    </LegalPage>
  );
}
