import Link from "next/link";
import { buttonClass } from "@/components/buttons";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">That page does not exist or has moved.</p>
      <Link href="/" className={buttonClass("primary", "md", "mt-8")}>Back to the home page</Link>
    </div>
  );
}
