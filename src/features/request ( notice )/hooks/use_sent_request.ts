import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestApi } from "../apis/request_api";

const SENT_KEY = ["requests", "sent"];
const INCOMING_KEY = ["requests", "incoming"];
const FRIENDS_KEY = ["requests", "friends"];

export interface IncomingRequest {
  oppUserId: string;
  name: string;
  image?: string;
  createdAt: string;
  status: "pending" | "accepted" | "declined";
}

export const getSentRequestsQuery = () =>
  useQuery<string[]>({
    queryKey: SENT_KEY,
    queryFn: async () => {
      const res = await requestApi.getAll();
      return res.data.success ? res.data.sentRequests : [];
    },
    initialData: [],
});

export const getFriendsQuery = () =>
  useQuery<string[]>({
    queryKey: FRIENDS_KEY,
    queryFn: async () => {
      const res = await requestApi.getAll();
      return res.data.success ? res.data.friends : [];
    },
    initialData: [],
  });

// NOTE: backend's getAllRequestResponse doesn't return incomingRequests yet.
// This reads it defensively so the UI works today and picks up real data
// automatically once the backend adds that field — no frontend changes needed then.
export const getIncomingRequestsQuery = () =>
  useQuery<IncomingRequest[]>({
    queryKey: INCOMING_KEY,
    queryFn: async () => {
      const res = await requestApi.getAll();
      const data = res.data as typeof res.data & { incomingRequests?: IncomingRequest[] };
      return data.success ? (data.incomingRequests ?? []) : [];
    },
    initialData: [],
  });

export const sentRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { oppUserId: string }) => requestApi.sent(data),

    onMutate: async ({ oppUserId }) => {
      const previous = queryClient.getQueryData<string[]>(SENT_KEY);

      queryClient.setQueryData<string[]>(SENT_KEY, (old = []) =>
        old.includes(oppUserId) ? old : [...old, oppUserId]
      );

      return { previous };
    },

    onError: (err: any, _variables, context) => {
      if (err?.status === 409) return;
      if (context?.previous) {
        queryClient.setQueryData(SENT_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SENT_KEY });
    },
  });
};

export const acceptRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { oppUserId: string }) => requestApi.accept(data),

    onMutate: async ({ oppUserId }) => {
      await queryClient.cancelQueries({ queryKey: INCOMING_KEY });
      const previous = queryClient.getQueryData<IncomingRequest[]>(INCOMING_KEY);

      queryClient.setQueryData<IncomingRequest[]>(INCOMING_KEY, (old = []) =>
        old.map((r) => (r.oppUserId === oppUserId ? { ...r, status: "accepted" } : r))
      );

      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(INCOMING_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INCOMING_KEY });
    },
  });
};

export const declineRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { oppUserId: string }) => requestApi.decline(data),

    onMutate: async ({ oppUserId }) => {
      await queryClient.cancelQueries({ queryKey: INCOMING_KEY });
      const previous = queryClient.getQueryData<IncomingRequest[]>(INCOMING_KEY);

      queryClient.setQueryData<IncomingRequest[]>(INCOMING_KEY, (old = []) =>
        old.map((r) => (r.oppUserId === oppUserId ? { ...r, status: "declined" } : r))
      );

      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(INCOMING_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INCOMING_KEY });
    },
  });
};