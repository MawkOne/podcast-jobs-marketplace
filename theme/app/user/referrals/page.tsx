import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import StatBlock from "@/components/StatBlock";
import { listReferrals } from "@/lib/data";
import { noindexMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Referrals | ${SITE_NAME}`,
  "Invite people to the marketplace and earn credits.",
);

const STATUS_TONE = { pending: "gray", joined: "indigo", rewarded: "green" } as const;

function usd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

/** Referrals: invite link + referral list with rewards. */
export default function ReferralsPage() {
  const referrals = listReferrals();
  const rewarded = referrals.filter((referral) => referral.status === "rewarded");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Referrals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Invite freelancers or companies — you both get credit when they join and complete onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatBlock value={String(referrals.length)} label="People invited" />
          <StatBlock value={usd(rewarded.reduce((sum, referral) => sum + referral.reward, 0))} label="Credit earned" />
        </div>

        {/* Invite link */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Your invite link</h2>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              readOnly
              value={`${SITE_URL}/signup?ref=admin`}
              aria-label="Invite link"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600"
            />
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">Copy button is a placeholder in this theme.</p>
        </section>

        {/* Referral list */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Your referrals</h2>
          <ul className="mt-3 divide-y divide-gray-100">
            {referrals.map((referral) => (
              <li key={referral.referred_email} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{referral.referred_email}</p>
                  <p className="text-xs text-gray-400">Invited via your link</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={STATUS_TONE[referral.status]}>{referral.status}</Badge>
                  <span className="text-sm font-semibold text-gray-900">{usd(referral.reward)}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            Rewards post as account credit once the referred account completes onboarding.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
