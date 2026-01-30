import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { conversationApis } from "../api/conversation_apis";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { memberId: string; workspaceId: string }) =>
      conversationApis.createOrGet(data),

    onSuccess: (res) => {
      const conversation = res.data?.conversation;

      if (!conversation) return;

      // 1️⃣ Cache the conversation by id
      queryClient.setQueryData(
        ["conversation", conversation._id],
        conversation
      );

      // 2️⃣ Refresh conversation list (if you have sidebar / list)
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ?? "Failed to create conversation"
      );
    },
  });
};
