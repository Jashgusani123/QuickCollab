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
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
            hint="Add reaction"
            height={280}
            width={260}
            onEmojiSelect={(emoji)=>handleReaction(emoji.emoji)}
        >
          <Button
            className="hover:bg-[#9766ac]  bg-white"
            size={"iconSm"}
            disabled={isPending}
          >
            <SmilePlusIcon className="size-4 text-[#2e1139]" />
          </Button>
        </EmojiPopover>

        <Hint label="Replay">
          <Button
            className="hover:bg-[#9766ac]  bg-white"
            size={"iconSm"}
            disabled={isPending}
          >
            <MessageSquareReplyIcon className="size-4 text-[#2e1139]" />
          </Button>
        </Hint>
        <Hint label="Edit Message">
          <Button
            className="hover:bg-[#9766ac]  bg-white"
            size={"iconSm"}
            disabled={isPending}
          >
            <PencilIcon className="size-4 text-[#2e1139]" />
          </Button>
        </Hint>
        <Hint label="Delete Message">
          <Button
            className="hover:bg-[#9766ac]  bg-white"
            size={"iconSm"}
            disabled={isPending}
          >
            <Trash2 className="size-4 text-[#2e1139]" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
