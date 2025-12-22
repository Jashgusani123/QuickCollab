import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";
import { toast } from "sonner";

interface RemoveMessageProps {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
}

export const useRemoveMessage = ({
  channelId,
  conversationId,
  parentMessageId,
}: RemoveMessageProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      messageApis.remove({ id: messageId }),

    onSuccess: (_, messageId) => {
      const removeFromList = (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.filter(
            (m: any) => m.id !== messageId && m._id !== messageId
          ),
        };
      };

      // 1️⃣ Remove from channel messages
      if (channelId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "channel", channelId], exact: false },
          removeFromList
        );
      }

      // 2️⃣ Remove from thread messages
      if (parentMessageId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "thread", parentMessageId], exact: false },
          removeFromList
        );

        // Parent message thread count may change
        queryClient.invalidateQueries({
          queryKey: ["message-by-id", parentMessageId],
        });
      }

      // 3️⃣ Remove from conversation messages
      if (conversationId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "conversation", conversationId], exact: false },
          removeFromList
        );
      }

      // 4️⃣ Remove single message cache
      queryClient.removeQueries({
        queryKey: ["message-by-id", messageId],
      });

      toast.success("Message deleted");
    },

    onError: () => {
      toast.error("Failed to delete message");
    },
  });
};
