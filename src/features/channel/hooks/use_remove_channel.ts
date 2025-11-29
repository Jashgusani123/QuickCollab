import { useMutation, useQueryClient } from "@tanstack/react-query";
import { channelApis } from "../apis/channel_apis";

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId }: { channelId: string }) =>
      channelApis.removeChannel(channelId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};
