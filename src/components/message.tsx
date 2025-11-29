import { ReactionType } from "@/features/messages/messages_types";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserIcon } from "lucide-react";
import { generateDarkPalette } from "@/lib/bg_color_generator";
import { useMemo } from "react";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

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
}
const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMM d, yyyy")
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
}: MessageProps) => {
  const colorHex = useMemo(() => generateDarkPalette(1), []);

  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2 ">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 text-center hover:underline leading-[22px]">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className="flex flex-col w-full ">
            <Renderer value={body} key={id} />
            <Thumbnail url={imageUrl} />

            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2 ">
        <button>
          <Avatar className="rounded-md mr-0.5 size-9">
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="flex items-center justify-center rounded-md font-semibold font-sans text-2xl border ">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button
              className="font-bold text-primary hover:underline cursor-pointer"
              onClick={() => {}}
            >
              {authorName}
            </button>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt), "h:mm a")}
              </button>
            </Hint>
          </div>
          <Renderer value={body} key={id} />
          <Thumbnail url={imageUrl} />
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(edited)</span>
          ) : null}
        </div>
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={()=>setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
