"use client";

import { useGetMember } from "@/features/member/hooks/use_get_member";
import { useMemberId } from "@/hooks/use_member_id";
import { Loader2 } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat_input";
import { MessageList } from "@/components/message_list";
import { useGetMessages } from "@/features/messages/hook/use_get_messages";
import { useState } from "react";

interface ConversationProps {
  id: string;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const [page, setPage] = useState(1);

  const { data: member, isLoading: memberLoading } = useGetMember(memberId);
  const { data: messages, isLoading: messagesLoading, isFetching: isLoadingMore } = useGetMessages({
    conversationId: id,
    page,
    limit: 20,
  });

  const loadMore = () => {
    if (!messages?.pagination) return;

    if (messages.pagination.page < messages.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const canLoadMore =
    !!messages?.pagination && messages.pagination.page < messages.pagination.totalPages;

  if (memberLoading || messagesLoading) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }
  const messagesData = [...(messages?.data ?? [])].reverse();
  return (
    <div className="flex h-full flex-col">
      <Header
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => {}}
      />
      <MessageList
        data={messagesData}
        conversationId={id}
        variant="conversation"
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
      />
      <ChatInput placeholder={`Message ${member?.user?.name}`} conversationId={id} />
    </div>
  );
};
