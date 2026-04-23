"use client";

import { MessageList } from "@/components/message_list";
import QuickCollabTypingLoader from "@/components/quick_collab_typing_loader";
import { useGetChannel } from "@/features/channel/hooks/use_get_channel";
import { useGetMessages } from "@/features/messages/hook/use_get_messages";
import { useChannelId } from "@/hooks/use_channel_id";
import { TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./chat_input";
import { Header } from "../[channelId]/header";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { useCurrentMember } from "@/features/member/hooks/use_current_member";

const LIMIT = 20;

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const [page, setPage] = useState(1);

  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember(workspaceId);

  const { data: channel, isLoading: channelLoading } = useGetChannel(channelId);
  const { data: msgResponse, isFetching: isLoadingMore } = useGetMessages({
    channelId,
    page,
    limit: LIMIT,
  });

  // 🔊 AUDIO
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // 🧠 TRACKING
  const prevLatestIdRef = useRef<string | null>(null);
  const hasNewWhileHiddenRef = useRef(false);
  const isFirstLoadRef = useRef(true); // 🚨 prevent first load sound

  // ✅ Init audio
  useEffect(() => {
    audioRef.current = new Audio("/ring_tone.mp3");
    audioRef.current.preload = "auto";
  }, []);

  // ✅ Unlock audio
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
          setAudioUnlocked(true);
        })
        .catch(() => {});

      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  // ✅ SORT messages (IMPORTANT)
  const sortedMessages = [...(msgResponse?.data ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // 🧠 DETECT NEW MESSAGE
  useEffect(() => {
    if (!sortedMessages.length) return;
    if (!currentMember?._id) return;

    const latestMessage = sortedMessages[sortedMessages.length - 1];
    const prevId = prevLatestIdRef.current;

    const isFromMe =
      String(latestMessage.member.id) === String(currentMember._id);

    // 🚨 skip first load
    if (isFirstLoadRef.current) {
      prevLatestIdRef.current = latestMessage.id;
      isFirstLoadRef.current = false;
      return;
    }

    if (prevId && latestMessage.id !== prevId && !isFromMe) {

      if (document.hidden) {
        hasNewWhileHiddenRef.current = true;
      } else if (audioUnlocked) {
        audioRef.current?.play().catch(() => {});
      }
    }

    prevLatestIdRef.current = latestMessage.id;
  }, [sortedMessages, currentMember, audioUnlocked]);

  // 🔊 Play on tab return
  useEffect(() => {
    const handleVisibility = () => {
      if (
        !document.hidden &&
        hasNewWhileHiddenRef.current &&
        audioUnlocked
      ) {
        audioRef.current?.play().catch(() => {});
        hasNewWhileHiddenRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [audioUnlocked]);

  const loadMore = () => {
    if (!msgResponse?.pagination) return;

    if (msgResponse.pagination.page < msgResponse.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const canLoadMore =
    !!msgResponse?.pagination &&
    msgResponse.pagination.page < msgResponse.pagination.totalPages;

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
        <span className="text-muted-foreground text-sm">
          Channel not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header channelName={channel.name} />

      <MessageList
        channelName={channel.name}
        channelCreateTime={channel.createdAt}
        data={sortedMessages}
        loadMore={loadMore}
        canLoadMore={canLoadMore}
        isLoadingMore={isLoadingMore}
      />

      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;