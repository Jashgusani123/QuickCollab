import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ID } from "@/constants";
import {
  getFriendsQuery,
  getSentRequestsQuery,
  sentRequestMutation,
} from "@/features/request ( notice )/hooks/use_sent_request";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { generateDarkPalette } from "@/lib/bg_color_generator";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckBig, User as UserIcon, UserPlusIcon, UserRoundCheck, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

const userItemVariants = cva(
  "group flex items-center gap-2.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-(--message-author-text) hover:bg-[#b9b6b629] mb-1 rounded-md",
        active: "bg-(--sidebar-active) text-white hover:bg-(--sidebar-active) mb-1 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface UserItemProps {
  id: ID["memberId"];
  label?: string;
  itsYou?: boolean;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
  memberId?:ID["memberId"];
}

export const UserItem = ({ id, label, image, variant, itsYou,memberId }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const colorHex = useMemo(() => generateDarkPalette(1), []);
  
  const { data: sentUserIds } = getSentRequestsQuery();
  const { data: friendsIds } = getFriendsQuery();
  const isRequestSent = sentUserIds.includes(memberId!.toString());
  const isFriend = friendsIds.includes(memberId!.toString());

  const { mutate: sentRequest } = sentRequestMutation();

  return (
    <Button variant="transparent" className={cn(userItemVariants({ variant }))} size="sm" asChild>
      <Link href={`/w/${workspaceId}/m/${id}`}>
        <Avatar className="size-6 shrink-0 rounded-md">
          <AvatarImage className="rounded-md" src={image} />

          <AvatarFallback
            className="flex items-center justify-center rounded-md"
            style={{ backgroundColor: colorHex }}
          >
            <UserIcon className="size-4 text-white" />
          </AvatarFallback>
        </Avatar>

        <span className="truncate text-sm">
          {label}
          {itsYou && " ( You )"}
        </span>
        {!itsYou && (
          <Hint
            label={isRequestSent ? "Request sent" :isFriend? "Friend" : "Send Request"}
            side="bottom"
            align="center"
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isRequestSent) return;

                sentRequest(
                  { oppUserId: memberId! },
                  {
                    onSuccess: () => toast.success("Request sent successfully"),
                    onError: (err: any) => {
                      let message = "Failed to send request";
                      if (err.status === 409) message = "Request already sent to this user";
                      toast.error(message);
                    },
                  }
                );
              }}
              variant={"none"}
              size={"iconSm"}
              className={cn(
                "ml-auto size-6 shrink-0 p-0.5 text-sm transition-opacity",
                isRequestSent
                  ? "text-emerald-500 opacity-100 hover:text-emerald-500"
                  : "text(--color-sky-700) opacity-0 group-hover:opacity-100",
                isFriend && "text-yellow-500 opacity-100 hover:text-yellow-500"
              )}
            >
              {isFriend?(
                <Users className="size-5" />
              ) : (isRequestSent ? (
                <UserRoundCheck className="size-5" />
              ) : (
                <UserPlusIcon className="size-5" />
              ))}
            </Button>
          </Hint>
        )}
      </Link>
    </Button>
  );
};
