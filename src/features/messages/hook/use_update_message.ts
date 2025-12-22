import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";
import { toast } from "sonner";

interface UpdateMessageProps {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
}

export const useUpdateMessage = ({
  channelId,
  conversationId,
  parentMessageId,
}: UpdateMessageProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; body: string }) =>
      messageApis.update(payload),

    onSuccess: (response, variables) => {
      const { id, body } = variables;
      const updatedAt = response.data.Message.updatedAt;

      const updateMessage = (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((m: any) =>
            m.id === id || m._id === id
              ? { ...m, body, updatedAt }
              : m
          ),
        };
      };

      // 1️⃣ Channel messages
      if (channelId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "channel", channelId], exact: false },
          updateMessage
        );
      }

      // 2️⃣ Thread messages
      if (parentMessageId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "thread", parentMessageId], exact: false },
          updateMessage
        );
      }

      // 3️⃣ Conversation messages
      if (conversationId) {
        queryClient.setQueriesData(
          { queryKey: ["messages", "conversation", conversationId], exact: false },
          updateMessage
        );
      }

      // 4️⃣ Single message cache
      queryClient.setQueryData(["message-by-id", id], (old: any) =>
        old ? { ...old, body, updatedAt } : old
      );

      toast.success("Message updated");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to update message");
    },
  });
};
