import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?:string | null;
  onClick?: () => void;
}

export const ThreadBar = ({ image,name, count, timestamp, onClick }: ThreadBarProps) => {
  if (!count || !timestamp) {
    return null;
  }

  const avatarFallback = name?.charAt(0).toUpperCase() ?? "M";


  return (
    <Button
      onClick={onClick}
      className="hover:border-border group/thread_bar flex max-w-[600px] items-center justify-start rounded-md border border-transparent p-1 transition hover:bg-white bg-(--message-bubble-bg)"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sky-700 text-xs hover:underline font-bold truncate">
            {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread_bar:hidden block">
            Last reply at {new Date(timestamp).toLocaleTimeString()}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread_bar:block hidden">
            View Thread
        </span>
        <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread_bar:opacity-100 transition shrink-0 "/>
      </div>
    </Button>
  );
};

