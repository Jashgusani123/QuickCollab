import {
  MessageSquareReplyIcon,
  PencilIcon,
  SmilePlusIcon,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji_popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border-(--content-border) bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          height={280}
          width={260}
          onEmojiSelect={(emoji) => handleReaction(emoji.emoji)}
        >
          <Button
            className="hover:bg-(--content-hover) bg-white text-(--sidebar-active)"
            size={"iconSm"}
            disabled={isPending}
          >
            <SmilePlusIcon className="size-4 text-content-text" />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Replay">
            <Button
              className="hover:bg-(--content-hover) bg-white text-(--sidebar-active)"
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareReplyIcon className="size-4 text-content-text" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit Message">
            <Button
              className="hover:bg-(--content-hover) bg-white text-(--sidebar-active)"
              size={"iconSm"}
              disabled={isPending}
              onClick={handleEdit}
            >
              <PencilIcon className="size-4 text-content-text" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete Message">
            <Button
              className="hover:bg-(--content-hover) bg-white text-(--sidebar-active)"
              size={"iconSm"}
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash2 className="size-4 text-content-text" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
