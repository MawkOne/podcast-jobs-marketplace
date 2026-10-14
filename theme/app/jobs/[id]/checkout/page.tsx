import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { getJob, listJobs } from "@/lib/data";
import { formatRateRange, locationTypeLabel } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listJobs().map((job) => ({ id: job.job_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};
  return noindexMetadata(`Checkout: ${job.title} | ${SITE_NAME}`, "Pay to publish your job posting.");
}

const POSTING_FEE = 99;

/** Checkout — job recap, fee line, promo code, pay button. Payment is a placeholder. */
export default async function CheckoutPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-1 text-sm text-gray-500">Review your job post and pay the one-time listing fee.</p>
        </div>

        {/* Job recap */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Avatar src={null} fallback={job.company.logo_fallback_initials} alt={job.company.company_name} size="sm" />
            <span className="text-sm font-medium text-gray-500">{job.company.company_name}</span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-gray-900">{job.title}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="indigo">{job.role}</Badge>
            <Badge>{locationTypeLabel(job.location_type)}</Badge>
            <Badge tone="green">{formatRateRange(job.compensation_min, job.compensation_max)}</Badge>
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Job posting fee (30 days)</dt>
              <dd className="font-medium text-gray-900">${POSTING_FEE}.00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Promo code</dt>
              <dd className="font-medium text-gray-400">—</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <dt className="font-semibold text-gray-900">Total</dt>
              <dd className="text-lg font-bold text-gray-900">${POSTING_FEE}.00</dd>
            </div>
          </dl>

          <div className="mt-5 flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              aria-label="Promo code"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Apply
            </button>
          </div>

          <Link
            href="/payment/success"
            className="mt-4 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Pay ${POSTING_FEE}.00
          </Link>
          <p className="mt-2 text-center text-xs text-gray-400">
            Payment is a placeholder in this theme — no card is charged.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
