import api from "@/lib/axios";
import { create } from "domain";

export const conversationApis = {
  create: (data: {memberId:string, workspaceId:string}) =>
    api.post("/conversations/createOrGet", data),
};
