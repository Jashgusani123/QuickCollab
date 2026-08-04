import { UserButton } from "@/features/auth/components/user_button";
import { WorkspaceSwitcher } from "./workspace_switcher";
import { SidebarButtons } from "./sidebar_buttons";
import { SettingsButton } from "./settings_button";
import { Bell, HomeIcon, MessagesSquareIcon, MoreHorizontal } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { usePathname } from "next/navigation";
import { useChannelId } from "@/hooks/use_channel_id";
import { getIncomingRequestsQuery } from "@/features/request ( notice )/hooks/use_sent_request";

export const Sidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const pathname = usePathname();

  const { data: incomingRequests } = getIncomingRequestsQuery();

  return (
    <aside className="bg_dark flex h-full w-[70px] flex-col items-center gap-y-4 pt-[9px] pb-4 ">
      <WorkspaceSwitcher />
      <SidebarButtons
        icon={HomeIcon}
        label="Home"
        href={`/w/${workspaceId}/`}
        isActive={pathname.endsWith(`/${channelId}`)}
      />
      <SidebarButtons icon={MessagesSquareIcon} label="DMs" />
      <SidebarButtons
        icon={Bell}
        label="Notice"
        href={`/w/${workspaceId}/notice`}
        isActive={pathname.endsWith("/notice")}
        badge={incomingRequests?.length > 0 ? incomingRequests.length : undefined}
      />
      <SidebarButtons icon={MoreHorizontal} label="More" />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <SettingsButton />
        <UserButton />
      </div>
    </aside>
  );
};
