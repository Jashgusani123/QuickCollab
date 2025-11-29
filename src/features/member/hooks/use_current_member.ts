import { memberApis } from "@/features/member/apis/member_apis";
import { Member } from "@/features/member/member.type";
import { useQuery } from "@tanstack/react-query";

export const useCurrentMember = (workspaceId: string) =>
  useQuery({
    queryKey: ["currentMember", workspaceId],
    queryFn: async () => {
      const res = await memberApis.current(workspaceId);
      return res.data.success ? res.data.member as Member : null;
    },
    enabled: !!workspaceId, 
  });
