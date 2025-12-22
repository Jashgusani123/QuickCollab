"use client";

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/member/hooks/use_current_member";
import { useChannelId } from "@/hooks/use_channel_id";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { AlertTriangle, Loader2, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useCreateMessage } from "../hook/use_create_message";
import { useGetMessageById } from "../hook/use_get_message_by_id";
import { useGetMessages } from "../hook/use_get_messages";
import Quill from "quill";
import { MessageType } from "../messages_types";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THRESHOLD = 5;
const LIMIT = 20;

/* ------------------ HELPERS ------------------ */

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

interface ThreadProps {
  messageId: string;
  onCloseMessage: () => void;
}

/* ------------------ COMPONENT ------------------ */

export const Thread = ({ messageId, onCloseMessage }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const editorRef = useRef<Quill | null>(null);

  const [page, setPage] = useState(1);
  const [allReplies, setAllReplies] = useState<MessageType[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: currentMember } = useCurrentMember(workspaceId);

  /* ------------------ DATA ------------------ */

  // Parent message (root)
  const {
    data: parentMessage,
    isLoading: parentLoading,
  } = useGetMessageById(messageId);

  // Thread replies ONLY
  const {
    data: replyResponse,
    isFetching: isLoadingMore,
  } = useGetMessages({
    channelId,
    parentMessageId: messageId,
    page,
    limit: LIMIT,
  });

  const { mutate: createMessage, isPending } = useCreateMessage(channelId);

  /* ------------------ EFFECTS ------------------ */

  // Reset when opening a new thread
  useEffect(() => {
    setPage(1);
    setAllReplies([]);
  }, [messageId]);

  // Merge paginated replies
  useEffect(() => {
    if (!replyResponse?.data) return;

    setAllReplies((prev) => {
      const map = new Map<string, MessageType>();
      [...prev, ...replyResponse.data].forEach((m) => map.set(m.id, m));
      return Array.from(map.values());
    });
  }, [replyResponse]);

  /* ------------------ PAGINATION ------------------ */

  const loadMore = () => {
    if (!replyResponse?.pagination) return;
    if (replyResponse.pagination.page < replyResponse.pagination.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const canLoadMore =
    !!replyResponse?.pagination &&
    replyResponse.pagination.page < replyResponse.pagination.totalPages;

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = ({ body, image }: { body: string; image: File | null }) => {
    if (!body) return;

    const form = new FormData();
    form.append("body", body);
    form.append("channelId", channelId);
    form.append("workspaceId", workspaceId);
    form.append("parentMessageId", messageId);
    if (image) form.append("image", image);

    createMessage(form, {
      onSuccess: () => {
        setEditorKey((k) => k + 1);
      },
    });
  };

  /* ------------------ GROUP REPLIES ------------------ */

  const sortedReplies = [...allReplies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const groupedReplies = sortedReplies.reduce(
    (groups, message) => {
      const key = format(new Date(message.createdAt), "yyyy-MM-dd");
      if (!groups[key]) groups[key] = [];
      groups[key].push(message);
      return groups;
    },
    {} as Record<string, MessageType[]>
  );

  /* ------------------ STATES ------------------ */

  if (parentLoading) {
    return (
      <div className="flex h-full flex-col">
        <ThreadHeader onClose={onCloseMessage} />
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!parentMessage) {
    return (
      <div className="flex h-full flex-col">
        <ThreadHeader onClose={onCloseMessage} />
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <div className="flex h-full flex-col">
      <ThreadHeader onClose={onCloseMessage} />

      {/* ✅ PARENT MESSAGE */}
      <div className="border-b">
        <Message
          id={parentMessage.id}
          memberId={parentMessage.member.id}
          authorName={parentMessage.user.name}
          isAuthor={parentMessage.member.id === currentMember?._id}
          body={parentMessage.body}
          imageUrl={parentMessage.imageUrl}
          createdAt={parentMessage.createdAt}
          updatedAt={parentMessage.updatedAt}
          reactions={parentMessage.reactions}
          isEditing={editingId === parentMessage.id}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>

      {/* ✅ LOAD OLDER REPLIES */}
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

      {/* ✅ THREAD REPLIES */}
      <div className="message-scrollbar flex flex-1 flex-col overflow-y-auto pb-4">
        {Object.entries(groupedReplies).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="relative my-2 text-center">
              <hr className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
              <span className="relative rounded-full border bg-white px-3 py-1 text-xs shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>

            {messages.map((message, index) => {
              const prev = messages[index - 1];
              const isCompact =
                !!prev &&
                prev.user.id === message.user.id &&
                differenceInMinutes(
                  new Date(message.createdAt),
                  new Date(prev.createdAt)
                ) < TIME_THRESHOLD;

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
                  isEditing={editingId === message.id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* ✅ REPLY EDITOR */}
      <div className="border-t px-4 py-2">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply…"
        />
      </div>
    </div>
  );
};

/* ------------------ HEADER ------------------ */

const ThreadHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="flex h-[49px] items-center justify-between border-b px-4">
    <p className="text-lg font-bold">Thread</p>
    <Button variant="ghost" size="iconSm" onClick={onClose}>
      <XIcon className="size-5 stroke-[1.5]" />
    </Button>
  </div>
);
