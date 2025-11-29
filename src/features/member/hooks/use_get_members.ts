import { memberApis } from "@/features/member/apis/member_apis";
import { Member } from "@/features/member/member.type";
import { useQuery } from "@tanstack/react-query";

export const useGetAllMembers = (workspaceId: string) =>
  useQuery<Member[]>({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const res = await memberApis.getAllMembers(workspaceId);
      return res.data.success ? (res.data.members as Member[]) : [];
    },
    enabled: !!workspaceId,
  });
