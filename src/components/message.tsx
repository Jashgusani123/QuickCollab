import { ReactionType } from "@/features/messages/messages_types";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserIcon } from "lucide-react";
import { generateDarkPalette } from "@/lib/bg_color_generator";
import { useMemo, useState } from "react";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/hook/use_update_message";
import { useChannelId } from "@/hooks/use_channel_id";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/hook/use_delete_message";
import { useConfirm } from "@/hooks/use_confirm";
import { useToggleReaction } from "@/features/reactions/hooks/use_toggle_reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use_panel";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: string;
  memberId: string;
  authorName: string;
  authorImage?: string;
  isAuthor: boolean;
  reactions: ReactionType[];
  body: string;
  imageUrl: string | null | undefined;
  createdAt: string;
  updatedAt: string | null;
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: string | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  parentMessageId?: string;
}
const formatFullTime = (date: Date) => {
  return `${
    isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")
  } at ${format(date, "h:mm:ss a")}`;
};
export const Message = ({
  id,
  memberId,
  authorName = "Member",
  authorImage,
  isAuthor,
  reactions,
  body,
  imageUrl,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  parentMessageId: propParentMessageId,
}: MessageProps) => {
  const { parentMessageId: contextParentMessageId, onOpenMessage, onCloseMessage } = usePanel();
  const channelId = useChannelId();

  // Use the prop if provided, otherwise use context (for backward compatibility)
  const parentMessageId = propParentMessageId || contextParentMessageId;

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Message",
    "Are you sure you want to delete this message ? this cannot be undone"
  );

  const [isDeleting, setIsDeleting] = useState(false);
  
  const { mutate: updateMessage, isPending: updatingMessage } = useUpdateMessage({channelId, parentMessageId: parentMessageId || undefined});
  const { mutate: removeMessage, isPending: removingMessage } = useRemoveMessage({channelId, parentMessageId: parentMessageId || undefined});
  const { mutate: reactionToggle, isPending: reactionPending } = useToggleReaction({
    channelId: channelId,
    parentMessageId: parentMessageId || undefined,
  });
  const isPending = updatingMessage || removingMessage;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          setEditingId(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message ?? "Failed to update message");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    setIsDeleting(true);

    setTimeout(() => {
      removeMessage(id, {
        onSuccess() {
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError() {
          toast.error("Failed to delete message");
          setIsDeleting(false);
        },
      });
    }, 200);
  };

  const handleReaction = async (emoji: any) => {
    reactionToggle({ messageId: id, value: emoji });
  };
  

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "group relative flex flex-col gap-2 p-1.5 px-5",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            "message-bubble",
            isDeleting &&
              "origin-bottom scale-y-0 bg-(--sidebar-surface-3)/20 transition-all duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="message-timestamp w-10 text-center leading-[22px] opacity-0 group-hover:opacity-100 hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="h-full w-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={body} key={id} />
                <Thumbnail url={imageUrl} />

                {updatedAt ? <span className="text-muted-foreground text-xs">(edited)</span> : null}
                <Reactions data={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }
  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "group relative flex flex-col gap-2 p-1.5 px-5",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isDeleting &&
            "origin-bottom scale-y-0 bg-(--sidebar-surface-3)/20 transition-all duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="mr-0.5 size-9 rounded-md">
              <AvatarImage className="rounded-md" src={authorImage} />
              <AvatarFallback className="flex items-center justify-center rounded-md border font-sans text-2xl font-semibold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="h-full w-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden">
              <div className="text-sm">
                <button
                  className="message-author cursor-pointer hover:underline"
                  onClick={() => {}}
                >
                  {authorName}
                </button>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="message-timestamp hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} key={id} />
              <Thumbnail url={imageUrl} />
              {updatedAt ? <span className="text-muted-foreground text-xs">(edited)</span> : null}
              <Reactions data={reactions} onChange={handleReaction} />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
