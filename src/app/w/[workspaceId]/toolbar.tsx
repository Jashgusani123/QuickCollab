import { Button } from "@/components/ui/button"
import { getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { Dot, Info, Loader2, Search } from "lucide-react"

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const { data, isPending } = getWorkspaceQuery(workspaceId);
    // if(!data) return;
    return (
        <nav className="navbar flex justify-between z-50 h-10 items-center px-4 border-b sidebar-border">
            <div className="flex-1"></div>
            <div className="min-w-[280px] max-w-[642px] grow-4 shrink">
                <Button size={"sm"} className="navbar-search w-full justify-start items-center h-7 px-2 border">
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
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant={"transparent"} size={"iconSm"}>
                    <Info className="size-5 navbar-icon " />
                </Button>

            </div>
        </nav>
    )
}