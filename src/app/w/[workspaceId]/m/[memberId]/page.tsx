"use client";

import { useCreateConversation } from "@/features/conversation/hook/use_create_conversation";
import { useMemberId } from "@/hooks/use_member_id";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const [hasTriedFetch, setHasTriedFetch] = useState(false);

  const { data, mutate, isPending, isError } = useCreateConversation();

  useEffect(() => {
    if (memberId && workspaceId) {
      setHasTriedFetch(false);
      mutate(
        { memberId, workspaceId },
        {
          onSettled: () => {
            setHasTriedFetch(true);
          },
        }
      );
    }
  }, [memberId, workspaceId, mutate]);

  if (isPending || !hasTriedFetch) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (isError || !data?.data?.conversation?._id) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
        <AlertTriangle className="text-muted-foreground size-6" />
        <span className="text-muted-foreground text-sm">Conversation not found</span>
      </div>
    );
  }

  return <Conversation id={data.data.conversation._id} />;
};

export default MemberIdPage;
