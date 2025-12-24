import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../apis/workspace_api";
import { CreateWorkspaceBody, InviteMemberBody, Workspace } from "../workspace.types";

export const getAllworkspacesQuery = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<Workspace[]> => {
      const res = await workspaceApi.getAllworkspaces();
      return res.data.success ? res.data.workspaces : [];
    },
    enabled: options?.enabled ?? true,
  });

export const getWorkspaceQuery = (workspaceId: string) =>
  useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const res = await workspaceApi.getWorkspace(workspaceId);
      return res.data.success ? res.data.workspaces : null;
    },
    enabled: !!workspaceId,
  });

export const createWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceBody) => workspaceApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

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

export const removeWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceApi.removeWorksapce(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
