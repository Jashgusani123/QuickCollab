"use client"

import { useMemberId } from "@/hooks/use_member_id";
import { useWorkspaceId } from "@/hooks/use_workspace_id";


const MemberIdPage = ()=>{
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();
    return (
        <div>
            Member Id: {JSON.stringify(memberId)} <br/>
            Workspace Id: {JSON.stringify(workspaceId)}
        </div>
    )
}

export default MemberIdPage;