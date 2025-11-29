// ⚡ src/features/workspace/hooks/use_workspace_info.ts
"use client"

import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "../apis/workspace_api";

export const useWorkspaceInfo = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-info", workspaceId],
    queryFn: async () => {
      const res = await workspaceApi.getInfo(workspaceId);
      return res.data?.success ? res.data.workspace : null;
    },
    enabled: !!workspaceId, // ❗ Run only if workspaceId exists
    retry: 1,
  });
};
