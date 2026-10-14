import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { ADMIN_USER } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Your Account | ${SITE_NAME}`,
  "Profile summary and quick links.",
);

const QUICK_LINKS = [
  { label: "Mailbox", description: "Conversations with companies and talent.", href: "/mailbox" },
  { label: "Profiles", description: "Manage your talent and company profiles.", href: "/account/profiles" },
  { label: "Account management", description: "Billing, security, and sessions.", href: "/account/management" },
  { label: "Referrals", description: "Invite people, earn credits.", href: "/user/referrals" },
  { label: "Notifications", description: "Everything that happened while you were away.", href: "/channel/notifications" },
  { label: "Set a new password", description: "Token-gated password reset.", href: "/set-password" },
];

/** Account home: profile summary + quick links. */
export default function AccountPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your account</h1>
          <p className="mt-1 text-sm text-gray-500">Profile summary and everything you can manage from here.</p>
        </div>

        {/* Profile summary */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <Avatar src={ADMIN_USER.avatar_url} fallback="A" alt={ADMIN_USER.display_name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">{ADMIN_USER.display_name}</h2>
              <Badge tone="indigo">{ADMIN_USER.role}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{ADMIN_USER.email}</p>
            <p className="mt-1 text-xs text-gray-400">Member since {formatDate(ADMIN_USER.created_at)}</p>
          </div>
          <Link
            href="/account/management"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Manage
          </Link>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200"
            >
              <p className="text-sm font-semibold text-gray-900">{link.label}</p>
              <p className="mt-1 text-xs text-gray-500">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
