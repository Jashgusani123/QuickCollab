import { Button } from "@/components/ui/button";
import { getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { Info, Search } from "lucide-react";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = getWorkspaceQuery(workspaceId);

  return (
    <nav className="navbar flex justify-between items-center px-4 border-b sidebar-border h-10 z-50">
      {/* Logo Section */}
      <div className="flex items-center flex-1">
        <div className="flex items-center gap-3">
          <p className="max-[800px]:hidden transition-opacity duration-300 text-lg font-semibold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.35)]">
            QuickCollab
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="min-w-[280px] max-w-[642px] grow-4 shrink">
        <Button
          className="navbar-search w-full justify-start items-center h-7 px-2 border"
          size="sm"
        >
          <Search className="size-4 navbar-icon mr-2" />
          {!isPending && data ? (
            <span className="navbar-text text-xs">Search {data.name}</span>
          ) : (
            <div className="dot-Loader flex justify-center w-full mr-10">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </Button>
      </div>

      {/* Right Icon */}
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 navbar-icon" />
        </Button>
      </div>
    </nav>
  );
};
