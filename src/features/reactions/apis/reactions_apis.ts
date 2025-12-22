import api from "@/lib/axios";

export const reationApis = {
  create: (data: {messageId:string , value:string}) =>
    api.post("/reactions/toggle", data),
};
