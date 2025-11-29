import { ID } from "@/constants";
import { useParams } from "next/navigation";


export const useWorkspaceId = ()=>{
    const params = useParams();
    return params.workspaceId as ID["workspaceId"];
}