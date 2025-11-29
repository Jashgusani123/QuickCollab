import { useQuery } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";

interface UseGetMessagesProps {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
  page: number;
  limit?: number;
}

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
  page,
  limit = 20,
}: UseGetMessagesProps) => {

  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: async () => {
      const res = await messageApis.listMessages({
        channelId,
        conversationId,
        parentMessageId,
        page,
        limit,
      });

      return res.data; // { data, pagination }
    },
    enabled: !!channelId,
    staleTime: 1000,
  });
};
