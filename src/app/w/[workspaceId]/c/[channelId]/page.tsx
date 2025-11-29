"use client";

import { useEffect, useState } from "react";
import { useGetChannel } from "@/features/channel/hooks/use_get_channel";
import { useChannelId } from "@/hooks/use_channel_id";
import { Loader2, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat_input";
import { useGetMessages } from "@/features/messages/hook/use_get_messages";
import { MessageList } from "@/components/message_list";

const LIMIT = 20;

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } =
    useGetChannel(channelId);

  const [page, setPage] = useState(1);

  const {
    data: msgResponse,
    isLoading: messagesLoading,
    isFetching: isLoadingMore,
  } = useGetMessages({ channelId, page, limit: LIMIT });

  // reset page when channel changes
  useEffect(() => {
    setPage(1);
  }, [channelId]);

  const loadMore = () => {
    if (!msgResponse?.pagination) return;

    const { page: currentPage, totalPages } = msgResponse.pagination;

    if (currentPage < totalPages) {
      setPage((p) => p + 1);
    }
  };

  const canLoadMore =
    msgResponse?.pagination &&
    msgResponse.pagination.page < msgResponse.pagination.totalPages;

  if (channelLoading || messagesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex items-center flex-col justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Channel not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header channelName={channel.name} />

      <MessageList
        channelName={channel.name}
        channelCreateTime={channel.createdAt}
        data={msgResponse?.data || []}     
        loadMore={loadMore}
        canLoadMore={canLoadMore}
        isLoadingMore={isLoadingMore}
      />

      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
