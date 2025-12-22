import { ID } from "@/constants";
import { useParams } from "next/navigation";


export const useMemberId = ()=>{
    const params = useParams();
    return params.memberId as ID["memberId"];
}