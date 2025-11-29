import { MessageType } from "@/features/messages/messages_types";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { ChannelHero } from "./channel_hero";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { useCurrentMember } from "@/features/member/hooks/use_current_member";

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
  const [editingId , setEditingId] = useState<string | null>(null);

  const workspaceId = useWorkspaceId(); 
  const {data:currentMember} = useCurrentMember(workspaceId)

  const groupedMessages = data?.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, typeof data>);


  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto pb-4 message-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300 " />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm ">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?.id === message.user?.id &&
              differenceInMinutes(
                new Date(message.createdAt),
                new Date(prevMessage.createdAt)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={index}
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
      {variant === "channel" && channelName && channelCreateTime && (
        <ChannelHero
          name={channelName}
          creationTime={channelCreateTime}
        />
      )}
    </div>
  );
};
