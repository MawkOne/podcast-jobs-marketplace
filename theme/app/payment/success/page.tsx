import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_COMPANY_JOB_ID } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Payment Received | ${SITE_NAME}`,
  "Your job posting payment completed.",
);

/** Checkout result — standalone page (like /login). */
export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-7 w-7 text-emerald-600"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">Payment received</h1>
      <p className="mt-2 text-sm text-gray-500">
        Your job posting fee went through. The job isn&apos;t live yet — preview it and publish when you&apos;re ready.
      </p>
      <div className="mt-8 space-y-2">
        <Link
          href={`/jobs/${DEMO_COMPANY_JOB_ID}/pre-publish`}
          className="block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Preview &amp; publish your job
        </Link>
        <Link
          href="/job/create"
          className="block rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Post another job
        </Link>
      </div>
    </div>
  );
}
