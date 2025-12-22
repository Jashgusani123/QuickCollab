import { useCurrentMember } from "@/features/member/hooks/use_current_member";
import { ReactionType } from "@/features/messages/messages_types";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { cn } from "@/lib/utils";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji_popover";
import { SmilePlus } from "lucide-react";

interface ReactionsProps {
  data: ReactionType[];
  onChange: (val: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const worksapaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember(worksapaceId);

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }
  
  return (
    <div className="mt-1 mb-1 flex items-center gap-1">
      {data.map((reaction) => (
        
            <Hint
              // key={reaction._id}
              label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
            >
              <button
                onClick={() => onChange(reaction.value)}
                className={cn(
                  "flex h-6 cursor-pointer items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800",
                  reaction.memberIds.includes(currentMemberId) &&
                    "border-blue-500 bg-blue-100/70 text-white"
                )}
              >
                {reaction.value}
                <span
                  className={cn(
                    "text-muted-foreground text-xs font-semibold",
                    reaction.memberIds.includes(currentMemberId) && "text-blue-500"
                  )}
                >
                  {reaction.count}
                </span>
              </button>
            </Hint>
      ))}
      <EmojiPopover hint="Add reaction" onEmojiSelect={(emoji) => onChange(emoji.emoji)}>
        <button className="flex h-7 cursor-pointer items-center gap-x-1 rounded-full border border-slate-500 bg-slate-200/70 px-3 text-slate-800 hover:border-transparent">
          <SmilePlus className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
