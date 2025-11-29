import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../apis/workspace_api";

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, joinCode }: { workspaceId: string; joinCode: string }) =>
      workspaceApi.joinWorkspace(workspaceId, joinCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
