import api from "@/lib/axios";

export const messageApis = {
  create: (data: FormData) => api.post("/messages/create", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }),
  listMessages: ({ channelId, conversationId, parentMessageId, page, limit }: {
    channelId?: string;
    conversationId?: string;
    parentMessageId?: string;
    page: number;
    limit: number;
  }) => {
    return api.post("/messages/list", {
      channelId,
      conversationId,
      parentMessageId,
      paginationOpts: { page, limit },
    });
  }
};
