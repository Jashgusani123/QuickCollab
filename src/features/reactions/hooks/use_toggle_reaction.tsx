import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reationApis } from "../apis/reactions_apis";
import { toast } from "sonner";
import { aggregateReactions } from "@/lib/utils";

interface ToggleReactionProps {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
}
export const useToggleReaction = ({
  channelId,
  conversationId,
  parentMessageId,
}: ToggleReactionProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { messageId: string; value: string }) => reationApis.create(data),

    onSuccess: (response, variables) => {
      const msgId = variables.messageId;
      const aggregatedReactions = aggregateReactions(response.data.reactions);

      const updateMessageReactions = (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((m: any) =>
            m.id === msgId || m._id === msgId ? { ...m, reactions: aggregatedReactions } : m
          ),
        };
      };

      // 1️⃣ Channel messages
      if (channelId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "channel", channelId], exact: false },
          updateMessageReactions
        );
      }

      // 2️⃣ Thread messages
      if (parentMessageId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "thread", parentMessageId], exact: false },
          updateMessageReactions
        );

        // Parent message may show reaction count
        queryClient.invalidateQueries({
          queryKey: ["message-by-id", parentMessageId],
        });
      }

      // 3️⃣ Conversation messages
      if (conversationId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "conversation", conversationId], exact: false },
          updateMessageReactions
        );
      }

      // 4️⃣ Single message cache
      queryClient.setQueryData(["message-by-id", msgId], (old: any) =>
        old ? { ...old, reactions: aggregatedReactions } : old
      );
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    },
  });
};
