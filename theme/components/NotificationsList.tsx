import Badge from "@/components/Badge";
import type { Notification } from "@/lib/data";
import { timeAgo } from "@/lib/format";

const TYPE_TONE: Record<Notification["type"], "gray" | "indigo" | "green" | "amber"> = {
  message: "indigo",
  application: "green",
  job: "amber",
  payment: "green",
  system: "gray",
};

/** Notifications list shared by /channel/notifications and /talent/notifications. */
export default function NotificationsList({ notifications }: { notifications: Notification[] }) {
  return (
    <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
      {notifications.map((notification) => (
        <li key={notification.id} className="flex items-start gap-4 p-5">
          {!notification.read ? (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" aria-label="Unread" />
          ) : (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-200" aria-hidden="true" />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
              <Badge tone={TYPE_TONE[notification.type]}>{notification.type}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{notification.body}</p>
            <p className="mt-1 text-xs text-gray-400">{timeAgo(notification.created_at)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
