import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import NotificationsList from "@/components/NotificationsList";
import { listNotifications } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Notifications | ${SITE_NAME}`,
  "Your company notifications.",
);

/** Company notifications. */
export default function ChannelNotificationsPage() {
  const notifications = listNotifications();
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">
              {unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}.` : "You're all caught up."}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Mark all as read
          </button>
        </div>

        <NotificationsList notifications={notifications} />
      </div>
    </AppShell>
  );
}
