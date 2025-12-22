import { MessageType } from "@/features/messages/messages_types";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { ChannelHero } from "./channel_hero";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { useCurrentMember } from "@/features/member/hooks/use_current_member";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreateTime?: string;
  variant?: "channel" | "thread" | "conversation";
  data: MessageType[] | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "EEEE , MMMM d");
};

export const MessageList = ({
  memberImage,
  memberName,
  channelCreateTime,
  channelName,
  data,
  variant = "channel",
  loadMore,
  canLoadMore,
  isLoadingMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember(workspaceId);

  // 1️⃣ Deduplicate messages by ID
  const uniqueMessages = data
    ? Array.from(new Map(data.map(m => [m.id, m])).values())
    : [];

  // 2️⃣ Sort OLDEST → NEWEST
  uniqueMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // 3️⃣ Group by date
  const groupedMessages = uniqueMessages.reduce(
    (groups, message) => {
      const dateKey = format(new Date(message.createdAt), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
      return groups;
    },
    {} as Record<string, MessageType[]>
  );

  return (
    <div className="message-scrollbar flex flex-1 flex-col overflow-y-auto pb-4">
            {variant === "channel" && channelName && channelCreateTime && (
        <ChannelHero name={channelName} creationTime={channelCreateTime} />
      )}
      {/* Load older messages */}
      <div
        className="h-1"
        ref={(el) => {
          if (!el) return;
          const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && canLoadMore && loadMore(),
            { threshold: 1 }
          );
          observer.observe(el);
          return () => observer.disconnect();
        }}
      />

      {isLoadingMore && (
        <div className="my-2 text-center">
          <Loader2 className="mx-auto size-4 animate-spin" />
        </div>
      )}

      {Object.entries(groupedMessages).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="relative my-2 text-center">
            <hr className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
            <span className="relative bg-white px-3 py-1 text-xs rounded-full border shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>

          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];

            const isCompact =
              !!prevMessage &&
              prevMessage.user.id === message.user.id &&
              differenceInMinutes(
                new Date(message.createdAt),
                new Date(prevMessage.createdAt)
              ) === 0;

            return (
              <Message
                key={message.id}
                id={message.id}
                memberId={message.member.id}
                authorName={message.user.name}
                isAuthor={message.member.id === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                imageUrl={message.imageUrl}
                updatedAt={message.updatedAt}
                createdAt={message.createdAt}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
                isEditing={editingId === message.id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
              />
            );
          })}
        </div>
      ))}


    </div>
  );
};

