import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import ReviewForm from "./ReviewForm";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Submit a Review | ${SITE_NAME}`,
  "Review a freelancer or a company you worked with.",
);

/** Submit review — auth-gated on the live platform, noindex placeholder here. */
export default function ReviewPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Submit a review</h1>
          <p className="mt-1 text-sm text-gray-500">
            Reviews are public and tied to the profile — be specific and fair. You can review a freelancer or a
            company.
          </p>
        </div>
        <ReviewForm />
      </div>
    </AppShell>
  );
}
