"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { ThemeSettingsDialog } from "@/components/theme/theme-settings-dialog"

export const SettingsButton = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div
                className="flex flex-col items-center justify-start sidebar-surface-1 rounded-md p-1 gap-y-0.5 cursor-pointer group"
                onClick={() => setOpen(true)}
            >
                <Button
                    variant="transparent"
                    className="size-10 p-2 group-hover:bg-accent/20 bg-accent/5"
                >
                    <Settings className="size-5 text-sidebar group-hover:scale-125 transition-all group-hover:rotate-90 duration-300" />
                </Button>
                <span className="text-[11px] text-sidebar-muted group-hover:text-sidebar transition-all">
                    Settings
                </span>
            </div>

            <ThemeSettingsDialog open={open} onOpenChange={setOpen} />
        </>
    )
}
