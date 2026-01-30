"use client";

import { useState } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { DownloadCloud, Info, Search } from "lucide-react";
import { DownloadDesktopDialog } from "./download-desktop-dialog";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = getWorkspaceQuery(workspaceId);

  const [openDownload, setOpenDownload] = useState(false);

  return (
    <>
      <nav className="navbar sidebar-border z-50 flex h-10 items-center justify-between border-b px-4">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <p className="text-lg font-semibold text-white max-[800px]:hidden">
            QuickCollab
          </p>
        </div>

        {/* Search */}
        <div className="max-w-[642px] min-w-[280px] shrink grow-4">
          <Button
            className="navbar-search h-7 w-full justify-start border px-2"
            size="sm"
          >
            <Search className="mr-2 size-4" />
            {!isPending && data ? (
              <span className="text-xs">Search {data.name}</span>
            ) : (
              <span className="text-xs opacity-50">Loading…</span>
            )}
          </Button>
        </div>

        {/* Right Icons */}
        <div className="ml-auto flex flex-1 justify-end gap-1">
          <Hint label="Info" side="left">
            <Button variant="transparent" size="iconSm">
              <Info className="size-5" />
            </Button>
          </Hint>

          <Hint label="Download Desktop app" side="left">
            <Button
              variant="transparent"
              size="iconSm"
              onClick={() => setOpenDownload(true)}
            >
              <DownloadCloud className="size-5" />
            </Button>
          </Hint>
        </div>
      </nav>

      {/* 🔥 Dialog */}
      <DownloadDesktopDialog
        open={openDownload}
        onOpenChange={setOpenDownload}
      />
    </>
  );
};
