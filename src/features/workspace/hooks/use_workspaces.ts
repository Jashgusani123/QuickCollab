import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../apis/workspace_api";
import { CreateWorkspaceBody, InviteMemberBody, Workspace } from "../workspace.types";

// 🔵 Get All Workspaces (List)
export const getAllworkspacesQuery = () =>
  useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<Workspace[]> => {
      const res = await workspaceApi.getAllworkspaces();
      return res.data.success ? res.data.workspaces : [];
    },
  });

// 🔴 Get a Single Workspace
export const getWorkspaceQuery = (workspaceId: string) =>
  useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const res = await workspaceApi.getWorkspace(workspaceId);
      if (!res.data.success) return null;
      return res.data.workspaces; // return one
    },
    enabled: !!workspaceId,
  });

// 📌 Create Workspace Mutation
export const createWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceBody) => workspaceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

// 🟠 Invite Member Mutation
export const inviteMemberMutation = () =>
  useMutation({
    mutationFn: (data: InviteMemberBody) => workspaceApi.invite(data),
  });


export const updateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, name }: { workspaceId: string; name: string }) =>
      workspaceApi.updateWorksapce(workspaceId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
    },
  });
};

// 🗑️ Delete Workspace Mutation
export const removeWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceApi.removeWorksapce(workspaceId),
    onSuccess: () => {
      // Refresh workspace list after deleting
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};


