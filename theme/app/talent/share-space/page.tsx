import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import { DEMO_TALENT_ID, getTalentListItem } from "@/lib/data";
import { SITE_URL, noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Share Space | ${SITE_NAME}`,
  "Generate shareable links, cards, and badges for your talent profile.",
);

const copyButton =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50";

/** Share generators: profile link, business card, badge, review link. */
export default function ShareSpacePage() {
  const talent = getTalentListItem(DEMO_TALENT_ID);
  const profileUrl = `${SITE_URL}/talent/profile/${DEMO_TALENT_ID}`;
  const reviewUrl = `${SITE_URL}/review?subject=talent:${DEMO_TALENT_ID}`;

  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Share space</h1>
          <p className="mt-1 text-sm text-gray-500">
            Everything you need to promote your profile — links, a business card, a badge, and a review link.
          </p>
        </div>

        {/* Profile link */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Profile link</h2>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              aria-label="Profile link"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600"
            />
            <button type="button" className={copyButton}>
              Copy
            </button>
          </div>
        </section>

        {/* Business card */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Business card</h2>
          <div className="mt-3 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
              {talent?.avatar_fallback ?? "?"}
            </span>
            <div>
              <p className="text-base font-semibold text-gray-900">{talent?.display_name ?? "Your name"}</p>
              <p className="text-sm text-gray-500">
                {talent?.functional_area ?? "Your role"} · {SITE_NAME}
              </p>
            </div>
          </div>
          <button type="button" className={`mt-3 ${copyButton}`}>
            Download card
          </button>
        </section>

        {/* Badge */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Embeddable badge</h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2">
            <span className="text-sm font-semibold text-white">{SITE_NAME}</span>
            <span className="text-xs text-indigo-200">verified talent</span>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              readOnly
              value={`<a href="${profileUrl}">Verified on ${SITE_NAME}</a>`}
              aria-label="Badge embed code"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600"
            />
            <button type="button" className={copyButton}>
              Copy
            </button>
          </div>
        </section>

        {/* Review link */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Review link</h2>
          <p className="mt-1 text-xs text-gray-500">
            Hand this to clients after a finished gig — reviews power your reputation.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              readOnly
              value={reviewUrl}
              aria-label="Review link"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600"
            />
            <button type="button" className={copyButton}>
              Copy
            </button>
          </div>
        </section>

        <p className="text-xs text-gray-400">Copy and download buttons are placeholders in this theme.</p>
      </div>
    </AppShell>
  );
}
