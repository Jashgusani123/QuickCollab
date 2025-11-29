import { useMutation, useQueryClient } from "@tanstack/react-query";
import { channelApis } from "../apis/channel_apis";

export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({workspaceId , name}:{workspaceId:string , name:string}) => channelApis.createChannel(workspaceId , name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};
