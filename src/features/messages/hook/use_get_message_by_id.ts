import { useQuery } from "@tanstack/react-query";
import { messageApis } from "../apis/messages_apis";

export const useGetMessageById = (id?: string) => {
  return useQuery({
    queryKey: ["message-by-id", id], 
    queryFn: async () => {
      const res = await messageApis.getMessageById(id!);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000,
  });
};
