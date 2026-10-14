import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_COMPANY_JOB_ID } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Payment Failed | ${SITE_NAME}`,
  "Your job posting payment did not go through.",
);

/** Checkout result — standalone page (like /login). */
export default function PaymentFailedPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-7 w-7 text-red-600"
        >
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">Payment failed</h1>
      <p className="mt-2 text-sm text-gray-500">
        The charge didn&apos;t go through. Your job draft is saved — retry checkout with another payment method.
      </p>
      <div className="mt-8 space-y-2">
        <Link
          href={`/jobs/${DEMO_COMPANY_JOB_ID}/checkout`}
          className="block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Retry checkout
        </Link>
        <Link
          href="/account/management"
          className="block rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Billing settings
        </Link>
      </div>
    </div>
  );
}
