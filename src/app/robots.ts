import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Every crawler may read the site except the form endpoints. The AI crawlers are named so that answer engines
 * (ChatGPT, Claude, Perplexity, Gemini and others) can read and cite Crux; /llms.txt is the summary written for them.
 */
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "meta-externalagent", "Amazonbot", "DuckAssistBot", "cohere-ai", "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
