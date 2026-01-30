"use client";

import { MessageList } from "@/components/message_list";
import QuickCollabTypingLoader from "@/components/quick_collab_typing_loader";
import { useGetChannel } from "@/features/channel/hooks/use_get_channel";
import { useGetMessages } from "@/features/messages/hook/use_get_messages";
import { useChannelId } from "@/hooks/use_channel_id";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { ChatInput } from "./chat_input";
import { Header } from "../[channelId]/header";

const LIMIT = 20;

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const [page, setPage] = useState(1);

  const { data: channel, isLoading: channelLoading } = useGetChannel(channelId);

  const { data: msgResponse, isFetching: isLoadingMore } = useGetMessages({
    channelId,
    page,
    limit: LIMIT,
  });

  const loadMore = () => {
    if (!msgResponse?.pagination) return;

    if (msgResponse.pagination.page < msgResponse.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const canLoadMore =
    !!msgResponse?.pagination && msgResponse.pagination.page < msgResponse.pagination.totalPages;

  if (channelLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <QuickCollabTypingLoader />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <TriangleAlert className="text-muted-foreground size-6" />
        <span className="text-muted-foreground text-sm">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header channelName={channel.name} />

      <MessageList
        channelName={channel.name}
        channelCreateTime={channel.createdAt}
        data={msgResponse?.data ?? []}
        loadMore={loadMore}
        canLoadMore={canLoadMore}
        isLoadingMore={isLoadingMore}
      />

      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
