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

  const messageType = parentMessageId
    ? "thread"
    : conversationId
    ? "conversation"
    : "channel";

  const queryKey =
    messageType === "thread"
      ? ["messages", "thread", parentMessageId, page, limit]
      : messageType === "conversation"
      ? ["messages", "conversation", conversationId, page, limit]
      : ["messages", "channel", channelId, page, limit];

  const enabled =
    messageType === "thread"
      ? !!parentMessageId
      : messageType === "conversation"
      ? !!conversationId
      : !!channelId;

  return useQuery({
    queryKey,
    enabled,
    staleTime: 1000,
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
  });
};
