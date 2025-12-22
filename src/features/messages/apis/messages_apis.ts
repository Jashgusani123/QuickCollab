import api from "@/lib/axios";

export const messageApis = {
  create: (data: FormData) =>
    api.post("/messages/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (data: { id: string; body: string }) => api.put("/messages/update", data),
  remove: (data: { id: string }) => api.post("/messages/remove", data),
  listMessages: ({
    channelId,
    conversationId,
    parentMessageId,
    page,
    limit,
  }: {
    channelId?: string;
    conversationId?: string;
    parentMessageId?: string;
    page: number;
    limit: number;
  }) =>
    api.post("/messages/list", {
      channelId,
      conversationId,
      parentMessageId,
      paginationOpts: { page, limit },
    }),
    getMessageById: (id: string) => api.post(`/messages/getById`, { id }),
};
