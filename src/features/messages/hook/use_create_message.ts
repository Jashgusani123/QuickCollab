import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";
import { toast } from "sonner";

export const useCreateMessage = (channelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => messageApis.create(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", channelId],
      });
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    },
  });
};
