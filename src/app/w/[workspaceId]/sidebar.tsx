import { UserButton } from "@/features/auth/components/user_button"
import { WorkspaceSwitcher } from "./workspace_switcher"
import { SidebarButtons } from "./sidebar_buttons"
import { SettingsButton } from "./settings_button"
import { Bell, HomeIcon,  MessagesSquareIcon, MoreHorizontal } from "lucide-react"

export const Sidebar = ()=>{
    return (
        <aside className="w-[70px] h-full bg_dark flex flex-col gap-y-4 items-center pt-[9px] pb-4">
            <WorkspaceSwitcher />
            <SidebarButtons icon={HomeIcon } label="Home" isActive />
            <SidebarButtons icon={MessagesSquareIcon } label="DMs"  />
            <SidebarButtons icon={Bell} label="Activity"  />
            <SidebarButtons icon={MoreHorizontal } label="More"  />
            <div className="flex flex-col items-center gap-y-1 justify-center mt-auto">
                <SettingsButton />
                <UserButton />
            </div>
        </aside>
    )
}