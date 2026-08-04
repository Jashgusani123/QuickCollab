import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

interface SidebarButtonsProps {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean;
    href?: string;
    badge?: number;
}

export const SidebarButtons = ({ icon: Icon, label, isActive, href, badge }: SidebarButtonsProps) => {

    const content = (
        <>
            <Button
                variant={"transparent"}
                className={cn(
                    "size-10 p-2 hover:bg-(--sidebar-hover) transition-colors relative",
                    isActive ? "bg-(--sidebar-active)" : "bg-transparent"
                )}
            >
                <Icon className="sidebar-icon size-5 group-hover:scale-125 transition-all" />
                {badge !== undefined && (
                    <span className="-mt-8 ml-10 absolute flex h-5 w-5 items-center justify-center">
                        {/* Pulsing ring */}
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        {/* Solid badge on top */}
                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[15px] font-sans">
                            {badge}
                        </span>
                    </span>
                )}
            </Button>

            <span className="text-[11px] text-sidebar-muted group-hover:text-sidebar transition-all">
                {label}
            </span>
        </>
    );

    const wrapperClass =
        "flex flex-col items-center justify-start bg-(--sidebar-surface-1) rounded-md p-1 gap-y-0.5 cursor-pointer group";

    return href ? (
        <Link href={href} className={wrapperClass}>
            {content}
        </Link>
    ) : (
        <div className={wrapperClass}>{content}</div>
    );
};