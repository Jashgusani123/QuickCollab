"use client"
import { useGetChannels } from "@/features/channel/hooks/use_get_channels";
import { useCreateChannelModel } from "@/features/channel/store/use_create_channel_model";
import { useCurrentMember } from "@/features/member/hooks/use_current_member";
import { getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function WorkspaceIdPage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModel();

  const { data:member, isLoading:memberLoading } = useCurrentMember(workspaceId);
  const { data:workspace, isLoading:workspaceLoading } = getWorkspaceQuery(workspaceId);
  const { data:channels, isLoading:channelLoading } = useGetChannels(workspaceId);

  const channelID = useMemo(()=>channels?.[0]?._id,[channels])
  const isAdmin = useMemo(()=>member?.role === "admin",[member?.role] )

  useEffect(()=>{
    if(workspaceLoading || channelLoading ||memberLoading||!member|| !workspace){
      return;
    }
    if(channelID){
      router.push(`/w/${workspaceId}/c/${channelID}`);
    }else if(!open && isAdmin){
      setOpen(true)
    }

  },[member , memberLoading,isAdmin,channelID , workspaceLoading , workspace , channelLoading , open , router , workspaceId , setOpen])

  if(workspaceLoading || channelLoading || memberLoading){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!workspace || !member){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Workspace not found</span>
      </div>
    )
  }

  return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    )
}
