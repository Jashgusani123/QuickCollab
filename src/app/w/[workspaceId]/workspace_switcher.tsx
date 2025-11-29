"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use_create_workspace_model";
import { getAllworkspacesQuery, getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
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
          className="h-10 w-10 mb-2 bg-[#ABABAB] hover:bg-[#ABABAB]/90 text-slate-800 font-semibold text-xl"
        >
          {isWorkspaceLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className="w-64 p-2">
        
        <DropdownMenuItem
          onClick={() => router.push(`/w/${workspaceId}`)}
          className="cursor-pointer flex flex-col items-start p-2 rounded-md 
          hover:bg-accent/70 focus:bg-accent/80 outline-none"
        >
          <p className="font-medium capitalize">{workspace?.name}</p>
          <span className="text-xs text-muted-foreground">Active workspace</span>
        </DropdownMenuItem>
          <Separator className="mt-2"/>
        {filteredWorkspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws._id}
            onClick={() => router.push(`/w/${ws._id}`)}
            className="cursor-pointer capitalize flex items-center gap-2 p-2 rounded-md 
            hover:bg-accent/70 focus:bg-accent/80 outline-none overflow-hidden"
          >
            <div className="shrink-0 h-8 w-8 flex items-center justify-center rounded-md bg_light text-white mr-1">
              {ws?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{ws.name}</p>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          onClick={() => setOpen(true)}
          className="cursor-pointer flex items-center gap-2 p-2 rounded-md 
          hover:bg-accent/70 focus:bg-accent/80 outline-none "
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-md bg-zinc-200 text-black mr-1">
            <Plus className="size-4" />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
