import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../apis/workspace_api";

export const useNewJoinCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceApi.changeJoinCode(workspaceId),
    onSuccess: () => {
      // Refresh workspace and member list after code update
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
    },
  });
};
