import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonsProps {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean
}

export const SidebarButtons = ({ icon: Icon, label, isActive }: SidebarButtonsProps) => {
    return (
        <div className="flex flex-col items-center justify-start bg-accent-foreground/15 rounded-md  p-1 gap-y-0.5 cursor-pointer group ">
            <Button variant={"transparent"}
                className={cn("size-10 p-2 group-hover:bg-accent/20 bg-accent/5", isActive && "bg-accent/20")}
            >
                <Icon className="size-5 text-sidebar group-hover:scale-125 transition-all" />
            </Button>
            <span className="text-[11px] text-sidebar-muted group-hover:text-sidebar transition-all">
                {label}
            </span>
        </div>
    )
}