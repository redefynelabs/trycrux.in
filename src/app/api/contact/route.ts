import { clientIp, forward } from "@/lib/control-plane";
import { contactSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: { code: "bad_request", message: "The request is not valid" } }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0] ?? "form"), i.message]));
    return Response.json({ error: { code: "validation_failed", message: "Please check the highlighted fields", fields } }, { status: 422 });
  }
  const out = await forward("/v1/contact-requests", parsed.data, clientIp(request.headers));
  return Response.json(out.body, { status: out.status });
}
