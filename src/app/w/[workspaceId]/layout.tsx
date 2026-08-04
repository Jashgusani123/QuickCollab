"use client";
import React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace_sidebar";
import { usePanel } from "@/hooks/use_panel";
import { Loader2 } from "lucide-react";
import { Thread } from "@/features/messages/components/thread";
import { usePathname } from "next/navigation";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
const workspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onCloseMessage } = usePanel();
  const showPanel = !!parentMessageId;
  const pathname = usePathname();
  const dontShowResizablePanelGroup = pathname.endsWith("/notice");
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {dontShowResizablePanelGroup ? (
          <div className="flex-1 h-full">{children}</div>
        ) : (
          <ResizablePanelGroup direction="horizontal" autoSaveId={"jg-workspace-layout"}>
          <ResizablePanel defaultSize={20} minSize={1} className="bg_dark">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} className="bg_light">
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29} className="bg_light">
                {parentMessageId ? (
                  <Thread 
                    messageId={parentMessageId}
                    onCloseMessage={onCloseMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="text-muted-foreground size-5 animate-spin" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default workspaceIdLayout;
