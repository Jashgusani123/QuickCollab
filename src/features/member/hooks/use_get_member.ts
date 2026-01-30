import { memberApis } from "@/features/member/apis/member_apis";
import { Member } from "@/features/member/member.type";
import { useQuery } from "@tanstack/react-query";

export const useGetMember = (memberId?: string) =>
  useQuery<Member | null>({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const res = await memberApis.getById(memberId!);
      return res.data.success ? (res.data.member as Member) : null;
    },
    enabled: !!memberId,
  });
