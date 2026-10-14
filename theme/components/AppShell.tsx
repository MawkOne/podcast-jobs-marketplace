import type { ReactNode } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { ADMIN_USER, DATA_AS_OF, DEMO_COMPANY_JOB_ID } from "@/lib/data";
import { formatDate } from "@/lib/format";

type AppShellProps = {
  variant?: "talent" | "company";
  children: ReactNode;
};

const TALENT_NAV = [
  { label: "Mailbox", href: "/mailbox" },
  { label: "Pipeline", href: "/talent/lead-pipeline" },
  { label: "Jobs", href: "/talent/jobs" },
  { label: "Discovery", href: "/talent/search" },
  { label: "Account", href: "/account" },
];

const COMPANY_NAV = [
  { label: "Mailbox", href: "/mailbox" },
  { label: "Applicants", href: `/channel/job/${DEMO_COMPANY_JOB_ID}/applicants` },
  { label: "Jobs", href: "/job/create" },
  { label: "Discovery", href: "/channel/discovery" },
  { label: "Account", href: "/account" },
];

/**
 * Authenticated page shell (URL_STRUCTURE.md §9.1): gray-50 sidebar with the
 * journey nav (talent or company variant), the logged-in user block, and the
 * data-as-of note. Content renders in the white area on the right.
 */
export default function AppShell({ variant = "company", children }: AppShellProps) {
  const nav = variant === "talent" ? TALENT_NAV : COMPANY_NAV;

  return (
    <div className="mx-auto flex w-full max-w-7xl">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-50">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col p-4">
          <nav aria-label="Account">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-indigo-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2.5">
              <Avatar src={ADMIN_USER.avatar_url} fallback="A" alt={ADMIN_USER.display_name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{ADMIN_USER.display_name}</p>
                <p className="truncate text-xs text-gray-500">{ADMIN_USER.email}</p>
              </div>
            </div>
            <p className="text-[11px] leading-4 text-gray-400">
              Data as of {formatDate(DATA_AS_OF)} — synced snapshot, not live.
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
