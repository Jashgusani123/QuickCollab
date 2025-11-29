import api from "@/lib/axios";
import {
  CreatedWorkspaceResponse,
  CreateWorkspaceBody,
  InviteMemberBody,
  WorkspaceResponse,
  WorkspacesResponse,
} from "../workspace.types";

export const workspaceApi = {
  create: (data: CreateWorkspaceBody) =>
    api.post<CreatedWorkspaceResponse>("/workspaces", data),

  invite: (data: InviteMemberBody) =>
    api.post(`/workspaces/${data.workspaceId}/invite`, {
      email: data.joinCode,
    }),

  getAllworkspaces: () => api.get<WorkspacesResponse>("workspaces/my-workspaces"),
  getWorkspace: (workspaceId:string) => api.post<WorkspaceResponse>("workspaces/get-one",{workspaceId}),
  updateWorksapce:(workspaceId:string , name:string)=>api.put("workspaces/current-update",{workspaceId , name}),
  removeWorksapce:(workspaceId:string )=>api.delete(`workspaces/current-remove/${workspaceId}`),
  changeJoinCode:(workspaceId:string )=>api.put(`workspaces/change-joincode`,{workspaceId}),
  joinWorkspace:(workspaceId:string,joinCode:string )=>api.post(`workspaces/join-workspace`,{workspaceId,joinCode}),
  getInfo:(workspaceId:string)=>api.post(`workspaces/get-info`,{workspaceId}),
};
