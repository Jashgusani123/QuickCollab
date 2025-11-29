import { useQuery } from "@tanstack/react-query";
import { channelApis } from "../apis/channel_apis";
import { Channel } from "../request_response.typs";

export const useGetChannel = (channelId: string) =>
  useQuery<Channel | null>({
    queryKey: ["channel", channelId],
    queryFn: async () => {
      const res = await channelApis.getChannel(channelId);
      return res.data.success ? (res.data.channel as Channel) : null;
    },
    enabled: !!channelId,
  });
