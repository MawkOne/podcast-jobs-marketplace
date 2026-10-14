import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Account Management | ${SITE_NAME}`,
  "Profiles, billing, and security.",
);

const SESSIONS = [
  { device: "MacBook Pro — Chrome", location: "Los Angeles, US", current: true },
  { device: "iPhone — Safari", location: "Los Angeles, US", current: false },
];

/** Account management: profiles, billing, security sections. */
export default function AccountManagementPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Account management</h1>
          <p className="mt-1 text-sm text-gray-500">Profiles, billing, and security in one place.</p>
        </div>

        {/* Profiles */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Profiles</h2>
            <Link
              href="/account/profiles"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Manage profiles →
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            One account can hold both a talent and a company profile — switch or merge them anytime.
          </p>
        </section>

        {/* Billing */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Billing</h2>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
              <p className="text-xs text-gray-500">Used for job posting fees — placeholder in this theme</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Update card
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Security</h2>
            <Link
              href="/set-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Change password →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-gray-100">
            {SESSIONS.map((session) => (
              <li key={session.device} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.device}</p>
                  <p className="text-xs text-gray-400">{session.location}</p>
                </div>
                {session.current ? (
                  <Badge tone="green">This device</Badge>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
