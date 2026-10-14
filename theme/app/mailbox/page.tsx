import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import MessageThread from "@/components/MessageThread";
import { getMessages, listConversations, otherParticipant } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(`Mailbox | ${SITE_NAME}`, "Your conversations.");

/** Two-pane mailbox: conversation list left, first conversation right. */
export default function MailboxPage() {
  const conversations = listConversations();
  const active = conversations[0];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mailbox</h1>
          <p className="mt-1 text-sm text-gray-500">
            Contact requests turn into conversations here. Messaging stays in-app — emails are never exchanged.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          {/* Conversation list */}
          <ul className="h-fit divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {conversations.map((conversation) => {
              const other = otherParticipant(conversation);
              return (
                <li key={conversation.conversation_id}>
                  <Link
                    href={`/mailbox/${conversation.conversation_id}`}
                    className="flex items-start gap-3 p-4 transition hover:bg-gray-50"
                  >
                    <Avatar src={null} fallback={other.avatar_fallback} alt={other.display_name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-gray-900">{other.display_name}</span>
                        {conversation.unread_count > 0 ? (
                          <Badge tone="indigo">{conversation.unread_count} new</Badge>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-gray-500">
                        {conversation.job ? conversation.job.title : "Direct message"}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">{conversation.last_message.body}</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {formatDate(conversation.last_message.created_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* First conversation preview */}
          {active ? (
            <MessageThread conversation={active} messages={getMessages(active.conversation_id)} />
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
