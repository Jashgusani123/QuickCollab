import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";
import { toast } from "sonner";

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => messageApis.create(formData),

    onSuccess: (_res, formData) => {
      const channelId = formData.get("channelId") as string | null;
      const conversationId = formData.get("conversationId") as string | null;
      const parentMessageId = formData.get("parentMessageId") as string | null;

      // 🧵 THREAD REPLY
      if (parentMessageId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "thread", parentMessageId],
        });

        queryClient.invalidateQueries({
          queryKey: ["message-by-id", parentMessageId],
        });

        return;
      }

      // 💬 CONVERSATION (DM)
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversation", conversationId],
        });
        return;
      }

      // 📢 CHANNEL MESSAGE
      if (channelId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "channel", channelId],
        });
      }
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    },
  });
};
