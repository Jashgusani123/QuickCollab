// src/features/channels/hooks/use_channels.ts
import { useQuery } from "@tanstack/react-query";
import { channelApis } from "../apis/channel_apis";
import { Channel } from "../request_response.typs";

export const useGetChannels = (workspaceId: string) =>
  useQuery<Channel[]>({
    queryKey: ["channels", workspaceId],
    queryFn: async () => {
      const res = await channelApis.getChannels(workspaceId);
      return res.data.success ? res.data.channels : [];
    },
    enabled: !!workspaceId, // wait for workspaceId
  });
