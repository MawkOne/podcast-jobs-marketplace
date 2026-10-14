import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import MessageThread from "@/components/MessageThread";
import {
  getConversation,
  getMessages,
  listConversations,
  otherParticipant,
} from "@/lib/data";
import { formatDate } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listConversations().map((conversation) => ({ id: conversation.conversation_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const conversation = getConversation(id);
  if (!conversation) return {};
  const other = otherParticipant(conversation);
  return noindexMetadata(
    `${other.display_name} | Mailbox | ${SITE_NAME}`,
    "A conversation on the marketplace.",
  );
}

/** Full conversation view: thread + reply box placeholder. */
export default async function MailboxThreadPage({ params }: PageProps) {
  const { id } = await params;
  const conversation = getConversation(id);
  if (!conversation) notFound();
  const messages = getMessages(conversation.conversation_id);
  const other = otherParticipant(conversation);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/mailbox" className="text-sm font-medium text-indigo-600 hover:underline">
              ← All conversations
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{other.display_name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {conversation.job ? `About: ${conversation.job.title}` : "Direct message — not tied to a job."}
            </p>
          </div>
          {conversation.unread_count > 0 ? (
            <Badge tone="indigo">{conversation.unread_count} unread</Badge>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          {/* Conversation list for context */}
          <ul className="h-fit divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {listConversations().map((candidate) => {
              const candidateOther = otherParticipant(candidate);
              const isActive = candidate.conversation_id === conversation.conversation_id;
              return (
                <li key={candidate.conversation_id} className={isActive ? "bg-indigo-50/60" : ""}>
                  <Link
                    href={`/mailbox/${candidate.conversation_id}`}
                    className="flex items-start gap-3 p-4 transition hover:bg-gray-50"
                  >
                    <Avatar
                      src={null}
                      fallback={candidateOther.avatar_fallback}
                      alt={candidateOther.display_name}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {candidateOther.display_name}
                      </span>
                      <p className="truncate text-xs text-gray-500">{candidate.last_message.body}</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {formatDate(candidate.last_message.created_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <MessageThread conversation={conversation} messages={messages} />
        </div>
      </div>
    </AppShell>
  );
}
