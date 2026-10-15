import { llmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

/** /llms.txt: Crux described for AI assistants (https://llmstxt.org). */
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
