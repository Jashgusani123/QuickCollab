import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";
import { toast } from "sonner";

export const useCreateMessage = (channelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => messageApis.create(formData),

    onSuccess: (_res, formData) => {
      const parentMessageId = formData.get("parentMessageId");

      // 🔹 THREAD REPLY
      if (parentMessageId) {
        // 1️⃣ Refresh thread messages only
        queryClient.invalidateQueries({
          queryKey: ["messages", "thread", parentMessageId],
        });

        // 2️⃣ Update parent message thread count / preview
        queryClient.invalidateQueries({
          queryKey: ["message-by-id", parentMessageId],
        });

        return;
      }

      // 🔹 CHANNEL MESSAGE (normal message)
      queryClient.invalidateQueries({
        queryKey: ["messages", "channel", channelId],
      });
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    },
  });
};
