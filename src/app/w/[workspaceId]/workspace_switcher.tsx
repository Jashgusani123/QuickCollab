"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use_create_workspace_model";
import { getAllworkspacesQuery, getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [, setOpen] = useCreateWorkspaceModel();

  const { data: workspace, isLoading: isWorkspaceLoading } = getWorkspaceQuery(workspaceId);
  const { data: workspaces, isLoading: isWorkspacesLoading } = getAllworkspacesQuery();

  const filteredWorkspaces = workspaces?.filter((ws) => ws._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-10 w-10 mb-2 sidebar-surface-2 hover:bg-(--sidebar-hover) text-sidebar-text font-semibold text-xl border-2 sidebar-border"
        >
          {isWorkspaceLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className="w-64 p-2 border">
        
        <DropdownMenuItem
          onClick={() => router.push(`/w/${workspaceId}`)}
          className="cursor-pointer flex flex-col items-start p-2 rounded-md outline-none"
        >
          <p className="font-medium capitalize ">{workspace?.name}</p>
          <span className="text-xs text-content-text-muted">Active workspace</span>
        </DropdownMenuItem>
          <Separator className="mt-2"/>
        {filteredWorkspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws._id}
            onClick={() => router.push(`/w/${ws._id}`)}
            className="cursor-pointer capitalize flex items-center  gap-2 p-2 rounded-md outline-none overflow-hidden"
          >
            <div className="shrink-0 h-8 w-8 flex items-center justify-center rounded-md bg-(--sidebar-active) text-white text-sidebar-text mr-1 ">
              {ws?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="truncate text-content-text">{ws.name}</p>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          onClick={() => setOpen(true)}
          className="cursor-pointer flex items-center  gap-2 p-2 rounded-md outline-none"
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-md content-surface-2 text-content-text mr-1 border content-border">
            <Plus className="size-4" />
          </div>
          <span className="text-content-text">Create a new workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
