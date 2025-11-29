import { useMutation, useQueryClient } from "@tanstack/react-query";
import { channelApis } from "../apis/channel_apis";

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({channelId , name}:{channelId:string , name:string}) => channelApis.updateChannel(channelId , name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel"] });
    },
  });
};
