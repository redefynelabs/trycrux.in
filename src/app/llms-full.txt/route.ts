import { llmsFullTxt } from "@/lib/llms";

export const dynamic = "force-static";

/** /llms-full.txt: Crux described for AI assistants (https://llmstxt.org). */
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
