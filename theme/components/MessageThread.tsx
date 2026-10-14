import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import {
  ADMIN_USER,
  type Conversation,
  type Message,
  otherParticipant,
} from "@/lib/data";
import { formatDate } from "@/lib/format";

type MessageThreadProps = {
  conversation: Conversation;
  messages: Message[];
};

/**
 * Conversation view shared by /mailbox (first thread) and /mailbox/{id}.
 * Messages from the signed-in user render on the right; the reply box is a
 * visual placeholder.
 */
export default function MessageThread({ conversation, messages }: MessageThreadProps) {
  const other = otherParticipant(conversation);

  return (
    <div className="flex min-h-[24rem] flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 p-4">
        <Avatar src={null} fallback={other.avatar_fallback} alt={other.display_name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{other.display_name}</p>
          <p className="truncate text-xs text-gray-500">{other.area}</p>
        </div>
        {conversation.job ? (
          <Badge tone="indigo">{conversation.job.title}</Badge>
        ) : (
          <Badge>Direct message</Badge>
        )}
      </div>

      <ul className="flex-1 space-y-4 p-4">
        {messages.map((message) => {
          const mine = message.sender_id === ADMIN_USER.user_id;
          return (
            <li key={message.message_id} className={mine ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  mine
                    ? "max-w-md rounded-xl bg-indigo-600 px-4 py-2.5 text-sm text-white"
                    : "max-w-md rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-gray-700"
                }
              >
                <p>{message.body}</p>
                <p className={`mt-1 text-[11px] ${mine ? "text-indigo-200" : "text-gray-400"}`}>
                  {mine ? "You" : other.display_name} · {formatDate(message.created_at)}
                  {message.read_at === null && !mine ? " · unread" : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <form className="flex gap-2 border-t border-gray-200 p-4">
        <input
          type="text"
          placeholder="Write a reply…"
          aria-label="Write a reply"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
