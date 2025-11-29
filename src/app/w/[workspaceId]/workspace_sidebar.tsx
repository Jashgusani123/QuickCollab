import { getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import {
  AlertTriangle,
  HashIcon,
  Loader2,
  MessageSquareText,
  SendHorizontal,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace_header";
import { useGetChannels } from "@/features/channel/hooks/use_get_channels";
import { WorkspaceSection } from "./workspace_section";
import { useCurrentMember } from "@/features/member/hooks/use_current_member";
import { useGetAllMembers } from "@/features/member/hooks/use_get_members";
import { UserItem } from "./user_item";
import { useCreateChannelModel } from "@/features/channel/store/use_create_channel_model";
import { useChannelId } from "@/hooks/use_channel_id";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { data: member, isLoading: memberLoading } =
    useCurrentMember(workspaceId);
  const { data: workspace, isLoading: workspaceLoading } =
    getWorkspaceQuery(workspaceId);
  const { data: channel, isLoading: channelLoading } =
    useGetChannels(workspaceId);
  const { data: members, isLoading: membersLoading } =
    useGetAllMembers(workspaceId);

  const [_open, setOpen] = useCreateChannelModel();

  if (workspaceLoading || memberLoading || channelLoading || membersLoading) {
    return (
      <div className="flex flex-col  h-full  items-center justify-center">
        <Loader2 className="size-5 animate-spin text-white " />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col  h-full  items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm ">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg_light  h-full ">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-4 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizontal} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={
          member.role === "admin"
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      >
        {channel?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New Direact Message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={"rightMargin"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
