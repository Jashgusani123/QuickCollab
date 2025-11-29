import api from "@/lib/axios";


export const memberApis = {
  current: (workspaceId:string) => api.post("members/current",{workspaceId}),
  getAllMembers: (workspaceId:string) => api.post("members/get-all",{workspaceId}),
};
