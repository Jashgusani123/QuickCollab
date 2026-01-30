import api from "@/lib/axios";

export const conversationApis = {
  createOrGet: (data: { memberId: string; workspaceId: string }) =>
    api.post("/conversations/createOrGet", data),
};
